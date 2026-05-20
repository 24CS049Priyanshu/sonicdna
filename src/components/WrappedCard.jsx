"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

export default function WrappedCard({ profile, topArtist, topTrack, personalityType, auraColors = ["#1DB954", "#8B5CF6", "#06B6D4"] }) {
  const cardRef = useRef(null);

  const handleDownload = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = "sonic-dna-wrapped-2026.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* The Card */}
      <div
        ref={cardRef}
        className="w-[340px] md:w-[380px] rounded-3xl overflow-hidden relative"
        style={{
          background: `linear-gradient(135deg, ${auraColors[0]}30, #0a0a0a, ${auraColors[1]}30)`,
          border: "1px solid rgba(255,255,255,0.1)",
          padding: "2px",
        }}
      >
        <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: "#0a0a0a" }}>
          {/* Background decorations */}
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-30"
            style={{ background: auraColors[0] }}
          />
          <div
            className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-[60px] opacity-20"
            style={{ background: auraColors[1] }}
          />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-xs font-medium text-sonic-text-muted tracking-widest uppercase mb-2">
                SonicDNA 2026
              </div>
              <div className="text-2xl font-bold gradient-text">Your Music Wrapped</div>
            </div>

            {/* Profile */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-gradient-to-br from-sonic-green to-sonic-purple flex items-center justify-center text-xl font-bold text-black">
                {profile?.display_name?.charAt(0) || "S"}
              </div>
              <div className="font-semibold">{profile?.display_name || "Music Lover"}</div>
            </div>

            {/* Stats */}
            <div className="space-y-4 mb-6">
              <div className="glass-card p-3 rounded-xl">
                <div className="text-[10px] text-sonic-text-muted uppercase tracking-wider mb-1">Top Artist</div>
                <div className="font-semibold text-sm">{topArtist || "Radiohead"}</div>
              </div>
              <div className="glass-card p-3 rounded-xl">
                <div className="text-[10px] text-sonic-text-muted uppercase tracking-wider mb-1">Top Track</div>
                <div className="font-semibold text-sm">{topTrack || "Everything In Its Right Place"}</div>
              </div>
              <div className="glass-card p-3 rounded-xl">
                <div className="text-[10px] text-sonic-text-muted uppercase tracking-wider mb-1">Personality</div>
                <div className="font-semibold text-sm gradient-text-purple">{personalityType || "The Midnight Voyager"}</div>
              </div>
            </div>

            {/* Aura */}
            <div className="flex justify-center gap-3 mb-4">
              {auraColors.map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full" style={{ backgroundColor: c, boxShadow: `0 0 12px ${c}60` }} />
              ))}
            </div>

            {/* Footer */}
            <div className="text-center text-[10px] text-sonic-text-muted">
              sonicdna.app
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDownload}
        className="spotify-btn text-sm px-6 py-3"
      >
        <Download size={16} />
        Download Card
      </motion.button>
    </div>
  );
}
