"use client";
import { motion } from "framer-motion";

const rankColors = { 1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32" };

export default function ArtistCard({ artist, rank, delay = 0 }) {
  const initial = artist.name.charAt(0).toUpperCase();
  const isTop3 = rank <= 3;
  const genres = (artist.genres || []).slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.03 }}
      className="glass-card glass-card-hover p-4 flex flex-col items-center text-center gap-3 relative overflow-hidden"
    >
      {/* Rank badge */}
      <div
        className="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          background: rankColors[rank] || "rgba(255,255,255,0.1)",
          color: isTop3 ? "#000" : "#fff",
        }}
      >
        {rank}
      </div>

      {/* Artist avatar */}
      <div
        className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${artist.genres?.length > 0 ? "#1DB954" : "#8B5CF6"}, #06B6D4)` }}
      >
        {artist.images?.[0]?.url ? (
          <img src={artist.images[0].url} alt={artist.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white">{initial}</span>
        )}
      </div>

      {/* Info */}
      <div>
        <h3 className="font-semibold text-sm md:text-base truncate max-w-[140px]">{artist.name}</h3>
        <div className="flex flex-wrap justify-center gap-1 mt-1.5">
          {genres.map((g) => (
            <span
              key={g}
              className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-sonic-text-muted"
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* Popularity bar */}
      <div className="w-full mt-auto">
        <div className="flex justify-between text-[10px] text-sonic-text-muted mb-1">
          <span>Popularity</span>
          <span>{artist.popularity}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${artist.popularity}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: delay + 0.2 }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #1DB954, #06B6D4)" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
