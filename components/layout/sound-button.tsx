"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useTranslations } from "next-intl";

export function SoundButton() {
  const t = useTranslations("Common");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Sử dụng âm thanh thiên nhiên từ kho âm thanh miễn phí
    // Bạn có thể đổi sang file mp3 cục bộ bằng cách đặt link "/audio/sound.mp3" nếu đã có file
    audioRef.current = new Audio("https://actions.google.com/sounds/v1/ambiences/outdoor_summer_ambience.ogg");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
      <button
        onClick={toggleSound}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-earth-600 text-white shadow-cinematic transition-all hover:scale-105 hover:bg-earth-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-600 focus-visible:ring-offset-4 focus-visible:ring-offset-parchment-50"
        aria-label={isPlaying ? t("playingMountain") : t("listenMountain")}
      >
        {!isPlaying && (
          <motion.span
             aria-hidden="true"
             className="absolute inset-0 rounded-full border-2 border-earth-600/55"
             animate={{scale: [1, 1.4], opacity: [0.75, 0]}}
             transition={{duration: 2, repeat: Infinity, ease: "easeOut"}}
           />
        )}
        <motion.span
          className="relative z-10"
          animate={{ scale: isPlaying ? 1 : [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: isPlaying ? 0 : Infinity }}
        >
          {isPlaying ? (
            <Volume2 className="h-6 w-6" />
          ) : (
            <VolumeX className="h-6 w-6" />
          )}
        </motion.span>
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={isPlaying ? "playing" : "paused"}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
          className="hidden rounded-[16px] rounded-bl-[4px] bg-white px-4 py-2 text-[13px] font-bold text-[#b54a1a] shadow-[0_4px_14px_rgba(0,0,0,0.15)] sm:block"
        >
          {isPlaying ? t("playingMountain") : t("listenMountain")}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
