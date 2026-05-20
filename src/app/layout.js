import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata = {
    title: "SonicDNA — Your Music DNA Decoded",
    description: "Transform your Spotify listening data into stunning visual stories with AI-powered insights, cinematic analytics, and your unique music personality.",
    keywords: ["Spotify", "music analytics", "listening stats", "AI insights", "music personality"],
    openGraph: {
        title: "SonicDNA — Your Music DNA Decoded",
        description: "Discover your music personality with AI-powered Spotify analytics",
        type: "website",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} dark`}>
            <body className="min-h-screen font-sans antialiased" suppressHydrationWarning>
                {/* Animated mesh gradient background */}
                <div className="mesh-gradient" aria-hidden="true" />
                <div className="mesh-gradient-extra" aria-hidden="true" />
                <div className="noise-overlay" aria-hidden="true" />

                {/* Main content */}
                <main className="relative z-10">{children}</main>
            </body>
        </html>
    );
}