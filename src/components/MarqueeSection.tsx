import { useEffect, useRef, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  SiPython,
  SiPytorch,
  SiTensorflow,
  SiKeras,
  SiScikitlearn,
  SiPandas,
  SiNumpy,
  SiLangchain,
  SiHuggingface,
  SiQdrant,
  SiMilvus,
  SiDatabricks,
  SiFastapi,
  SiRedis,
  SiDocker,
  SiCelery,
  SiSupabase,
  SiJupyter,
} from 'react-icons/si';
import { RiOpenaiFill } from 'react-icons/ri';
import { VscAzure } from 'react-icons/vsc';
import { FaAws } from 'react-icons/fa6';

type Logo = { name: string; Icon: IconType; color: string };

// Priyanshu's real toolkit — pulled from the resumes + GitHub repos.
// `color` is each brand's colour, adjusted where the official value is too
// dark to read on the #0C0C0C background (e.g. Pandas #150458, NumPy #013243).
const LOGOS: Logo[] = [
  { name: 'Python', Icon: SiPython, color: '#4B8BBE' },
  { name: 'PyTorch', Icon: SiPytorch, color: '#EE4C2C' },
  { name: 'TensorFlow', Icon: SiTensorflow, color: '#FF6F00' },
  { name: 'Keras', Icon: SiKeras, color: '#D00000' },
  { name: 'scikit-learn', Icon: SiScikitlearn, color: '#F7931E' },
  { name: 'Pandas', Icon: SiPandas, color: '#E70488' },
  { name: 'NumPy', Icon: SiNumpy, color: '#4DABCF' },
  { name: 'LangChain', Icon: SiLangchain, color: '#35C56A' },
  { name: 'Hugging Face', Icon: SiHuggingface, color: '#FFD21E' },
  { name: 'OpenAI', Icon: RiOpenaiFill, color: '#10A37F' },
  { name: 'Qdrant', Icon: SiQdrant, color: '#DC244C' },
  { name: 'Milvus', Icon: SiMilvus, color: '#00A1EA' },
  { name: 'Databricks', Icon: SiDatabricks, color: '#FF3621' },
  { name: 'Azure', Icon: VscAzure, color: '#3B9EFF' },
  { name: 'AWS', Icon: FaAws, color: '#FF9900' },
  { name: 'FastAPI', Icon: SiFastapi, color: '#12A594' },
  { name: 'Redis', Icon: SiRedis, color: '#FF4438' },
  { name: 'Docker', Icon: SiDocker, color: '#2496ED' },
  { name: 'Celery', Icon: SiCelery, color: '#4CAF50' },
  { name: 'Supabase', Icon: SiSupabase, color: '#3FCF8E' },
  { name: 'Jupyter', Icon: SiJupyter, color: '#F37626' },
];

const ROW_ONE = LOGOS.slice(0, 11);
const ROW_TWO = LOGOS.slice(11);

function LogoTile({ name, Icon, color }: Logo) {
  return (
    <div className="flex h-20 shrink-0 items-center gap-4 rounded-2xl border border-[#D7E2EA]/20 bg-[#D7E2EA]/[0.04] px-7 sm:h-24 sm:px-9">
      <Icon className="h-7 w-7 sm:h-8 sm:w-8" style={{ color }} aria-hidden />
      <span className="whitespace-nowrap text-base font-medium uppercase tracking-widest text-[#D7E2EA]/90 sm:text-lg">
        {name}
      </span>
    </div>
  );
}

function Row({ logos, offset }: { logos: Logo[]; offset: number }) {
  const tripled = [...logos, ...logos, ...logos];

  return (
    <div
      className="flex gap-3 sm:gap-4"
      style={{ transform: `translateX(${offset}px)`, willChange: 'transform' }}
    >
      {tripled.map((logo, i) => (
        <LogoTile key={`${logo.name}-${i}`} {...logo} />
      ))}
    </div>
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;

      const sectionTop = el.offsetTop;
      const raw = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(raw);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pb-14 pt-24 sm:pt-32 md:pt-40"
      style={{ background: '#0C0C0C' }}
    >
      <div className="relative z-10 mb-10 text-center sm:mb-14">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#D7E2EA]/50 sm:text-sm">
          The Toolkit
        </span>
        <h2
          className="hero-heading mt-3 font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
        >
          Tech Stack
        </h2>
      </div>

      <div className="relative">
        {/* Soft glow so the strip lifts off the flat black background */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[92%] max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(139,92,246,0.22) 0%, rgba(240,121,59,0.08) 45%, transparent 72%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="relative flex flex-col gap-3 sm:gap-4">
          <Row logos={ROW_ONE} offset={offset - 200} />
          <Row logos={ROW_TWO} offset={-(offset - 200)} />
        </div>
      </div>
    </section>
  );
}
