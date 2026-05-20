"use client";
import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";

export default function StatCard({ icon: Icon, label, value, suffix = "", prefix = "", color = "#1DB954", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="glass-card glass-card-hover p-5 md:p-6 flex flex-col gap-2"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={20} style={{ color }} />
          </div>
        )}
        <span className="text-sm text-sonic-text-muted font-medium">{label}</span>
      </div>
      <div className="text-3xl md:text-4xl font-bold tracking-tight mt-1">
        <AnimatedCounter target={typeof value === "number" ? value : 0} prefix={prefix} suffix={suffix} />
      </div>
    </motion.div>
  );
}
