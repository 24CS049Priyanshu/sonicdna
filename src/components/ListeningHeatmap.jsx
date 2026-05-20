"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ListeningHeatmap({ data }) {
  const { grid, maxVal } = useMemo(() => {
    if (!data || data.length === 0) {
      // Empty grid fallback to prevent hydration errors
      const g = Array.from({ length: 7 }, () => Array(24).fill(0));
      return { grid: g, maxVal: 1 };
    }
    const max = Math.max(...data.flat());
    return { grid: data, maxVal: max || 1 };
  }, [data]);

  const getColor = (val) => {
    if (val === 0) return "rgba(255,255,255,0.03)";
    const intensity = val / maxVal;
    if (intensity < 0.25) return "rgba(29, 185, 84, 0.2)";
    if (intensity < 0.5) return "rgba(29, 185, 84, 0.4)";
    if (intensity < 0.75) return "rgba(29, 185, 84, 0.6)";
    return "rgba(29, 185, 84, 0.9)";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card p-5 md:p-6"
    >
      <h3 className="text-lg font-semibold mb-1">Listening Activity</h3>
      <p className="text-xs text-sonic-text-muted mb-4">When you listen the most</p>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour labels */}
          <div className="flex ml-10 mb-1">
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="flex-1 text-center text-[9px] text-sonic-text-muted">
                {h % 4 === 0 ? `${h}h` : ""}
              </div>
            ))}
          </div>

          {/* Grid */}
          {grid.map((row, dayIdx) => (
            <div key={dayIdx} className="flex items-center gap-1 mb-1">
              <span className="w-8 text-[10px] text-sonic-text-muted text-right pr-1">
                {dayLabels[dayIdx]}
              </span>
              <div className="flex gap-[2px] flex-1">
                {row.map((val, hourIdx) => (
                  <motion.div
                    key={hourIdx}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: (dayIdx * 24 + hourIdx) * 0.002 }}
                    className="heatmap-cell flex-1 aspect-square cursor-pointer"
                    style={{ backgroundColor: getColor(val) }}
                    title={`${dayLabels[dayIdx]} ${hourIdx}:00 — ${val} plays`}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 ml-10">
            <span className="text-[10px] text-sonic-text-muted">Less</span>
            {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor:
                    intensity === 0
                      ? "rgba(255,255,255,0.03)"
                      : `rgba(29, 185, 84, ${intensity * 0.9})`,
                }}
              />
            ))}
            <span className="text-[10px] text-sonic-text-muted">More</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
