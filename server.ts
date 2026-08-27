import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health API
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
  });

  // AI Script generation for next clips with identical character continuity
  app.post("/api/generate-clip-script", async (req, res) => {
    try {
      const { clipNumber, topic, currentStory, tone } = req.body;
      const ai = getAi();

      if (!ai) {
        // Return rich default template if key not set
        const defaultScripts: Record<number, { hindiAudio: string; englishAudio: string; visualPrompt: string; heading3D: string; duration: number }> = {
          2: {
            hindiAudio: "IOIS Platform पर आपको मिलते हैं फ्री कोर्सेज, AI नोट्स और कैरियर रोडमैप - वो भी एकदम प्रैक्टिकल!",
            englishAudio: "On IOIS Platform, you get free courses, AI notes, and career roadmaps - 100% practical!",
            visualPrompt: "Confident 23-year-old Indian girl in dark blue saree with golden border pointing at the IOIS platform feature matrix, glowing golden UI particles, 16:9 4K photorealistic.",
            heading3D: "Free Courses & Smart AI Roadmap",
            duration: 10
          },
          3: {
            hindiAudio: "चाहे आप कॉलेज में हों या घर से शुरुआत करना चाहें, ioisplatform.github.io/iois आज ही खोलें और अपनी जर्नी शुरू करें!",
            englishAudio: "Whether you are in college or starting from home, open ioisplatform.github.io/iois today and start your journey!",
            visualPrompt: "The same 23-year-old Indian girl in dark blue saree with golden border giving a warm thumbs up and inviting gesture with glowing IOIS phoenix logo, 16:9 cinematic.",
            heading3D: "Start Your Learning Journey Now",
            duration: 8
          }
        };

        const result = defaultScripts[clipNumber] || {
          hindiAudio: `IOIS Platform के अगले फीचर में देखिए कि कैसे ये आपकी स्किल को नेक्स्ट लेवल ले जाता है!`,
          englishAudio: `Discover how IOIS Platform takes your skills to the next level!`,
          visualPrompt: `Same 23yo Indian girl in dark blue saree explaining IOIS platform dashboard in studio with golden lighting, 16:9 horizontal.`,
          heading3D: `Next-Level Learning Features`,
          duration: 10
        };
        return res.json({ success: true, script: result, source: "fallback" });
      }

      const prompt = `You are a viral YouTube / Instagram reel scriptwriter for IOIS Platform (website: ioisplatform.github.io/iois).
Character profile: 23-year-old confident Indian girl wearing dark blue saree with golden border in a premium dark blue studio with golden particle lights.
Goal: Create next clip (Clip #${clipNumber || 2}) in a viral video sequence.
Tone: ${tone || "Sweet, confident, attractive, viral influencer style, trustworthy, NO mention of money/earnings"}.
Current Story context: ${currentStory || "Clip 1 hooked users asking why every student and housewife is talking about IOIS Platform."}
Topic/Focus: ${topic || "Features of IOIS Platform (study resources, tech roadmap, practical learning, user-friendly portal)"}

Return ONLY a valid JSON object matching this structure:
{
  "hindiAudio": "Hindi dialogue in Devanagari script for 8-10 seconds",
  "englishAudio": "English translated transcript",
  "visualPrompt": "Detailed 16:9 visual description maintaining the exact same 23yo Indian girl in dark blue saree",
  "heading3D": "Short punchy 3D golden title text in Hinglish or English (under 6 words)",
  "duration": 10
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json({ success: true, script: parsed, source: "gemini" });
    } catch (err: any) {
      console.error("AI Script generation error:", err);
      res.status(500).json({ error: err.message || "Failed to generate script" });
    }
  });

  // TTS generation using Gemini TTS if available
  app.post("/api/tts", async (req, res) => {
    try {
      const { text, voiceName = "Kore" } = req.body;
      const ai = getAi();

      if (!ai) {
        return res.status(400).json({ error: "Gemini API key not configured. Using high-fidelity Web Speech audio synthesis." });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: `Speak in a sweet, confident, friendly Hindi influencer tone: ${text}` }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName as any },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        res.json({ success: true, audioBase64: base64Audio });
      } else {
        res.status(500).json({ error: "No audio generated" });
      }
    } catch (err: any) {
      console.error("TTS error:", err);
      res.status(500).json({ error: err.message || "TTS error" });
    }
  });

  // Vite middleware for development vs static production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
