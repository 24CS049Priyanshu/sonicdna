"use client";
export default function SkeletonLoader({ variant = "card" }) {
  if (variant === "stat-row") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-5 md:p-6">
            <div className="skeleton h-4 w-20 mb-3" />
            <div className="skeleton h-10 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "artist-grid") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="glass-card p-4 flex flex-col items-center gap-3">
            <div className="skeleton w-20 h-20 rounded-full" />
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-3 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "track-list") {
    return (
      <div className="flex flex-col gap-2">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="glass-card p-4 flex items-center gap-4">
            <div className="skeleton w-6 h-6 rounded" />
            <div className="skeleton w-12 h-12 rounded-lg" />
            <div className="flex-1">
              <div className="skeleton h-4 w-40 mb-2" />
              <div className="skeleton h-3 w-28" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div className="glass-card p-6">
        <div className="skeleton h-5 w-32 mb-4" />
        <div className="skeleton h-[250px] w-full rounded-xl" />
      </div>
    );
  }

  // Default card skeleton
  return <div className="skeleton h-40 w-full rounded-2xl" />;
}
