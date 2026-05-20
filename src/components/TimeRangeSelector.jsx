"use client";
import { motion } from "framer-motion";

const ranges = [
  { key: "short_term", label: "4 Weeks" },
  { key: "medium_term", label: "6 Months" },
  { key: "long_term", label: "All Time" },
];

export default function TimeRangeSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 p-1 glass-card rounded-full w-fit">
      {ranges.map((r) => (
        <button
          key={r.key}
          onClick={() => onChange(r.key)}
          className="relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 z-10"
          style={{ color: value === r.key ? "#000" : "#a3a3a3" }}
        >
          {value === r.key && (
            <motion.div
              layoutId="timerange-pill"
              className="absolute inset-0 rounded-full bg-sonic-green"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{r.label}</span>
        </button>
      ))}
    </div>
  );
}
