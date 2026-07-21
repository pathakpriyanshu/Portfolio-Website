import { motion } from 'framer-motion';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';

const DURATION = 15; // seconds

type Tok = 'base' | 'keyword' | 'string' | 'number' | 'func' | 'comment' | 'ident';

const COLOR: Record<Tok, string> = {
  base: '#8b94a3',
  keyword: '#c79bf2',
  string: '#8fd98f',
  number: '#f0a868',
  func: '#7cc7ff',
  comment: '#5a6472',
  ident: '#aab4c2',
};

type Language = {
  id: string;
  filename: string;
  label: string;
  lineComment: string;
  keywords: Set<string>;
  snippet: string;
};

// TODO(Priyanshu): swap these snippets for whatever you'd rather show off.
const LANGUAGES: Language[] = [
  {
    id: 'python',
    filename: 'train.py',
    label: 'PYTHON',
    lineComment: '#',
    keywords: new Set([
      'import', 'from', 'as', 'class', 'def', 'return', 'self', 'for', 'in',
      'if', 'else', 'elif', 'while', 'with', 'lambda', 'None', 'True',
      'False', 'and', 'or', 'not', 'super',
    ]),
    snippet: `import torch
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(784, 128),
    nn.ReLU(),
    nn.Linear(128, 10),
)
optimizer = torch.optim.Adam(model.parameters())`,
  },
  {
    id: 'go',
    filename: 'train.go',
    label: 'GO',
    lineComment: '//',
    keywords: new Set([
      'package', 'import', 'func', 'return', 'for', 'if', 'else', 'range',
      'var', 'const', 'type', 'struct', 'interface', 'defer',
    ]),
    snippet: `package main

import "fmt"

func trainModel(epochs int) string {
    for i := 0; i < epochs; i++ {
        fmt.Println("epoch", i)
    }
    return "done"
}`,
  },
  {
    id: 'cpp',
    filename: 'train.cpp',
    label: 'C++',
    lineComment: '//',
    keywords: new Set([
      'include', 'class', 'public', 'private', 'protected', 'return',
      'float', 'int', 'double', 'void', 'const', 'struct', 'namespace',
      'using', 'new', 'this',
    ]),
    snippet: `#include <vector>
#include <iostream>

class Model {
public:
    std::vector<float> weights;

    float forward(float x) {
        return x * weights[0];
    }
};`,
  },
  {
    id: 'java',
    filename: 'Model.java',
    label: 'JAVA',
    lineComment: '//',
    keywords: new Set([
      'import', 'public', 'class', 'private', 'protected', 'static', 'void',
      'double', 'int', 'float', 'return', 'new', 'this', 'extends',
    ]),
    snippet: `import java.util.List;

public class Model {
    private List<Double> weights;

    public double forward(double x) {
        return x * weights.get(0);
    }
}`,
  },
  {
    id: 'rust',
    filename: 'model.rs',
    label: 'RUST',
    lineComment: '//',
    keywords: new Set([
      'use', 'struct', 'impl', 'fn', 'self', 'let', 'mut', 'pub', 'return',
      'match', 'if', 'else', 'for', 'in',
    ]),
    snippet: `use std::vec::Vec;

struct Model {
    weights: Vec<f32>,
}

impl Model {
    fn forward(&self, x: f32) -> f32 {
        x * self.weights[0]
    }
}`,
  },
];

function classify(src: string, keywords: Set<string>, lineComment: string): Tok[] {
  const colors: Tok[] = new Array(src.length).fill('base');
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (lineComment && src.startsWith(lineComment, i)) {
      let j = i;
      while (j < src.length && src[j] !== '\n') colors[j++] = 'comment';
      i = j;
      continue;
    }
    if (c === '"' || c === "'") {
      const q = c;
      let j = i;
      colors[j++] = 'string';
      while (j < src.length && src[j] !== '\n') {
        colors[j] = 'string';
        if (src[j] === q) {
          j++;
          break;
        }
        j++;
      }
      i = j;
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
      const word = src.slice(i, j);
      const t: Tok = keywords.has(word)
        ? 'keyword'
        : src[j] === '('
          ? 'func'
          : 'ident';
      for (let k = i; k < j; k++) colors[k] = t;
      i = j;
      continue;
    }
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < src.length && /[0-9._eE]/.test(src[j])) j++;
      for (let k = i; k < j; k++) colors[k] = 'number';
      i = j;
      continue;
    }
    i++;
  }
  return colors;
}

// Skip newlines and the indentation that follows, so the user never types
// leading whitespace — the fair behaviour real code-typing tools use.
function nextTypeable(src: string, pos: number): number {
  while (pos < src.length && src[pos] === '\n') {
    pos++;
    while (pos < src.length && (src[pos] === ' ' || src[pos] === '\t')) pos++;
  }
  return pos;
}

