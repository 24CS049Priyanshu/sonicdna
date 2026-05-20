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
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          // Fallback to mock data
          setData(getMockDashboardData());
        }
      } catch {
        // Fallback to mock data
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
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {children}
      </div>
    </DashboardContext.Provider>
  );
}
