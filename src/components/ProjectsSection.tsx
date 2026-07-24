import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import FadeIn from '../ui/FadeIn';
import SourceCodeButton from '../ui/SourceCodeButton';
import CategoryDropdown from '../ui/CategoryDropdown';

// GitHub profile — used as the fallback link for projects without a dedicated repo.
const PROFILE = 'https://github.com/pathakpriyanshu';

type Metric = { value: string; label: string };

type Project = {
  name: string;
  subtitle: string;
  description: string;
  metrics: [Metric, Metric];
  stack: string[];
  href: string;
};

type Category = {
  id: string;
  label: string;
  projects: Project[];
};

// TODO(Priyanshu): edit any card below — name, subtitle, description, metrics,
// stack and href all live here. Cards with `PROFILE` as href are placeholders
// pointing at your GitHub profile until you map a real repo link.
const CATEGORIES: Category[] = [
  {
    id: 'ai-ml',
    label: 'AI / ML',
    projects: [
      {
        name: 'Markowitz Portfolio Optimizer',
        subtitle: 'Quant · Forecasting',
        description:
          'Forecasts equity prices for AAPL, AMZN, GOOG, META and TSLA with per-ticker LSTM models, then feeds the predicted returns into Markowitz mean-variance optimization to compute the efficient-frontier allocation and optimal portfolio weights.',
        metrics: [
          { value: '5 equities', label: 'Per-ticker LSTM models' },
          { value: 'Efficient frontier', label: 'Mean-variance optimization' },
        ],
        stack: ['Python', 'TensorFlow / Keras', 'LSTM', 'NumPy', 'Markowitz'],
        href: 'https://github.com/pathakpriyanshu/Markowitz-Portfolio-Optimizer',
      },
      {
        // The "Bajaj / HackRx" project — described from the actual hackrx_new codebase.
        name: 'Agentic Document RAG Engine',
        subtitle: 'Advanced RAG · LangGraph + Qdrant',
        description:
          'An advanced agentic RAG engine that ingests complex documents — parsing both narrative text and tables from PDFs with PyMuPDF and pdfplumber — then chunks, embeds and indexes them into a Qdrant vector store. A LangGraph agent drives the answer flow: it classifies intent, runs hybrid (dense + BM25) retrieval as a callable tool, self-checks whether the retrieved context is sufficient, rewrites and expands the query when it is not, and only then generates grounded, hallucination-guarded answers — resolving 20 queries in parallel across Azure GPT-4o and Groq.',
        metrics: [
          { value: 'Top 0.26%', label: '26 / 10,000+ · Bajaj HackRx' },
          { value: 'Self-correcting', label: 'Retrieve → verify → expand loop' },
        ],
        stack: ['Python', 'LangGraph', 'Qdrant', 'Hybrid (Vector + BM25)', 'Azure GPT-4o', 'Groq', 'PyMuPDF + pdfplumber'],
        href: 'https://github.com/pathakpriyanshu/hackrx_new',
      },
      {
        name: 'GraphRAG SEC 10-K Analytics',
        subtitle: 'Retrieval-Augmented Generation',
        description:
          "Turns 116 pages of Tesla's 2024 10-K SEC filing into an interactive knowledge graph that answers multi-hop financial questions with traceable citations. Built on Microsoft's GraphRAG to overcome the semantic fragmentation and lack of explainability of traditional vector RAG.",
        metrics: [
          { value: '116-page 10-K', label: 'Tesla 2024 SEC filing' },
          { value: 'Cited answers', label: 'Multi-hop + traceable' },
        ],
        stack: ['Python', 'Microsoft GraphRAG', 'Knowledge Graph', 'LLM', 'Vector Search'],
        href: 'https://github.com/pathakpriyanshu/GraphRAG-financial-analytics',
      },
    ],
  },
  {
    id: 'data-analyst',
    label: 'Data Analyst',
    projects: [
      {
        name: 'UIDAI Aadhaar Data Analysis',
        subtitle: 'Data Cleaning · Anomaly Detection',
        description:
          'A multi-stage cleaning and anomaly-detection pipeline over Aadhaar biometric and demographic datasets — from raw API dumps of ~1.8M records through iterative anomaly filtering to analysis-ready data, plus state/district web scraping and a complete analysis notebook.',
        metrics: [
          { value: '~1.8M records', label: 'Biometric + demographic' },
          { value: '4-stage pipeline', label: 'Raw → cleaned → analysis' },
        ],
        stack: ['Python', 'Pandas', 'Jupyter', 'Web Scraping', 'Anomaly Detection'],
        href: 'https://github.com/pathakpriyanshu/data-hackathon',
      },
      {
        name: 'Finance ETL Pipeline',
        subtitle: 'Automated ETL',
        description:
          "An automated ETL pipeline for Gyftr's finance team with a modular extractor → transformer → validator → loader architecture and a test suite, turning raw DCMS dumps into clean, audit-ready finance data with no manual effort.",
        metrics: [
          { value: 'Extract → Load', label: 'Modular, tested pipeline' },
          { value: 'Audit-ready', label: 'Validated output' },
        ],
        stack: ['Python', 'ETL', 'Pandas', 'Pytest'],
        // Note: this repo is private — visitors without access will see a 404.
        href: 'https://github.com/pathakpriyanshu/Finance-ETL-Pipeline',
      },
      {
        // TODO(Priyanshu): replace with your third Data Analyst project.
        name: 'Project — Coming Soon',
        subtitle: 'Data Analysis',
        description:
          'Placeholder — swap in your third Data Analyst project. Update the name, subtitle, description, metrics, tech stack and Source Code link right here in the CATEGORIES array.',
        metrics: [
          { value: '—', label: 'Add a headline metric' },
          { value: '—', label: 'Add a second metric' },
        ],
        stack: ['Add', 'Your', 'Stack'],
        href: PROFILE,
      },
    ],
  },
  {
    id: 'product',
    label: 'Product',
    projects: [
      {
        // TODO(Priyanshu): confirm details / add a case-study or repo link.
        name: 'Cult.fit Fitness App — MVP',
        subtitle: 'Product Development & Management',
        description:
          'Collaborated with a cross-functional team to design and ship a Minimum Viable Product for a fitness and wellness mobile app — scoping features, shaping the product narrative and aligning design and engineering toward launch.',
        metrics: [
          { value: '0 → 1 MVP', label: 'Cross-functional build' },
          { value: 'Fitness + wellness', label: 'Mobile product' },
        ],
        stack: ['Product Strategy', 'MVP Scoping', 'User Research', 'Roadmapping'],
        href: PROFILE,
      },
      {
        // TODO(Priyanshu): replace with your second Product project.
        name: 'Product Case Study — Coming Soon',
        subtitle: 'Product',
        description:
          'Placeholder — swap in a Product project. Update the name, subtitle, description, metrics, tech stack and Source Code link right here in the CATEGORIES array.',
        metrics: [
          { value: '—', label: 'Add a headline metric' },
          { value: '—', label: 'Add a second metric' },
        ],
        stack: ['Add', 'Your', 'Focus'],
        href: PROFILE,
      },
      {
        // TODO(Priyanshu): replace with your third Product project.
        name: 'Product Case Study — Coming Soon',
        subtitle: 'Product',
        description:
          'Placeholder — swap in a Product project. Update the name, subtitle, description, metrics, tech stack and Source Code link right here in the CATEGORIES array.',
        metrics: [
          { value: '—', label: 'Add a headline metric' },
          { value: '—', label: 'Add a second metric' },
        ],
        stack: ['Add', 'Your', 'Focus'],
        href: PROFILE,
      },
    ],
  },
];