type LineData = { chars: { ch: string; gi: number }[] };

function buildLines(src: string): LineData[] {
  const out: LineData[] = [];
  let gi = 0;
  src.split('\n').forEach((text, li, arr) => {
    const chars: { ch: string; gi: number }[] = [];
    for (const ch of text) chars.push({ ch, gi: gi++ });
    if (li < arr.length - 1) gi++; // account for the '\n'
    out.push({ chars });
  });
  return out;
}

type CodeTypingGameProps = {
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
};

export default function CodeTypingGame({
  interactive = false,
  className = '',
  style,
}: CodeTypingGameProps) {
  const [langIndex, setLangIndex] = useState(0);
  const language = LANGUAGES[langIndex];
  const snippet = language.snippet;

  const base = useMemo(
    () => classify(snippet, language.keywords, language.lineComment),
    [snippet, language]
  );
  const startPos = useMemo(() => nextTypeable(snippet, 0), [snippet]);
  const lines = useMemo(() => buildLines(snippet), [snippet]);

  const [pos, setPos] = useState(startPos);
  const [correctness, setCorrectness] = useState<Record<number, boolean>>({});
  const [, setVisited] = useState<number[]>([]);
  const [typed, setTyped] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [finalTime, setFinalTime] = useState(DURATION);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [focused, setFocused] = useState(false);
  const startRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Re-initialize typing state whenever the active language (and thus the
  // snippet) changes — including the very first mount.
  useEffect(() => {
    setPos(startPos);
    setCorrectness({});
    setVisited([]);
    setTyped(0);
    setCorrect(0);
    setStarted(false);
    setFinished(false);
    setFinalTime(DURATION);
    setTimeLeft(DURATION);
    startRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippet]);

  const nextLanguage = useCallback(() => {
    setLangIndex((i) => (i + 1) % LANGUAGES.length);
  }, []);

  // Interactive countdown timer.
  useEffect(() => {
    if (!interactive || !started || finished) return;
    const id = setInterval(() => {
      const elapsed = (Date.now() - (startRef.current ?? Date.now())) / 1000;
      const left = Math.max(0, DURATION - elapsed);
      setTimeLeft(left);
      if (left <= 0) {
        setFinalTime(DURATION);
        setFinished(true);
      }
    }, 100);
    return () => clearInterval(id);
  }, [interactive, started, finished]);

  // Demo mode: auto-type the snippet on a loop.
  useEffect(() => {
    if (interactive) return;
    let p = startPos;
    setPos(startPos);
    const id = setInterval(() => {
      p = nextTypeable(snippet, p + 1);
      if (p >= snippet.length) {
        setPos(snippet.length);
        p = snippet.length;
        setTimeout(() => {
          p = startPos;
          setPos(startPos);
        }, 1600);
      } else {
        setPos(p);
      }
    }, 55);
    return () => clearInterval(id);
  }, [interactive, snippet, startPos]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!interactive || finished) return;

      if (e.key === 'Tab') {
        e.preventDefault();
        return;
      }
      if (e.key === 'Backspace') {
        e.preventDefault();
        setVisited((v) => {
          if (v.length === 0) return v;
          const last = v[v.length - 1];
          setCorrectness((c) => {
            const next = { ...c };
            const wasCorrect = next[last];
            delete next[last];
            setTyped((n) => Math.max(0, n - 1));
            if (wasCorrect) setCorrect((n) => Math.max(0, n - 1));
            return next;
          });
          setPos(last);
          return v.slice(0, -1);
        });
        return;
      }
      if (e.key.length !== 1) return; // ignore Shift, arrows, etc.
      e.preventDefault();

      if (!started) {
        setStarted(true);
        startRef.current = Date.now();
        setTimeLeft(DURATION);
      }

      const expected = snippet[pos];
      const isCorrect = e.key === expected;
      setCorrectness((c) => ({ ...c, [pos]: isCorrect }));
      setVisited((v) => [...v, pos]);
      setTyped((n) => n + 1);
      if (isCorrect) setCorrect((n) => n + 1);

      const np = nextTypeable(snippet, pos + 1);
      setPos(np);
      if (np >= snippet.length) {
        const elapsed = (Date.now() - (startRef.current ?? Date.now())) / 1000;
        setFinalTime(Math.max(0.5, Math.min(DURATION, elapsed)));
        setFinished(true);
      }
    },
    [interactive, finished, started, pos, snippet]
  );

  const wpm = useMemo(() => {
    const mins = (finished ? finalTime : DURATION - timeLeft) / 60;
    if (mins <= 0) return 0;
    return Math.round(correct / 5 / mins);
  }, [correct, finished, finalTime, timeLeft]);

  const accuracy = typed > 0 ? Math.round((correct / typed) * 100) : 100;

  const showCaret = interactive ? focused && !finished : true;

  return (
    <div
      ref={containerRef}
      tabIndex={interactive ? 0 : -1}
      onKeyDown={onKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`relative overflow-hidden rounded-2xl border border-white/10 outline-none ${className}`}
      style={{
        background: 'linear-gradient(160deg, #0e1016 0%, #0a0b0f 100%)',
        boxShadow:
          '0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,199,255,0.04), inset 0 1px 0 rgba(255,255,255,0.04)',
        ...style,
      }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-[#8b94a3]">{language.filename}</span>
        <span className="ml-auto flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
          <span
            className="font-mono text-xs tabular-nums"
            style={{ color: timeLeft <= 5 && started ? '#f0a868' : '#8b94a3' }}
          >
            {interactive
              ? `${Math.ceil(finished ? 0 : timeLeft)}s`
              : language.label}
          </span>
        </span>
      </div>

      {/* Code */}
      <div
        className="overflow-x-auto px-4 py-4 md:px-5"
        style={{ scrollbarWidth: 'none' }}
      >
        <div
          className="font-mono leading-relaxed"
          style={{ fontSize: 'clamp(12px, 1.05vw, 14.5px)' }}
        >
          {lines.map((line, li) => (
            <div key={li} className="flex whitespace-pre">
              <span className="mr-4 select-none text-right text-[#3f4756]" style={{ minWidth: '1.5em' }}>
                {li + 1}
              </span>
              <span>
                {line.chars.length === 0 ? (
                  <span>&nbsp;</span>
                ) : (
                  line.chars.map(({ ch, gi }) => {
                    const isCurrent = gi === pos && showCaret;
                    let color = COLOR[base[gi]];
                    let opacity = 1;
                    let background = 'transparent';

                    if (gi >= pos) {
                      opacity = 0.32; // not yet typed
                    } else if (interactive && gi in correctness) {
                      if (!correctness[gi]) {
                        color = '#f2606c';
                        background = 'rgba(242,96,108,0.16)';
                      }
                    }

                    return (
                      <span key={gi} style={{ position: 'relative' }}>
                        {isCurrent && (
                          <motion.span
                            aria-hidden
                            className="absolute -left-[1px] top-[0.1em] inline-block w-[2px]"
                            style={{ height: '1.15em', background: '#7cc7ff' }}
                            animate={{ opacity: [1, 1, 0, 0] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: 'linear',
                              times: [0, 0.5, 0.5, 1],
                            }}
                          />
                        )}
                        <span style={{ color, opacity, background }}>{ch}</span>
                      </span>
                    );
                  })
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / stats */}
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider">
        {interactive ? (
          <>
            <span className="text-[#7cc7ff]">
              {wpm} <span className="text-[#5a6472]">wpm</span>
            </span>
            <span className="text-[#8fd98f]">
              {accuracy}% <span className="text-[#5a6472]">acc</span>
            </span>
          </>
        ) : (
          <>
            <span className="text-[#5a6472]">// building neural nets</span>
            <span className="flex items-center gap-1.5 text-[#8fd98f]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8fd98f]" />
              live
            </span>
          </>
        )}
      </div>

      {/* Click-to-start overlay */}
      {interactive && !focused && !finished && (
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center"
          style={{ background: 'rgba(8,9,13,0.72)', backdropFilter: 'blur(2px)' }}
        >
          <span className="font-mono text-sm text-[#7cc7ff]">
            ▶ 15-second {language.label} sprint
          </span>
          <span className="font-mono text-xs text-[#8b94a3]">
            Click here, then start typing the code
          </span>
        </div>
      )}

      {/* Results overlay */}
      {interactive && finished && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 text-center"
          style={{ background: 'rgba(8,9,13,0.86)', backdropFilter: 'blur(3px)' }}
        >
          <span className="font-mono text-xs uppercase tracking-widest text-[#8b94a3]">
            Sprint complete
          </span>
          <div className="flex items-end gap-8">
            <div>
              <div className="font-mono text-4xl font-bold text-[#7cc7ff]">{wpm}</div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#5a6472]">wpm</div>
            </div>
            <div>
              <div className="font-mono text-4xl font-bold text-[#8fd98f]">{accuracy}%</div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#5a6472]">accuracy</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              nextLanguage();
              requestAnimationFrame(() => containerRef.current?.focus());
            }}
            className="mt-1 rounded-full border border-[#7cc7ff]/40 px-6 py-2 font-mono text-xs uppercase tracking-widest text-[#D7E2EA] transition-colors duration-200 hover:bg-[#7cc7ff]/10"
          >
            Try again — {LANGUAGES[(langIndex + 1) % LANGUAGES.length].label}
          </button>
        </div>
      )}
    </div>
  );
}
