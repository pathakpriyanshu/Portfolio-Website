type SourceCodeButtonProps = {
  href: string;
  className?: string;
};

export default function SourceCodeButton({
  href,
  className = '',
}: SourceCodeButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`shrink-0 rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors duration-200 hover:bg-[#D7E2EA]/10 sm:px-10 sm:py-3.5 sm:text-base ${className}`}
    >
      Source Code
    </a>
  );
}
