import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type CategoryDropdownProps = {
  options: { id: string; label: string }[];
  activeId: string;
  onChange: (id: string) => void;
};

export default function CategoryDropdown({
  options,
  activeId,
  onChange,
}: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = options.find((o) => o.id === activeId) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const handlePointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-block text-left">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 rounded-full border-2 border-[#D7E2EA] px-6 py-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors duration-200 hover:bg-[#D7E2EA]/10 sm:px-8 sm:py-3.5 sm:text-base"
      >
        <span>{active.label}</span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute left-1/2 z-30 mt-3 w-60 -translate-x-1/2 overflow-hidden rounded-3xl border-2 border-[#D7E2EA] p-2"
            style={{ background: '#0C0C0C' }}
          >
            {options.map((option) => {
              const isActive = option.id === activeId;
              return (
                <li key={option.id} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-2xl px-5 py-3 text-left text-sm font-medium uppercase tracking-widest transition-colors duration-200 sm:text-base ${
                      isActive
                        ? 'bg-[#D7E2EA] text-[#0C0C0C]'
                        : 'text-[#D7E2EA] hover:bg-[#D7E2EA]/10'
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
