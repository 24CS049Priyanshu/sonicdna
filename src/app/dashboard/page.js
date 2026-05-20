"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Music, Disc3, Activity, Sparkles, Sun } from "lucide-react";
import { useDashboard } from "./layout";
import StatCard from "@/components/StatCard";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import ArtistCard from "@/components/ArtistCard";
import TrackCard from "@/components/TrackCard";
import GenreChart from "@/components/GenreChart";
import AudioRadar from "@/components/AudioRadar";
import ListeningHeatmap from "@/components/ListeningHeatmap";
import SkeletonLoader from "@/components/SkeletonLoader";
import Link from "next/link";
import { computeHeatmapData } from "@/lib/analytics";
import { getColorsForGenre } from "@/lib/colors";

export default function DashboardPage() {
  const { data, loading } = useDashboard();
  const [timeRange, setTimeRange] = useState("short_term");

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader variant="stat-row" />
        <SkeletonLoader variant="artist-grid" />
        <SkeletonLoader variant="track-list" />
        <SkeletonLoader variant="chart" />
      </div>
    );
  }

  if (!data) return null;

  const { profile, artists, tracks, audioFeatures, recentlyPlayed, analytics } = data;
  const currentArtists = artists?.[timeRange]?.items || [];
  const currentTracks = tracks?.[timeRange]?.items || [];
  const heatmapData = computeHeatmapData(recentlyPlayed);

  const topGenre = analytics?.topGenre || "Pop";
  const accentColors = getColorsForGenre(topGenre);
  const primaryColor = accentColors[0];

  // Build audio feature map for tracks
  const audioMap = {};
  (audioFeatures || []).forEach((f) => { audioMap[f.id] = f; });

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative"
      >
        {/* Cinematic Focus Lighting behind hero */}
        <div 
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none"
          style={{ background: primaryColor }}
        />

        <div 
          className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl font-bold text-black overflow-hidden border border-white/10 relative z-10"
          style={{ background: `linear-gradient(135deg, ${accentColors[0]}, ${accentColors[1]})` }}
        >
          {profile?.images?.[0]?.url ? (
            <img src={profile.images[0].url} alt="" className="w-full h-full object-cover" />
          ) : (
            profile?.display_name?.charAt(0) || "S"
          )}
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, <span className="gradient-text">{profile?.display_name || "Music Lover"}</span>
          </h1>
          <p className="text-sonic-text-muted mt-1">Here&apos;s your music DNA decoded</p>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={Users} label="Unique Artists" value={analytics?.totalUniqueArtists || 0} color="#1DB954" delay={0} />
        <StatCard icon={Music} label="Tracks Analyzed" value={analytics?.totalTracksAnalyzed || 0} color="#8B5CF6" delay={0.1} />
        {/* Top Genre — text card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.03, y: -4 }}
          className="glass-card glass-card-hover p-5 md:p-6 flex flex-col gap-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#06B6D420" }}>
              <Disc3 size={20} style={{ color: "#06B6D4" }} />
            </div>
            <span className="text-sm text-sonic-text-muted font-medium">Top Genre</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold tracking-tight mt-1 gradient-text">
            {analytics?.topGenre || "—"}
          </div>
        </motion.div>
        <StatCard icon={Activity} label="Diversity Score" value={analytics?.diversityScore || 0} suffix="/100" color="#EC4899" delay={0.3} />
      </div>

      {/* Time Range Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Your Top Charts</h2>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      {/* Top Artists */}
      <motion.section 
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="dashboard-section"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users size={20} style={{ color: primaryColor }} />
          Top Artists
        </h3>

        {/* #1 Hero Artist */}
        {currentArtists[0] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 md:p-8 mb-4 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sonic-green/10 to-transparent" />
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-sonic-green to-sonic-purple flex items-center justify-center text-4xl font-bold text-black relative z-10 overflow-hidden">
              {currentArtists[0].images?.[0]?.url ? (
                <img src={currentArtists[0].images[0].url} alt="" className="w-full h-full object-cover" />
              ) : (
                currentArtists[0].name.charAt(0)
              )}
            </div>
            <div className="relative z-10 text-center sm:text-left">
              <div className="text-xs font-medium text-sonic-green mb-1">🏆 #1 ARTIST</div>
              <h3 className="text-2xl md:text-3xl font-bold">{currentArtists[0].name}</h3>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                {(currentArtists[0].genres || []).slice(0, 3).map((g) => (
                  <span key={g} className="text-xs px-3 py-1 rounded-full bg-white/10 text-sonic-text-muted">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Artist Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {currentArtists.slice(1, 10).map((artist, i) => (
            <ArtistCard key={artist.id} artist={artist} rank={i + 2} delay={i * 0.05} />
          ))}
        </div>
      </motion.section>

      {/* Top Tracks */}
      <motion.section 
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="dashboard-section"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Music size={20} style={{ color: accentColors[1] || "#8B5CF6" }} />
          Top Tracks
        </h3>
        <div className="flex flex-col gap-2">
          {currentTracks.slice(0, 10).map((track, i) => (
            <TrackCard
              key={track.id}
              track={track}
              rank={i + 1}
              audioFeature={audioMap[track.id]}
              delay={i * 0.04}
            />
          ))}
        </div>
      </motion.section>

      {/* Charts Row */}
      <section className="dashboard-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <GenreChart data={analytics?.genreDistribution} />
          <AudioRadar audioAverages={analytics?.audioAverages} />
        </div>
      </section>

      {/* Listening Heatmap */}
      <section className="dashboard-section">
        <ListeningHeatmap data={heatmapData} />
      </section>

      {/* Today's Mood Card */}
      <section className="dashboard-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 md:p-8 relative overflow-hidden"
        >
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] opacity-30"
            style={{ background: analytics?.moodColor || "#8B5CF6" }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sun size={20} style={{ color: analytics?.moodColor || "#8B5CF6" }} />
              <span className="text-sm font-medium text-sonic-text-muted">Today&apos;s Mood</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: analytics?.moodColor }}>
              {analytics?.moodLabel || "Reflective"}
            </h3>
            <p className="text-sm text-sonic-text-muted leading-relaxed max-w-lg">
              Your recent listening energy suggests a focused but emotionally reflective mood — 
              the kind of day where deep work meets deeper feelings.
            </p>
          </div>
        </motion.div>
      </section>

      {/* AI Personality Teaser */}
      <motion.section 
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="dashboard-section"
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="glass-card p-6 md:p-8 relative overflow-hidden group"
        >
          {/* Animated Gradient Glow */}
          <div className="absolute inset-0 bg-gradient-to-r opacity-5 group-hover:opacity-10 transition-opacity duration-500" 
               style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${accentColors[1] || '#8B5CF6'})` }} />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={20} className="text-sonic-purple" />
                <span className="text-sm font-medium text-sonic-text-muted">AI Music Personality</span>
              </div>
              <p className="text-lg font-semibold gradient-text-purple">
                &ldquo;Discover what your music says about you...&rdquo;
              </p>
              <p className="text-sm text-sonic-text-muted mt-1">
                Get your AI-generated music personality, aura visualization, and shareable wrapped card.
              </p>
            </div>
            <Link
              href="/dashboard/personality"
              className="spotify-btn text-sm px-6 py-3 shrink-0"
            >
              Explore Your Personality
              <Sparkles size={16} />
            </Link>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
