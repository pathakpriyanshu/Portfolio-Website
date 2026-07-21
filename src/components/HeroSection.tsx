import CodeTypingGame from '../ui/CodeTypingGame';
import ContactButton from '../ui/ContactButton';
import FadeIn from '../ui/FadeIn';
import SkillShowcase from '../ui/SkillShowcase';

const NAV_LINKS = ['About', 'Skills', 'Projects', 'Contact'];

export default function HeroSection() {
  return (
    <section
      className="relative flex h-screen flex-col"
      style={{ background: '#0C0C0C', overflowX: 'clip' }}
    >
      {/* Background: dot grid, faded toward the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'radial-gradient(rgba(215,226,234,0.07) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          maskImage:
            'radial-gradient(ellipse at center, black 35%, transparent 82%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 35%, transparent 82%)',
        }}
      />

      {/* Background: colored glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-12%] left-1/2 z-0 h-[560px] w-[560px] -translate-x-1/2 md:h-[820px] md:w-[820px]"
        style={{
          background:
            'radial-gradient(circle at center, rgba(118,33,176,0.32) 0%, rgba(182,0,168,0.14) 34%, rgba(190,76,0,0.06) 56%, transparent 72%)',
        }}
      />

      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="relative z-10 flex justify-between px-6 pt-6 md:px-10 md:pt-8"
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
          >
            {link}
          </a>
        ))}
      </FadeIn>

      <div className="relative z-10 overflow-hidden">
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading mt-6 w-full whitespace-nowrap text-center text-[10.8vw] font-black uppercase leading-none tracking-tight sm:mt-4 md:-mt-5"
        >
          Hi, i&apos;m Priyanshu
        </FadeIn>
      </div>

      {/* Synchronized main topic + left sub-skill cascade */}
      <SkillShowcase />

      {/* Mobile: auto-typing demo terminal */}
      <FadeIn delay={0.6} y={20} className="relative z-20 mt-10 px-6 md:hidden">
        <CodeTypingGame />
      </FadeIn>

      <div className="relative z-20 mt-auto flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p
            className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            an ai/ml enthusiast building intelligent, data-driven solutions
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      {/* Desktop: interactive 15-second code sprint */}
      <FadeIn
        delay={0.6}
        y={30}
        className="absolute bottom-28 right-6 z-20 hidden w-[clamp(380px,40vw,540px)] md:block lg:right-12"
      >
        <CodeTypingGame interactive />
      </FadeIn>
    </section>
  );
}
