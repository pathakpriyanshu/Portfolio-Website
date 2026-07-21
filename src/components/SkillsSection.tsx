import FadeIn from '../ui/FadeIn';

// TODO(Priyanshu): adjust these to the skills you actually want to highlight.
const SKILLS = [
  {
    number: '01',
    name: 'Machine Learning',
    description:
      'Building and training supervised and unsupervised models, feature engineering, and evaluating performance to solve real-world prediction problems.',
  },
  {
    number: '02',
    name: 'Deep Learning',
    description:
      'Designing neural networks — CNNs, RNNs, and transformers — using PyTorch and TensorFlow for vision, language, and sequence tasks.',
  },
  {
    number: '03',
    name: 'Data Analysis',
    description:
      'Exploratory data analysis and visualization with pandas, NumPy, and Matplotlib to uncover patterns and drive data-informed decisions.',
  },
  {
    number: '04',
    name: 'Natural Language Processing',
    description:
      'Working with text data — tokenization, embeddings, sentiment analysis, and fine-tuning language models for practical applications.',
  },
  {
    number: '05',
    name: 'Programming & Tools',
    description:
      'Python, SQL, Git, and scikit-learn, with a focus on writing clean, reproducible code and shipping end-to-end ML workflows.',
  },
];

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="relative z-0 rounded-t-[40px] px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
      style={{ background: '#FFFFFF' }}
    >
      <FadeIn
        as="h2"
        delay={0}
        y={40}
        className="mb-16 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Skills
      </FadeIn>

      <div className="mx-auto max-w-5xl">
        {SKILLS.map((skill, i) => (
          <FadeIn
            key={skill.number}
            delay={i * 0.1}
            className="flex items-center gap-5 py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12"
            style={{
              borderTop: '1px solid rgba(12, 12, 12, 0.15)',
              ...(i === SKILLS.length - 1
                ? { borderBottom: '1px solid rgba(12, 12, 12, 0.15)' }
                : {}),
            }}
          >
            <span
              className="font-black leading-none text-[#0C0C0C]"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {skill.number}
            </span>

            <div className="flex flex-col gap-2 md:gap-3">
              <h3
                className="font-medium uppercase leading-tight text-[#0C0C0C]"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {skill.name}
              </h3>
              <p
                className="max-w-2xl font-light leading-relaxed text-[#0C0C0C]"
                style={{
                  fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)',
                  opacity: 0.6,
                }}
              >
                {skill.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
