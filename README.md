<div align="center">
  <img src="screenshots/dashboard.png" alt="SonicDNA Banner" width="100%" />
  
  # SonicDNA
  ### Decode Your Music DNA
  
  **AI-powered Spotify analytics platform with cinematic visual storytelling.**

  ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
  ![Spotify API](https://img.shields.io/badge/Spotify-Web_API-1DB954?style=for-the-badge&logo=spotify)
  ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38BDF8?style=for-the-badge&logo=tailwind-css)
  ![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-black?style=for-the-badge&logo=framer)
</div>

---

## 🔗 Live Demo
[https://sonicdna.vercel.app](https://sonicdna.vercel.app) *(Replace with your actual Vercel link)*

---

## 📸 Screenshots

*A cinematic experience from end to end.*

<div align="center">
  <img src="screenshots/landing.png" alt="Landing Page" width="48%" />
  <img src="screenshots/dashboard.png" alt="Dashboard stats and artists" width="48%" />
</div>
<br/>
<div align="center">
  <img src="screenshots/charts.png" alt="Charts and Heatmaps" width="48%" />
  <img src="screenshots/personality.png" alt="Personality Insights" width="48%" />
</div>
<br/>
<div align="center">
  <img src="screenshots/wrapped.png" alt="Wrapped Share Card" width="48%" />
  <img src="screenshots/mobile.png" alt="Mobile UI View" width="48%" />
</div>

---

## ✨ Features

- **Spotify OAuth Authentication**: Secure PKCE flow using Next.js 15 route handlers.
- **AI Music Personality Analysis**: Generates roasts and compliments using OpenAI `gpt-4o-mini`.
- **Cinematic Music Aura Visualization**: Custom animated gradients based on your unique audio features.
- **Listening Heatmaps**: GitHub-style activity grid of your weekly listening times.
- **Genre Analytics**: Interactive Recharts donut charts and audio radar mapping.
- **Wrapped-style Share Cards**: Exportable, social-media ready summary cards.
- **Real Spotify Listening Insights**: Live data pulling top tracks, artists, and audio features.
- **Premium Responsive UI**: Beautifully designed for both desktop and mobile.

---

## 📖 Design Philosophy

SonicDNA was designed to transform raw Spotify statistics into emotional visual storytelling.

Instead of overwhelming users with data tables, the platform creates a cinematic and immersive experience inspired by Spotify Wrapped, Apple Music, and modern AI interfaces. It leverages glassmorphism, depth lighting, layered typography, and highly intentional micro-interactions to make the user feel like their music data is a premium product of its own.

---

## 🏗️ Architecture

```mermaid
graph TD
    SPOTIFY[Spotify API] -->|PKCE OAuth| API[Next.js API Aggregation Layer]
    API -->|Sanitized JSON| ENGINE[Analytics Engine]
    ENGINE -->|Averages & Genres| UI[Dashboard UI]
    ENGINE -->|Data payload| AI_API[AI Personality Route]
    AI_API -->|Structured Prompt| OPENAI[OpenAI GPT-4o-mini]
    OPENAI -->|Narrative & Roast| UI
```

---

## 🤖 AI-Assisted Development

AI tools were used for:
- architecture planning
- UI refinement
- animation systems
- OAuth debugging
- analytics logic
- premium design polish

*Full planning and development logs are available in the `/ai-logs` folder.*

---

## 🚀 Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sonicdna.git
   cd sonicdna
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Rename `.env.example` to `.env.local` and add your credentials:
   ```env
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   OPENAI_API_KEY=your_openai_key
   NEXT_PUBLIC_BASE_URL=http://127.0.0.1:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Visit `http://127.0.0.1:3000` in your browser.

---

## ⚠️ Known Limitations

- Spotify API rate limits may affect heavy usage.
- Some analytics rely on Spotify’s available listening history, which has historical limits.
- Playback controls are intentionally excluded to ensure full compatibility with free Spotify accounts.
