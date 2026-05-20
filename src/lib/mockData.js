// SonicDNA — Mock Data for development & demo fallback

export const mockProfile = {
  display_name: "Alex Rivera",
  id: "alexrivera",
  images: [{ url: "", width: 300, height: 300 }],
  followers: { total: 142 },
  country: "US",
  product: "premium",
};

function makeArtist(id, name, genres, pop, followers) {
  return { id, name, genres, popularity: pop, images: [{ url: "" }], followers: { total: followers } };
}
function makeTrack(id, name, artist, album, dur, pop) {
  return { id, name, artists: [{ name: artist }], album: { name: album, images: [{ url: "" }] }, duration_ms: dur, popularity: pop };
}

const artists = [
  makeArtist("1","Radiohead",["art rock","alternative rock","experimental"],82,8200000),
  makeArtist("2","Tame Impala",["psychedelic rock","indie","synth pop"],79,6500000),
  makeArtist("3","Bon Iver",["indie folk","art pop","chamber pop"],74,4300000),
  makeArtist("4","ODESZA",["electronic","chillwave","indietronica"],71,3100000),
  makeArtist("5","Phoebe Bridgers",["indie rock","indie pop","art pop"],76,3800000),
  makeArtist("6","Jamie xx",["electronic","uk bass","post-dubstep"],68,2100000),
  makeArtist("7","Billie Eilish",["pop","electropop","dark pop"],92,72000000),
  makeArtist("8","Frank Ocean",["r&b","alternative r&b","neo-soul"],85,15000000),
  makeArtist("9","Khruangbin",["psychedelic rock","funk","world"],65,1900000),
  makeArtist("10","Tyler, the Creator",["hip hop","rap","alternative hip hop"],88,18000000),
];

