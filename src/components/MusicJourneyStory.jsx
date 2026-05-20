"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function MusicJourneyStory({ story }) {
  const [displayText, setDisplayText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!story) return;
    let i = 0;
    setDisplayText("");
    setDone(false);
    const interval = setInterval(() => {
      if (i < story.length) {
        setDisplayText(story.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [story]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-6 md:p-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sonic-green/5 via-transparent to-sonic-purple/5" />
      <div className="relative z-10">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          📖 Your Music Journey
        </h3>
        <p className="text-base md:text-lg leading-relaxed text-sonic-text-muted">
          {displayText}
          {!done && <span className="typewriter-cursor" />}
        </p>
      </div>
    </motion.div>
  );
}
