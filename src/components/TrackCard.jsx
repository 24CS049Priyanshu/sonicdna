"use client";
import { motion } from "framer-motion";

export default function TrackCard({ track, rank, audioFeature, delay = 0 }) {
  const albumInitial = track.album?.name?.charAt(0) || "♪";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ x: 4 }}
      className="glass-card glass-card-hover p-3 md:p-4 flex items-center gap-3 md:gap-4"
    >
      {/* Rank */}
      <span className="text-lg font-bold text-sonic-text-muted w-6 md:w-8 text-right shrink-0">
        {rank}
      </span>

      {/* Album art */}
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-white/5 text-lg font-bold text-sonic-text-muted">
        {track.album?.images?.[0]?.url ? (
          <img src={track.album.images[0].url} alt={track.album.name} className="w-full h-full object-cover" />
        ) : (
          albumInitial
        )}
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm md:text-base truncate">{track.name}</h4>
        <p className="text-xs md:text-sm text-sonic-text-muted truncate">
          {track.artists?.map((a) => a.name).join(", ")} • {track.album?.name}
        </p>
      </div>

      {/* Mini audio feature bars */}
      {audioFeature && (
        <div className="hidden md:flex gap-1.5 items-end h-8">
          {[
            { val: audioFeature.energy, color: "#1DB954", label: "E" },
            { val: audioFeature.danceability, color: "#8B5CF6", label: "D" },
            { val: audioFeature.valence, color: "#06B6D4", label: "V" },
          ].map(({ val, color, label }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${val * 32}px` }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: delay + 0.2 }}
                className="w-2 rounded-full"
                style={{ background: color }}
              />
              <span className="text-[8px] text-sonic-text-muted">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Duration */}
      <span className="text-xs text-sonic-text-muted shrink-0 hidden sm:block">
        {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, "0")}
      </span>
    </motion.div>
  );
}
