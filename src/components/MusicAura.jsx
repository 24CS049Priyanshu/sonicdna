"use client";
import { motion } from "framer-motion";

export default function MusicAura({ colors = ["#1DB954", "#8B5CF6", "#06B6D4"], description }) {
  const gradient = `conic-gradient(from 0deg, ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[0]})`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="glass-card p-6 md:p-8 flex flex-col items-center text-center"
    >
      <h3 className="text-lg font-semibold mb-6">Your Music Aura</h3>

      {/* Aura Orb */}
      <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center mb-6">
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full opacity-30 blur-[60px]"
          style={{ background: gradient }}
        />
        {/* Main orb */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-48 h-48 md:w-56 md:h-56 rounded-full"
          style={{ background: gradient, filter: "blur(30px)", opacity: 0.7 }}
        />
        {/* Inner glow */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full"
          style={{ background: `radial-gradient(circle, ${colors[0]}80, transparent)` }}
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
