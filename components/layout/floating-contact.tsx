"use client";

import {useState, useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {MessageCircle, X} from "lucide-react";
import {useTranslations} from "next-intl";
import Image from "next/image";

const contacts = [
  {
    label: "Zalo",
    href: "https://zalo.me/0962083608",
    bg: "#0068FF",
    icon: (
      <Image src="/Icon_of_Zalo.svg.png" alt="Zalo" width={20} height={20} className="h-5 w-5 object-contain" />
    )
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/wecachacoffeeandtea/?locale=vi_VN",
    bg: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  {
    label: "Messenger",
    href: "https://www.facebook.com/messages/new?initial_e2ee_toggle_position=true",
    bg: "#0099FF",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5">
        <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
      </svg>
    )
  }
];

export function FloatingContact() {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const bubbleTexts = ["haveQuestions", "contactUsBubble", "needAdvice"] as const;

  useEffect(() => {
    if (open) return;
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % bubbleTexts.length);
    }, 3500); // Change text every 3.5 seconds
    return () => clearInterval(interval);
  }, [open, bubbleTexts.length]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <>
            {contacts.map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{opacity: 0, scale: 0.5, y: 20}}
                animate={{opacity: 1, scale: 1, y: 0}}
                exit={{opacity: 0, scale: 0.5, y: 20}}
                transition={{duration: 0.25, delay: (contacts.length - 1 - i) * 0.06, ease: [0.16, 1, 0.3, 1]}}
                className="group flex items-center gap-2"
              >
                {/* Label */}
                <span className="hidden rounded-full bg-forest-950/80 px-3 py-1 text-xs font-medium text-white backdrop-blur group-hover:block">
                  {c.label}
                </span>
                {/* Icon button */}
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full shadow-warm transition hover:scale-110"
                  style={{backgroundColor: c.bg}}
                >
                  {c.icon}
                </span>
              </motion.a>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main toggle button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{scale: 0.92}}
        animate={!open ? {scale: [1, 1.055, 1]} : {scale: 1}}
        transition={!open ? {duration: 1.55, repeat: Infinity, ease: "easeInOut"} : {duration: 0.2}}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-earth-600 text-white shadow-cinematic transition hover:bg-earth-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-600 focus-visible:ring-offset-4 focus-visible:ring-offset-parchment-50"
        aria-label={t("contact")}
      >
        {!open ? (
          <>
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border-2 border-earth-600/55"
              animate={{scale: [1, 1.7], opacity: [0.75, 0]}}
              transition={{duration: 1.45, repeat: Infinity, ease: "easeOut"}}
            />
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-white/45"
              animate={{scale: [1, 1.42], opacity: [0.5, 0]}}
              transition={{duration: 1.45, repeat: Infinity, delay: 0.42, ease: "easeOut"}}
            />
            <motion.span
              aria-hidden="true"
              className="absolute -inset-2 rounded-full bg-earth-500/30 blur-md"
              animate={{scale: [0.9, 1.2, 0.9], opacity: [0.38, 0.72, 0.38]}}
              transition={{duration: 1.55, repeat: Infinity, ease: "easeInOut"}}
            />
            <span className="pointer-events-none absolute right-[calc(100%+1rem)] top-1/2 -translate-y-1/2 whitespace-nowrap overflow-hidden rounded-[16px] rounded-br-[4px] bg-white px-4 py-2 text-[13px] font-bold text-[#b54a1a] shadow-[0_4px_14px_rgba(0,0,0,0.15)] transition-all duration-300 origin-right animate-[pulse_3s_infinite]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={textIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="block"
                >
                  {t(bubbleTexts[textIndex])}
                </motion.span>
              </AnimatePresence>
            </span>
          </>
        ) : null}
        <motion.span
          className="relative z-10"
          animate={{rotate: open ? 90 : 0}}
          transition={{duration: 0.3}}
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </motion.span>
      </motion.button>
    </div>
  );
}
