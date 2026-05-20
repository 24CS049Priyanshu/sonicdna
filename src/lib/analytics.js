// SonicDNA — Analytics Utility Layer

export function computeGenreDistribution(artists) {
  const genreCount = {};
  const items = artists?.items || [];
  items.forEach((artist) => {
    (artist.genres || []).forEach((genre) => {
      const normalized = genre.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      genreCount[normalized] = (genreCount[normalized] || 0) + 1;
    });
  });

  const colors = ["#1DB954","#8B5CF6","#06B6D4","#EC4899","#F97316","#EAB308","#14B8A6","#6B7280"];
  const sorted = Object.entries(genreCount).sort((a,b) => b[1] - a[1]);
  const total = sorted.reduce((s, [,v]) => s + v, 0);

  return sorted.slice(0, 8).map(([name, count], i) => ({
    name,
    value: Math.round((count / total) * 100),
    color: colors[i % colors.length],
  }));
}

export function computeAudioAverages(features) {
  if (!features || features.length === 0) {
    return { danceability:0, energy:0, valence:0, acousticness:0, instrumentalness:0, speechiness:0 };
  }
  const keys = ["danceability","energy","valence","acousticness","instrumentalness","speechiness"];
  const avgs = {};
  keys.forEach((key) => {
    avgs[key] = Math.round((features.reduce((s, f) => s + (f[key] || 0), 0) / features.length) * 100) / 100;
  });
  return avgs;
}

export function computeHeatmapData(recentlyPlayed) {
  // 7 days × 24 hours grid
  const grid = Array.from({ length: 7 }, () => Array(24).fill(0));
  const items = recentlyPlayed?.items || [];

  items.forEach(({ played_at }) => {
    const d = new Date(played_at);
    const day = d.getDay(); // 0=Sun
    const hour = d.getHours();
    grid[day][hour]++;
  });

  return grid;
}

export function computeDiversityScore(artists) {
  const items = artists?.items || [];
  const allGenres = items.flatMap((a) => a.genres || []);
  const uniqueGenres = new Set(allGenres);
  const total = allGenres.length;
  if (total === 0) return 0;

  // Shannon diversity index normalized to 0-100
  const freq = {};
  allGenres.forEach((g) => { freq[g] = (freq[g] || 0) + 1; });
  let H = 0;
  Object.values(freq).forEach((count) => {
    const p = count / total;
    if (p > 0) H -= p * Math.log(p);
  });
  const maxH = Math.log(uniqueGenres.size || 1);
  return Math.round(maxH > 0 ? (H / maxH) * 100 : 0);
}

export function getMoodFromFeatures(audioAverages) {
  const { valence, energy } = audioAverages;
  if (valence > 0.6 && energy > 0.6) return { label: "Euphoric & Energetic", color: "#F97316" };
  if (valence > 0.6 && energy <= 0.6) return { label: "Peaceful & Content", color: "#1DB954" };
  if (valence <= 0.4 && energy > 0.6) return { label: "Intense & Driven", color: "#EC4899" };
  if (valence <= 0.4 && energy <= 0.4) return { label: "Melancholic & Introspective", color: "#8B5CF6" };
  return { label: "Reflective & Energetic", color: "#06B6D4" };
}

export function generateAuraColors(audioAverages) {
  const { valence, energy, danceability } = audioAverages;
  const h1 = Math.round(valence * 120 + 100);     // green-cyan range
  const h2 = Math.round(energy * 60 + 240);        // purple-blue range
  const h3 = Math.round(danceability * 60 + 160);  // cyan-teal range
  return [
    `hsl(${h1}, 80%, 50%)`,
    `hsl(${h2}, 70%, 55%)`,
    `hsl(${h3}, 75%, 48%)`,
  ];
}

export function computeAllAnalytics(artists, tracks, audioFeatures, recentlyPlayed) {
  const genreDistribution = computeGenreDistribution(artists);
  const audioAverages = computeAudioAverages(audioFeatures);
  const diversityScore = computeDiversityScore(artists);
  const mood = getMoodFromFeatures(audioAverages);
  const auraColors = generateAuraColors(audioAverages);
  const items = artists?.items || [];

  return {
    genreDistribution,
    audioAverages,
    diversityScore,
    totalUniqueArtists: items.length,
    totalTracksAnalyzed: (tracks?.items || []).length,
    topGenre: genreDistribution[0]?.name || "Unknown",
    moodLabel: mood.label,
    moodColor: mood.color,
    auraColors,
    listeningHours: Math.round(((tracks?.items || []).length * 3.5) + 120),
  };
}
