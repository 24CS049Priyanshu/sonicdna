"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Flame, Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useDashboard } from "../layout";
import MusicAura from "@/components/MusicAura";
import MusicJourneyStory from "@/components/MusicJourneyStory";
import WrappedCard from "@/components/WrappedCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import { mockPersonality } from "@/lib/mockData";

export default function PersonalityPage() {
  const { data, loading } = useDashboard();
  const [personality, setPersonality] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);

  useEffect(() => {
    async function fetchPersonality() {
      if (!data) return;
      try {
        const res = await fetch("/api/ai/personality", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analytics: data.analytics }),
        });
        if (res.ok) {
          const json = await res.json();
          setPersonality(json);
        } else {
          setPersonality(mockPersonality);
        }
      } catch {
        setPersonality(mockPersonality);
      } finally {
        setAiLoading(false);
      }
    }
    fetchPersonality();
  }, [data]);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <SkeletonLoader variant="chart" />
        <SkeletonLoader variant="chart" />
        <SkeletonLoader variant="chart" />
      </div>
    );
  }

  const p = personality || mockPersonality;
  const auraColors = data.analytics?.auraColors || ["#1DB954", "#8B5CF6", "#06B6D4"];
  const topArtist = data.artists?.medium_term?.items?.[0]?.name;
  const topTrack = data.tracks?.medium_term?.items?.[0]?.name;

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Back link */}
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-sonic-text-muted hover:text-white transition-colors">
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      {/* Personality Type Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 glass-card px-4 py-1.5 rounded-full text-sm text-sonic-text-muted mb-4"
        >
          <Sparkles size={14} className="text-sonic-purple" />
          AI-Generated Music Personality
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text-purple mb-4"
        >
          {aiLoading ? "Analyzing..." : p.personalityType}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-base md:text-lg text-sonic-text-muted max-w-2xl mx-auto leading-relaxed"
        >
          {aiLoading ? "" : p.description}
        </motion.p>
      </motion.div>

      {/* Music Journey Story */}
      {!aiLoading && <MusicJourneyStory story={p.journeyStory} />}

      {/* Music Aura */}
      <MusicAura colors={auraColors} description={p.auraDescription} />

      {/* Roast & Compliment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Roast */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[60px] opacity-20 bg-orange-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Flame size={20} className="text-orange-500" />
              <span className="text-sm font-medium text-sonic-text-muted">AI Roast</span>
            </div>
            <p className="text-base leading-relaxed italic">
              &ldquo;{aiLoading ? "..." : p.roast}&rdquo;
            </p>
          </div>
        </motion.div>

        {/* Compliment */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[60px] opacity-20 bg-pink-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={20} className="text-pink-500" />
              <span className="text-sm font-medium text-sonic-text-muted">AI Compliment</span>
            </div>
            <p className="text-base leading-relaxed italic">
              &ldquo;{aiLoading ? "..." : p.compliment}&rdquo;
            </p>
          </div>
        </motion.div>
      </div>

      {/* Wrapped Card */}
      <section className="py-8">
        <h3 className="text-xl font-semibold text-center mb-6">Your 2026 Wrapped</h3>
        <WrappedCard
          profile={data.profile}
          topArtist={topArtist}
          topTrack={topTrack}
          personalityType={p.personalityType}
          auraColors={auraColors}
        />
      </section>
    </div>
  );
}
