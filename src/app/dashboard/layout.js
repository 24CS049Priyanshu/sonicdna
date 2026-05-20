"use client";
import { useState, useEffect, createContext, useContext } from "react";
import Navbar from "@/components/Navbar";
import { getMockDashboardData } from "@/lib/mockData";

const DashboardContext = createContext(null);
export const useDashboard = () => useContext(DashboardContext);

export default function DashboardLayout({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        if (!res.ok) {
          console.error("Dashboard API error:", json);
          setData(getMockDashboardData());
        } else {
          setData(json);
        }
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
        setData(getMockDashboardData());
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <DashboardContext.Provider value={{ data, loading }}>
      <Navbar profile={data?.profile} />
      {data?.isMock && (
        <div className="bg-sonic-purple/20 border-b border-sonic-purple/30 text-sonic-text-muted text-xs text-center py-2 flex items-center justify-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sonic-purple opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sonic-purple"></span>
          </span>
          Currently viewing with <strong>demo analytics data</strong> (Spotify not connected)
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {children}
      </div>
    </DashboardContext.Provider>
  );
}
