"use client";
import { motion } from "framer-motion";
import { BarChart3, Sparkles, Palette, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description: "Your top artists, tracks, genres, and listening patterns visualized with stunning charts.",
    color: "#1DB954",
  },
  {
    icon: Sparkles,
    title: "AI Insights",
    description: "Discover your music personality with AI-generated analysis, roasts, and compliments.",
    color: "#8B5CF6",
  },
  {
    icon: Palette,
    title: "Music Aura",
    description: "See your listening habits transformed into a unique, animated visual aura.",
    color: "#06B6D4",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-3xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 glass-card px-4 py-1.5 rounded-full text-sm text-sonic-text-muted mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-sonic-green animate-pulse" />
          AI-Powered Music Analytics
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          Decode Your{" "}
          <span className="gradient-text">Music DNA</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-lg md:text-xl text-sonic-text-muted max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Transform your Spotify listening history into stunning visual stories
          with AI-powered personality insights and cinematic analytics.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <a href="/api/auth/login" className="spotify-btn pulse-glow text-lg px-8 py-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Connect with Spotify
            <ArrowRight size={20} />
          </a>
        </motion.div>

        {/* Demo link for testing without Spotify */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-4"
        >
          <Link
            href="/dashboard"
            className="text-sm text-sonic-text-muted hover:text-white transition-colors underline underline-offset-4"
          >
            Try with demo data →
          </Link>
        </motion.div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mt-16 w-full"
      >
        {features.map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03, y: -4 }}
            className="glass-card glass-card-hover p-6 flex flex-col gap-3"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${feature.color}15` }}
            >
              <feature.icon size={24} style={{ color: feature.color }} />
            </div>
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm text-sonic-text-muted leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-xs text-sonic-text-muted mt-16"
      >
        Built with ♥ for the hackathon • Not affiliated with Spotify
      </motion.p>
    </div>
  );
}
