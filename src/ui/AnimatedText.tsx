import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { CSSProperties } from 'react';

type AnimatedTextProps = {
  text: string;
  className?: string;
  style?: CSSProperties;
};

type CharProps = {
  char: string;
  start: number;
  end: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
};

function Char({ char, start, end, progress }: CharProps) {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block">
      <span className="opacity-0">{char}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>
        {char}
      </motion.span>
    </span>
  );
}

export default function AnimatedText({
  text,
  className,
  style,
}: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = text.split('');

  return (
    <p ref={ref} className={className} style={style}>
      {chars.map((char, i) => {
        const start = i / chars.length;
        const end = (i + 1) / chars.length;
        return char === ' ' ? (
          <span key={i}> </span>
        ) : (
          <Char
            key={i}
            char={char}
            start={start}
            end={end}
            progress={scrollYProgress}
          />
        );
      })}
    </p>
  );
}
