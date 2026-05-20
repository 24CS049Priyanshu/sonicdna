"use client";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 text-sm">
        <span className="font-semibold">{payload[0].name}</span>
        <span className="text-sonic-text-muted ml-2">{payload[0].value}%</span>
      </div>
    );
  }
  return null;
};

export default function GenreChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card p-5 md:p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Genre Breakdown</h3>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Chart */}
        <div className="w-full md:w-1/2 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                animationBegin={200}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          {data.map((entry, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-sm flex-1">{entry.name}</span>
              <span className="text-sm font-semibold text-sonic-text-muted">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
