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
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card p-5 md:p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Audio Profile</h3>

      <div className="h-[280px] md:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#a3a3a3", fontSize: 12 }}
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
              fill="#1DB954"
              fillOpacity={0.2}
              strokeWidth={2}
              isAnimationActive={true}
              animationDuration={1200}
              animationEasing="ease-out"
            />
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