const RADIUS = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]';

function ProjectCard({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const number = String(index + 1).padStart(2, '0');

  return (
    <div className="sticky top-24 md:top-28">
      <motion.div
        className={`${RADIUS} flex min-h-[74vh] flex-col border-2 border-[#D7E2EA] p-6 sm:p-8 md:p-12`}
        style={{
          background: '#0C0C0C',
          scale,
          top: `${index * 28}px`,
          transformOrigin: 'top center',
        }}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-10">
            <span
              className="font-black leading-none text-[#D7E2EA]"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {number}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/60 sm:text-sm">
                {project.subtitle}
              </span>
              <h3
                className="font-medium uppercase leading-tight text-[#D7E2EA]"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {project.name}
              </h3>
            </div>
          </div>

          <SourceCodeButton href={project.href} />
        </div>

        {/* Description */}
        <p
          className="mt-8 max-w-3xl font-light leading-relaxed text-[#D7E2EA]/70 md:mt-10"
          style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.35rem)' }}
        >
          {project.description}
        </p>

        {/* Footer: metrics + stack */}
        <div className="mt-auto pt-8">
          <div className="flex flex-wrap gap-8 sm:gap-14">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="flex flex-col gap-1">
                <span
                  className="font-medium leading-none text-[#D7E2EA]"
                  style={{ fontSize: 'clamp(1.4rem, 3vw, 2.6rem)' }}
                >
                  {metric.value}
                </span>
                <span className="text-xs uppercase tracking-widest text-[#D7E2EA]/50 sm:text-sm">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[#D7E2EA]/25 px-4 py-1.5 text-xs font-light uppercase tracking-widest text-[#D7E2EA]/80 sm:text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const activeCategory =
    CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[0];

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative z-10 -mt-10 rounded-t-[40px] px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10"
      style={{ background: '#0C0C0C' }}
    >
      <FadeIn
        as="h2"
        delay={0}
        y={40}
        className="hero-heading mb-10 text-center font-black uppercase leading-none tracking-tight sm:mb-12 md:mb-16"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Projects
      </FadeIn>

      <div className="mb-16 flex justify-center sm:mb-20 md:mb-24">
        <CategoryDropdown
          options={CATEGORIES.map(({ id, label }) => ({ id, label }))}
          activeId={activeId}
          onChange={setActiveId}
        />
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          key={activeCategory.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {activeCategory.projects.map((project, i) => (
            <ProjectCard
              key={`${activeCategory.id}-${i}`}
              project={project}
              index={i}
              total={activeCategory.projects.length}
              progress={scrollYProgress}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
