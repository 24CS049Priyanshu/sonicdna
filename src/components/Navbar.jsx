"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BarChart3, User, Sparkles, LogOut, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/dashboard/personality", label: "Personality", icon: Sparkles },
];

export default function Navbar({ profile }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const displayName = profile?.display_name || "Music Lover";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <nav className="glass-nav sticky top-0 z-50 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sonic-green flex items-center justify-center">
            <span className="text-black font-black text-sm">S</span>
          </div>
          <span className="font-bold text-lg gradient-text hidden sm:inline">SonicDNA</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? "text-white" : "text-sonic-text-muted hover:text-white"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/10 rounded-lg"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <Icon size={16} />
                  {label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Profile + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sonic-purple/30 flex items-center justify-center text-sm font-bold">
              {profile?.images?.[0]?.url ? (
                <img src={profile.images[0].url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <span className="text-sm font-medium hidden sm:inline">{displayName}</span>
          </div>

          <Link
            href="/api/auth/logout"
            className="hidden md:flex text-sonic-text-muted hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
            title="Logout"
          >
            <LogOut size={16} />
          </Link>

          <button
            className="md:hidden p-2 text-sonic-text-muted"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="py-3 flex flex-col gap-1 border-t border-white/5">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 ${
                    pathname === href ? "bg-white/10 text-white" : "text-sonic-text-muted"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
              <Link
                href="/api/auth/logout"
                className="px-4 py-3 rounded-lg text-sm text-sonic-text-muted flex items-center gap-3"
              >
                <LogOut size={18} />
                Logout
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
