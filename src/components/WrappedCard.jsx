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
        className="w-[340px] md:w-[380px] rounded-3xl overflow-hidden relative shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${auraColors[0]}50, #000000, ${auraColors[1]}50)`,
          border: "1px solid rgba(255,255,255,0.15)",
          padding: "2px",
        }}
      >
        <div className="rounded-[22px] p-8 relative overflow-hidden h-full" style={{ background: "linear-gradient(to bottom, #0a0a0a, #050505)" }}>
          {/* Noise Texture */}
          <div className="noise-overlay opacity-[0.05]" />
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
            <div className="text-center mb-8 relative z-10">
              <div className="text-[10px] font-bold text-sonic-text-muted tracking-[0.2em] uppercase mb-2">
                SonicDNA 2026
              </div>
              <div className="text-4xl md:text-5xl font-black gradient-text tracking-tighter leading-none mb-1">
                Your Music
              </div>
              <div className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: auraColors[0] }}>
                Wrapped
              </div>
            </div>

            {/* Profile */}
            <div className="text-center mb-8 relative z-10">
              <div className="relative inline-block mb-3">
                <div 
                  className="absolute inset-0 rounded-full blur-[20px] opacity-60" 
                  style={{ background: `linear-gradient(135deg, ${auraColors[0]}, ${auraColors[1]})` }} 
                />
                <div 
                  className="relative w-20 h-20 rounded-full mx-auto bg-gradient-to-br flex items-center justify-center text-3xl font-black text-black border-2 border-white/10"
                  style={{ backgroundImage: `linear-gradient(to bottom right, ${auraColors[0]}, ${auraColors[1]})` }}
                >
                  {profile?.display_name?.charAt(0) || "S"}
                </div>
              </div>
              <div className="font-semibold">{profile?.display_name || "Music Lover"}</div>
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-8 relative z-10">
              <div className="glass-card p-4 rounded-2xl flex flex-col justify-center border-l-4" style={{ borderLeftColor: auraColors[0] }}>
                <div className="text-[10px] text-sonic-text-muted uppercase tracking-wider mb-1 font-semibold">Top Artist</div>
                <div className="font-bold text-lg leading-tight">{topArtist || "Radiohead"}</div>
              </div>
              <div className="glass-card p-4 rounded-2xl flex flex-col justify-center border-l-4" style={{ borderLeftColor: auraColors[1] }}>
                <div className="text-[10px] text-sonic-text-muted uppercase tracking-wider mb-1 font-semibold">Top Track</div>
                <div className="font-bold text-lg leading-tight">{topTrack || "Everything In Its Right Place"}</div>
              </div>
              <div className="glass-card p-4 rounded-2xl flex flex-col justify-center border-l-4" style={{ borderLeftColor: auraColors[2] }}>
                <div className="text-[10px] text-sonic-text-muted uppercase tracking-wider mb-1 font-semibold">Personality</div>
                <div className="font-bold text-lg leading-tight bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${auraColors[0]}, ${auraColors[1]})` }}>
                  {personalityType || "The Midnight Voyager"}
                </div>
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
