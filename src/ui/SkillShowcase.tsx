import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Topic = { title: string; font: string; subs: string[] };

// TODO(Priyanshu): edit these topics and their sub-skills to match yours.
const TOPICS: Topic[] = [
  {
    title: 'Agentic AI',
    font: "'Orbitron', sans-serif",
    subs: ['LangGraph', 'Strand Agents', 'RAG Pipelines', 'Vector Databases', 'Tool Calling'],
  },
  {
    title: 'Fine Tuning',
    font: "'Space Grotesk', sans-serif",
    subs: ['LoRA / QLoRA', 'Model Distillation', 'RLHF', 'Quantization', 'PEFT'],
  },
  {
    title: 'Machine Learning',
    font: "'Chakra Petch', sans-serif",
    subs: ['Regression', 'Classification', 'Clustering', 'XGBoost', 'Feature Engineering'],
  },
  {
    title: 'Deep Learning',
    font: "'Syne', sans-serif",
    subs: ['CNNs', 'Transformers', 'Attention', 'Embeddings', 'Backpropagation'],
  },
  {
    title: 'Prompt Engineering',
    font: "'JetBrains Mono', monospace",
    subs: ['Few-Shot', 'Chain-of-Thought', 'ReAct', 'System Prompts', 'Guardrails'],
  },
];

const MAIN_TYPE = 85; // ms per char, main heading
const MAIN_DELETE = 42; // ms per char, deleting
const SUB_TYPE = 34; // ms per char, sub-list (faster)
const SUB_LINE_GAP = 160; // pause between sub lines
const HOLD = 1500; // pause once the sub-list is complete

type Phase = 'run' | 'hold' | 'out';

function Caret({ color }: { color: string }) {
  return (
    <motion.span
      aria-hidden
      className="ml-0.5 inline-block"
      style={{ color }}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear', times: [0, 0.5, 0.5, 1] }}
    >
      |
    </motion.span>
  );
}

export default function SkillShowcase() {
  const [topic, setTopic] = useState(0);
  const [titleLen, setTitleLen] = useState(0);
  const [subLine, setSubLine] = useState(0);
  const [subChar, setSubChar] = useState(0);
  const [phase, setPhase] = useState<Phase>('run');
  const [exiting, setExiting] = useState(false);

  const data = TOPICS[topic];
  const { title, subs } = data;

  // Main heading types in (during run).
  useEffect(() => {
    if (phase !== 'run' || titleLen >= title.length) return;
    const t = setTimeout(() => setTitleLen((l) => l + 1), MAIN_TYPE);
    return () => clearTimeout(t);
  }, [phase, titleLen, title]);

  // Sub-list types in, line by line (during run). Drives the transition.
  useEffect(() => {
    if (phase !== 'run') return;
    if (subLine >= subs.length) {
      setPhase('hold');
      return;
    }
    const cur = subs[subLine];
    if (subChar < cur.length) {
      const t = setTimeout(() => setSubChar((c) => c + 1), SUB_TYPE);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setSubLine((l) => l + 1);
      setSubChar(0);
    }, SUB_LINE_GAP);
    return () => clearTimeout(t);
  }, [phase, subLine, subChar, subs]);

  // Hold once everything is shown.
  useEffect(() => {
    if (phase !== 'hold') return;
    const t = setTimeout(() => {
      setExiting(true);
      setPhase('out');
    }, HOLD);
    return () => clearTimeout(t);
  }, [phase]);

  // Delete the heading, fade the list, then advance to the next topic.
  useEffect(() => {
    if (phase !== 'out') return;
    if (titleLen > 0) {
      const t = setTimeout(() => setTitleLen((l) => l - 1), MAIN_DELETE);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setExiting(false);
      setSubLine(0);
      setSubChar(0);
      setTopic((tp) => (tp + 1) % TOPICS.length);
      setPhase('run');
    }, 160);
    return () => clearTimeout(t);
  }, [phase, titleLen]);

  return (
    <>
      {/* Main topic — center, below the H1 */}
      <div className="pointer-events-none relative z-20 mt-8 flex min-h-[3.5rem] items-center justify-center px-6 sm:mt-10 sm:min-h-[4rem] md:mt-9 md:min-h-[4.5rem]">
        <span
          className="hero-heading text-center font-bold leading-none"
          style={{ fontFamily: data.font, fontSize: 'clamp(1.5rem, 4.5vw, 3.25rem)' }}
        >
          {title.slice(0, titleLen)}
        </span>
        <Caret color="#8fa0b3" />
      </div>

      {/* Sub-skill cascade — left side, desktop only */}
      <div
        className="pointer-events-none absolute left-6 top-[37%] z-10 hidden w-[min(42vw,460px)] md:left-10 md:block lg:left-14"
        style={{ opacity: exiting ? 0 : 1, transition: 'opacity 0.4s ease' }}
      >
        <div className="flex flex-col gap-3 sm:gap-4">
          {subs.map((s, i) => {
            if (i > subLine) return null;
            const shown = i < subLine ? s : s.slice(0, subChar);
            const isActive = i === subLine && phase === 'run';
            const gradient = i % 2 === 0;
            return (
              <motion.div
                key={`${topic}-${i}`}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex items-baseline gap-3 font-semibold"
                style={{ fontSize: 'clamp(1.05rem, 1.9vw, 1.7rem)', fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="font-mono text-[0.58em] text-[#7cc7ff]/45">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex items-baseline">
                  <span className={gradient ? 'skill-gradient' : 'text-[#EAF1F6]'}>{shown}</span>
                  {isActive && <Caret color={gradient ? '#c46be8' : '#EAF1F6'} />}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}
