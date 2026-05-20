export const genreColors = {
  // Electronic / Dance
  edm: ["#3B82F6", "#8B5CF6", "#06B6D4"], // Blue / Purple / Cyan
  house: ["#06B6D4", "#3B82F6", "#10B981"],
  techno: ["#000000", "#4B5563", "#3B82F6"], // Darker vibes

  // Rock / Alternative
  "art rock": ["#10B981", "#06B6D4", "#FBBF24"], // Emerald / Cyan
  indie: ["#F59E0B", "#F43F5E", "#8B5CF6"], // Amber / Rose
  rock: ["#EF4444", "#F97316", "#1F2937"], // Red / Orange

  // Hip Hop / R&B
  "hip hop": ["#E879F9", "#E11D48", "#4F46E5"], // Magenta / Red
  rap: ["#F43F5E", "#8B5CF6", "#1D4ED8"],
  "r&b": ["#A855F7", "#EC4899", "#FB923C"],

  // Pop
  pop: ["#EC4899", "#8B5CF6", "#3B82F6"], // Pink / Purple
  "dance pop": ["#F472B6", "#A855F7", "#38BDF8"],

  // Chill / Acoustic
  acoustic: ["#D97706", "#65A30D", "#78716C"],
  lofi: ["#8B5CF6", "#6366F1", "#94A3B8"],

  // Default/Fallback (Spotify-ish vibe)
  default: ["#1DB954", "#8B5CF6", "#06B6D4"],
};

export function getColorsForGenre(genreStr) {
  if (!genreStr) return genreColors.default;
  const normalized = genreStr.toLowerCase();

  for (const [key, colors] of Object.entries(genreColors)) {
    if (normalized.includes(key)) {
      return colors;
    }
  }

  return genreColors.default;
}
