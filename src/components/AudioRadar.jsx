"use client";
import { motion } from "framer-motion";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Tooltip,
} from "recharts";

export default function AudioRadar({ audioAverages }) {
  if (!audioAverages) return null;

  const data = [
    { subject: "Dance", value: Math.round(audioAverages.danceability * 100), fullMark: 100 },
    { subject: "Energy", value: Math.round(audioAverages.energy * 100), fullMark: 100 },
    { subject: "Valence", value: Math.round(audioAverages.valence * 100), fullMark: 100 },
    { subject: "Acoustic", value: Math.round(audioAverages.acousticness * 100), fullMark: 100 },
    { subject: "Instrum.", value: Math.round(audioAverages.instrumentalness * 100), fullMark: 100 },
    { subject: "Speech", value: Math.round(audioAverages.speechiness * 100), fullMark: 100 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="glass-card p-5 md:p-6 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1DB954]/5 to-transparent pointer-events-none" />
      
      <h3 className="text-lg font-semibold mb-4">Audio Profile</h3>

      <div className="h-[280px] md:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.03)" radialLines={false} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#71717a", fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Your Profile"
              dataKey="value"
              stroke="#1DB954"
              fill="url(#colorUv)"
              fillOpacity={1}
              strokeWidth={1.5}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />
            {/* Adding gradient definition for the radar fill */}
            <defs>
              <radialGradient id="colorUv" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#1DB954" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#1DB954" stopOpacity={0.1} />
              </radialGradient>
            </defs>

            <Tooltip
              content={({ active, payload }) =>
                active && payload?.[0] ? (
                  <div className="glass-card px-3 py-2 text-sm">
                    <span className="font-semibold">{payload[0].payload.subject}</span>
                    <span className="text-sonic-green ml-2">{payload[0].value}%</span>
                  </div>
                ) : null
              }
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
