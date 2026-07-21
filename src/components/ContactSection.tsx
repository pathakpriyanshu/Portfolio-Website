import { Mail, Github, Linkedin } from 'lucide-react';
import FadeIn from '../ui/FadeIn';

// TODO(Priyanshu): update these links with your real profiles.
const LINKS = [
  {
    label: 'Email',
    value: 'priyanshupathak3337@gmail.com',
    href: 'mailto:priyanshupathak3337@gmail.com',
    Icon: Mail,
  },
  {
    label: 'GitHub',
    value: 'github.com/your-username',
    href: 'https://github.com/your-username',
    Icon: Github,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/your-profile',
    href: 'https://linkedin.com/in/your-profile',
    Icon: Linkedin,
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative z-10 -mt-10 flex min-h-screen flex-col items-center justify-center rounded-t-[40px] px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10"
      style={{ background: '#0C0C0C' }}
    >
      <FadeIn
        as="h2"
        delay={0}
        y={40}
        className="hero-heading text-center font-black uppercase leading-none tracking-tight"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Let&apos;s Connect
      </FadeIn>

      <FadeIn delay={0.15} y={20}>
        <p
          className="mt-8 max-w-[560px] text-center font-medium leading-relaxed text-[#D7E2EA] sm:mt-10 md:mt-12"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
        >
          Open to internships, roles, and collaborations in AI/ML. Feel free to
          reach out — I&apos;d love to hear from you.
        </p>
      </FadeIn>

      <div className="mt-12 flex w-full max-w-2xl flex-col gap-4 sm:mt-16 md:mt-20">
        {LINKS.map((link, i) => (
          <FadeIn key={link.label} delay={0.25 + i * 0.1} y={20}>
            <a
              href={link.href}
              target={link.label === 'Email' ? undefined : '_blank'}
              rel={link.label === 'Email' ? undefined : 'noopener noreferrer'}
              className="group flex items-center justify-between gap-4 rounded-full border-2 border-[#D7E2EA] px-6 py-4 transition-colors duration-200 hover:bg-[#D7E2EA]/10 sm:px-8 sm:py-5"
            >
              <span className="flex items-center gap-4">
                <link.Icon
                  className="h-5 w-5 text-[#D7E2EA] sm:h-6 sm:w-6"
                  strokeWidth={1.75}
                />
                <span className="text-xs font-medium uppercase tracking-widest text-[#D7E2EA] sm:text-sm">
                  {link.label}
                </span>
              </span>
              <span className="truncate font-light text-[#D7E2EA]/70 sm:text-lg">
                {link.value}
              </span>
            </a>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.6} y={20}>
        <p className="mt-16 text-xs font-light uppercase tracking-widest text-[#D7E2EA]/40 sm:mt-24">
          © {new Date().getFullYear()} Priyanshu Pathak
        </p>
      </FadeIn>
    </section>
  );
}
