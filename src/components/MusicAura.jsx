"use client";
import { motion } from "framer-motion";

export default function MusicAura({ colors = ["#1DB954", "#8B5CF6", "#06B6D4"], description }) {
  const gradient = `conic-gradient(from 0deg, ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[0]})`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="glass-card p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden"
    >
      {/* Atmospheric background glow */}
      <div 
        className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] opacity-[0.05] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${colors[0]}, transparent 70%)` }}
      />
      
      <h3 className="text-lg font-semibold mb-6 relative z-10">Your Music Aura</h3>

      {/* Aura Orb */}
      <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center mb-6">
        {/* Decorative Particles */}
        <motion.div 
          animate={{ y: [0, -10, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-10 w-2 h-2 rounded-full blur-[1px]"
          style={{ background: colors[1] }}
        />
        <motion.div 
          animate={{ y: [0, 15, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 left-10 w-3 h-3 rounded-full blur-[2px]"
          style={{ background: colors[0] }}
        />

        {/* Outer glow */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full blur-[60px]"
          style={{ background: gradient }}
        />
        {/* Main orb (Rotating & Breathing & Blurring) */}
        <motion.div
          animate={{ 
            rotate: 360, 
            scale: [1, 1.05, 1],
            filter: ["blur(30px)", "blur(40px)", "blur(30px)"]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            filter: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-48 h-48 md:w-56 md:h-56 rounded-full mix-blend-screen"
          style={{ background: gradient, opacity: 0.8 }}
        />
        {/* Inner core */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full mix-blend-screen"
          style={{ background: `radial-gradient(circle, ${colors[0]}a0, transparent)` }}
        />
      </div>

      {/* Color Labels */}
      <div className="flex gap-4 mb-4">
        {colors.map((color, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-sonic-text-muted">
              {i === 0 ? "Core" : i === 1 ? "Depth" : "Energy"}
            </span>
          </div>
        ))}
      </div>

      {description && (
        <p className="text-sm text-sonic-text-muted leading-relaxed max-w-md">
          {description}
        </p>
      )}
    </motion.div>
  );
}