const tracks = [
  makeTrack("t1","Everything In Its Right Place","Radiohead","Kid A",250000,72),
  makeTrack("t2","Let It Happen","Tame Impala","Currents",467000,80),
  makeTrack("t3","Skinny Love","Bon Iver","For Emma, Forever Ago",231000,78),
  makeTrack("t4","A Moment Apart","ODESZA","A Moment Apart",295000,68),
  makeTrack("t5","Kyoto","Phoebe Bridgers","Punisher",204000,75),
  makeTrack("t6","Gosh","Jamie xx","In Colour",376000,62),
  makeTrack("t7","Ocean Eyes","Billie Eilish","dont smile at me",200000,85),
  makeTrack("t8","Nights","Frank Ocean","Blonde",306000,83),
  makeTrack("t9","Maria También","Khruangbin","Mordechai",238000,58),
  makeTrack("t10","EARFQUAKE","Tyler, the Creator","IGOR",190000,86),
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export const mockTopArtists = {
  short_term: { items: artists },
  medium_term: { items: shuffle(artists) },
  long_term: { items: shuffle(artists) },
};

export const mockTopTracks = {
  short_term: { items: tracks },
  medium_term: { items: shuffle(tracks) },
  long_term: { items: shuffle(tracks) },
};

export const mockAudioFeatures = [
  { id:"t1",danceability:0.35,energy:0.52,valence:0.18,acousticness:0.12,instrumentalness:0.45,speechiness:0.04,tempo:126 },
  { id:"t2",danceability:0.52,energy:0.78,valence:0.45,acousticness:0.02,instrumentalness:0.18,speechiness:0.03,tempo:116 },
  { id:"t3",danceability:0.38,energy:0.32,valence:0.22,acousticness:0.89,instrumentalness:0.01,speechiness:0.03,tempo:78 },
  { id:"t4",danceability:0.61,energy:0.72,valence:0.55,acousticness:0.08,instrumentalness:0.62,speechiness:0.04,tempo:128 },
  { id:"t5",danceability:0.55,energy:0.65,valence:0.38,acousticness:0.15,instrumentalness:0.00,speechiness:0.05,tempo:102 },
  { id:"t6",danceability:0.68,energy:0.85,valence:0.42,acousticness:0.01,instrumentalness:0.72,speechiness:0.05,tempo:135 },
  { id:"t7",danceability:0.48,energy:0.38,valence:0.28,acousticness:0.72,instrumentalness:0.00,speechiness:0.03,tempo:94 },
  { id:"t8",danceability:0.45,energy:0.55,valence:0.35,acousticness:0.25,instrumentalness:0.02,speechiness:0.08,tempo:90 },
  { id:"t9",danceability:0.72,energy:0.58,valence:0.65,acousticness:0.32,instrumentalness:0.55,speechiness:0.03,tempo:108 },
  { id:"t10",danceability:0.75,energy:0.62,valence:0.48,acousticness:0.18,instrumentalness:0.01,speechiness:0.12,tempo:82 },
];

function generateRecentlyPlayed() {
  const items = [];
  const now = new Date();
  for (let i = 0; i < 50; i++) {
    const hoursAgo = Math.floor(Math.random() * 336);
    const playedAt = new Date(now.getTime() - hoursAgo * 3600000);
    const track = tracks[Math.floor(Math.random() * tracks.length)];
    items.push({ track, played_at: playedAt.toISOString(), context: null });
  }
  items.sort((a, b) => new Date(b.played_at) - new Date(a.played_at));
  return { items };
}

export const mockRecentlyPlayed = generateRecentlyPlayed();

export const mockAnalytics = {
  genreDistribution: [
    { name: "Art Rock", value: 22, color: "#1DB954" },
    { name: "Indie", value: 18, color: "#8B5CF6" },
    { name: "Electronic", value: 16, color: "#06B6D4" },
    { name: "R&B", value: 12, color: "#EC4899" },
    { name: "Hip Hop", value: 11, color: "#F97316" },
    { name: "Folk", value: 9, color: "#EAB308" },
    { name: "Pop", value: 7, color: "#14B8A6" },
    { name: "Other", value: 5, color: "#6B7280" },
  ],
  audioAverages: { danceability:0.55, energy:0.60, valence:0.40, acousticness:0.27, instrumentalness:0.26, speechiness:0.05 },
  diversityScore: 78,
  totalUniqueArtists: 10,
  totalTracksAnalyzed: 30,
  topGenre: "Art Rock",
  moodLabel: "Reflective & Energetic",
  moodColor: "#8B5CF6",
  auraColors: ["#1DB954", "#8B5CF6", "#06B6D4"],
  listeningHours: 247,
};

export const mockPersonality = {
  personalityType: "The Midnight Voyager",
  description: "You navigate the sonic landscape with the curiosity of an explorer and the sensitivity of a poet. Your taste weaves between atmospheric soundscapes and emotionally raw lyrics, suggesting someone who processes the world through music's most nuanced frequencies.",
  journeyStory: "Your listening journey tells a fascinating story. You began with high-energy electronic tracks that fueled late-night study sessions, then gradually drifted toward introspective indie and art rock. Recently, your playlists reveal a beautiful balance — energetic mornings with Tame Impala, reflective evenings with Radiohead, and soulful weekends with Frank Ocean.",
  roast: "You've listened to 'Everything In Its Right Place' 73 times and still can't explain what it's about. Your Spotify algorithm probably needs therapy after processing your 2 AM emotional deep-dives.",
  compliment: "Your music taste has the range of a symphony orchestra. You effortlessly bridge genres that most people don't even know exist, creating a listening palette that's genuinely sophisticated and emotionally intelligent.",
  todaysMood: "Your recent listening energy suggests a focused but emotionally reflective mood — the kind of day where deep work meets deeper feelings.",
  auraDescription: "Your aura blends emerald green (growth and curiosity), deep violet (emotional depth), and electric cyan (creative energy).",
};

export function getMockDashboardData() {
  return { profile: mockProfile, artists: mockTopArtists, tracks: mockTopTracks, audioFeatures: mockAudioFeatures, recentlyPlayed: mockRecentlyPlayed, analytics: mockAnalytics };
}
