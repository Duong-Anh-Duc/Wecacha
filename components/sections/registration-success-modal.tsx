"use client";

import {useEffect} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {Check, Sparkles, X} from "lucide-react";

type RegistrationSuccessModalProps = {
  open: boolean;
  onClose: () => void;
  closeLabel: string;
  badge: string;
  title: string;
  copy: string;
  hint: string;
  actionLabel: string;
};

const particles = Array.from({length: 18}, (_, index) => {
  const angle = (index / 18) * Math.PI * 2;
  const distance = index % 2 === 0 ? 106 : 82;

  return {
    id: index,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    size: index % 3 === 0 ? 10 : 7,
    delay: (index % 6) * 0.04,
    className:
      index % 4 === 0
        ? "bg-brand-green"
        : index % 4 === 1
        ? "bg-earth-600"
        : index % 4 === 2
        ? "bg-amber-300"
        : "bg-forest-950"
  };
});

export function RegistrationSuccessModal({
  open,
  onClose,
  closeLabel,
  badge,
  title,
  copy,
  hint,
  actionLabel
}: RegistrationSuccessModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-8">
          <motion.button
            type="button"
            aria-label={closeLabel}
            className="absolute inset-0 bg-forest-950/72 backdrop-blur-md"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{opacity: 0, y: 24, scale: 0.96}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: 18, scale: 0.97}}
            transition={{duration: 0.35, ease: [0.16, 1, 0.3, 1]}}
            className="relative w-full max-w-xl overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,#fffaf0_0%,#f6f0e2_100%)] shadow-[0_28px_80px_rgba(15,23,42,0.34)]"
          >
            <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(181,101,0,0.22),transparent_70%)]" />
            <div className="pointer-events-none absolute inset-0">
              {particles.map((particle) => (
                <motion.span
                  key={particle.id}
                  className={`absolute left-1/2 top-[148px] rounded-full ${particle.className}`}
                  initial={{x: 0, y: 0, opacity: 0, scale: 0}}
                  animate={{
                    x: particle.x,
                    y: particle.y,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.7]
                  }}
                  transition={{
                    duration: 1.35,
                    delay: particle.delay,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  style={{width: particle.size, height: particle.size}}
                />
              ))}

              {[0, 1, 2].map((ring) => (
                <motion.span
                  key={ring}
                  className="absolute left-1/2 top-[148px] h-6 w-6 rounded-full border border-earth-600/30"
                  initial={{x: "-50%", y: "-50%", scale: 0.2, opacity: 0}}
                  animate={{scale: [0.2, 4.4 + ring * 0.55], opacity: [0, 0.65, 0]}}
                  transition={{duration: 1.5, delay: ring * 0.08, ease: "easeOut"}}
                />
              ))}

              <motion.div
                className="absolute left-10 top-10 text-earth-600/70"
                animate={{y: [0, -8, 0], rotate: [0, -8, 0]}}
                transition={{duration: 3.4, repeat: Infinity, ease: "easeInOut"}}
              >
                <Sparkles className="h-5 w-5" />
              </motion.div>
              <motion.div
                className="absolute right-12 top-16 text-brand-green/70"
                animate={{y: [0, -10, 0], rotate: [0, 10, 0]}}
                transition={{duration: 3.8, repeat: Infinity, ease: "easeInOut"}}
              >
                <Sparkles className="h-6 w-6" />
              </motion.div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-forest-950/50 transition hover:bg-forest-950/6 hover:text-forest-950"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative px-6 pb-7 pt-20 text-center sm:px-8 sm:pb-8">
              <motion.div
                initial={{scale: 0.84, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                transition={{duration: 0.4, delay: 0.12, ease: [0.16, 1, 0.3, 1]}}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-earth-600/20 bg-earth-600 text-white shadow-[0_16px_36px_rgba(181,101,0,0.28)]"
              >
                <Check className="h-9 w-9" />
              </motion.div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-earth-700/72">
                {badge}
              </p>
              <h3 className="mt-3 font-serif text-3xl text-forest-950 sm:text-4xl">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-forest-950/66 sm:text-base">
                {copy}
              </p>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-forest-950/42">
                {hint}
              </p>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-forest-950 px-6 text-sm font-semibold text-parchment-50 transition hover:-translate-y-0.5 hover:bg-forest-900"
                >
                  {actionLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
