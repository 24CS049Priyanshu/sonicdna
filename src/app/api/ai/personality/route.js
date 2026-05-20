import { NextResponse } from "next/server";
import { mockPersonality } from "@/lib/mockData";

export async function POST(request) {
  try {
    const { analytics } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Return mock personality if no API key
      return NextResponse.json(mockPersonality);
    }

    const prompt = `You are a witty, emotionally intelligent music analyst. Based on this listener's music analytics data, generate a JSON response with these fields:

DATA:
- Top Genre: ${analytics?.topGenre || "Unknown"}
- Genre Distribution: ${JSON.stringify(analytics?.genreDistribution?.slice(0, 5) || [])}
- Audio Profile: Danceability ${analytics?.audioAverages?.danceability || 0}, Energy ${analytics?.audioAverages?.energy || 0}, Valence ${analytics?.audioAverages?.valence || 0}, Acousticness ${analytics?.audioAverages?.acousticness || 0}
- Diversity Score: ${analytics?.diversityScore || 0}/100
- Mood: ${analytics?.moodLabel || "Unknown"}

Generate this JSON (no markdown, just raw JSON):
{
  "personalityType": "A creative 2-4 word title like 'The Midnight Voyager' or 'The Genre Shapeshifter'",
  "description": "2-3 sentences about their music personality (poetic but not pretentious)",
  "journeyStory": "3-4 sentences describing their listening evolution as an emotional narrative. Mention specific genres from their data. Make it feel personal.",
  "roast": "One witty, funny roast about their listening habits (reference their actual genres/preferences). Keep it playful, not mean.",
  "compliment": "One genuine, warm compliment about their music taste. Make them feel good about their choices.",
  "todaysMood": "One sentence about what their current listening energy suggests about their mood today.",
  "auraDescription": "2 sentences describing what their aura colors represent based on their listening data."
}`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.85,
        max_tokens: 600,
      }),
    });

    if (!res.ok) {
      console.error("OpenAI API error:", res.status);
      return NextResponse.json(mockPersonality);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";

    try {
      const parsed = JSON.parse(content);
      return NextResponse.json(parsed);
    } catch {
      console.error("Failed to parse AI response");
      return NextResponse.json(mockPersonality);
    }
  } catch (error) {
    console.error("Personality API error:", error);
    return NextResponse.json(mockPersonality);
  }
}
