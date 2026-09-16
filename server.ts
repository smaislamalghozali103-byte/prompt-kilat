import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { PROMKIL_SYSTEM_INSTRUCTION } from "./src/data/promkilConfig.js";
import { generateStructuredPrompt } from "./src/data/promkilFallback.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "30mb" }));

// Initialize Gemini Client safely
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health Check API
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", name: "PromKil Server", hasKey: !!process.env.GEMINI_API_KEY });
});

// Direct Prompt Builder API
app.post("/api/promkil/quick-build", async (req: Request, res: Response) => {
  try {
    const { designType, visualStyle, character, colorPalette, aspectRatio, theme, specialMode, isVideo } = req.body;

    const userPrompt = `Buatkan prompt visual PromKil untuk:
- Jenis Desain: ${designType || "Poster"}
- Gaya Visual: ${visualStyle || "Minimalis"}
- Karakter: ${character || "Faceless figure"}
- Warna: ${colorPalette || "Pastel"}
- Rasio: ${aspectRatio || "9:16"}
- Tema Utama: "${theme || "Desain Kreatif Masa Depan"}"
- Mode Khusus: ${specialMode || "Default"}
${isVideo ? "- Format: #v Video Prompt" : ""}`;

    const ai = getAI();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: userPrompt,
          config: {
            systemInstruction: PROMKIL_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        if (response.text) {
          return res.json({
            success: true,
            reply: response.text,
            source: "gemini-3.8-flash",
          });
        }
      } catch (err: any) {
        console.warn("Gemini API call error in quick-build, using fallback:", err?.message);
      }
    }

    // Fallback generation
    const generatedPrompt = generateStructuredPrompt({
      designType,
      visualStyle,
      character,
      colorPalette,
      aspectRatio,
      theme: theme || "Creative Visual Presentation",
      specialMode,
      isVideo,
    });

    const reply = `Hai sahabat kreatif! Ini dia prompt visual kilat pesananmu 🎨💛\n\n\`\`\`prompt\n${generatedPrompt}\n\`\`\`\n\nPrompt sudah siap kamu salin ke Midjourney, DALL-E 3, Stable Diffusion, atau AI image generator favoritmu! Ada yang mau disesuaikan lagi? ✨`;

    res.json({
      success: true,
      reply,
      source: "promkil-engine",
    });
  } catch (error: any) {
    console.error("Error in quick-build:", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

// Conversational PromKil Chat API
app.post("/api/promkil/chat", async (req: Request, res: Response) => {
  try {
    const { message, history = [], mediaData } = req.body;

    if (!message && !mediaData) {
      return res.status(400).json({ error: "Message or media is required" });
    }

    const ai = getAI();
    if (ai) {
      try {
        // Build conversation contents
        const contents: any[] = [];

        // Add previous history
        if (Array.isArray(history) && history.length > 0) {
          for (const item of history.slice(-8)) {
            contents.push({
              role: item.role === "assistant" ? "model" : "user",
              parts: [{ text: item.content }],
            });
          }
        }

        // Current message parts
        const currentParts: any[] = [];

        // If media data (image or video frame base64) is provided
        if (mediaData && mediaData.base64 && mediaData.mimeType) {
          currentParts.push({
            inlineData: {
              data: mediaData.base64.replace(/^data:[^;]+;base64,/, ""),
              mimeType: mediaData.mimeType,
            },
          });
          currentParts.push({
            text: message || "Tolong analisis gambar/video ini dan buatkan prompt visual PromKil profesional yang sesuai dengan gaya dan komposisinya!",
          });
        } else {
          currentParts.push({
            text: message,
          });
        }

        contents.push({
          role: "user",
          parts: currentParts,
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: contents,
          config: {
            systemInstruction: PROMKIL_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        if (response.text) {
          return res.json({
            success: true,
            reply: response.text,
            source: "gemini-3.8-flash",
          });
        }
      } catch (err: any) {
        console.warn("Gemini chat API error, using smart fallback:", err?.message);
      }
    }

    // Smart Fallback Parser
    let parsedRatio = "9:16";
    if (message.includes("r11")) parsedRatio = "1:1";
    else if (message.includes("r45")) parsedRatio = "4:5";
    else if (message.includes("r169")) parsedRatio = "16:9";
    else if (message.includes("r69")) parsedRatio = "6:9";
    else if (message.includes("r916")) parsedRatio = "9:16";

    const isVideo = message.includes("#v") || message.toLowerCase().includes("video");
    const isAuto5 = message.toLowerCase().includes("5 gaya") || message.toLowerCase().includes("5 style") || message.toLowerCase().includes("auto generate 5");

    const generated = generateStructuredPrompt({
      theme: message.replace(/r(916|11|45|169|69)/g, "").replace("#v", "").trim() || "Kreatif Visual Masa Depan",
      aspectRatio: parsedRatio,
      specialMode: isAuto5 ? "auto_5_styles" : isVideo ? "video_prompt" : "",
      isVideo,
    });

    const reply = isAuto5
      ? generated
      : `Hai sahabat kreatif! PromKil sudah racik prompt visual yang pas banget buat kamu 🎨💛\n\n\`\`\`prompt\n${generated}\n\`\`\`\n\nPrompt ini sudah dioptimalkan dengan rasio **${parsedRatio}** dan deskripsi visual yang detail dan siap copy-paste! Butuh penyesuaian warna atau karakter? Langsung kasih tahu aku ya! ✨`;

    res.json({
      success: true,
      reply,
      source: "promkil-engine",
    });
  } catch (error: any) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PromKil Server is actively running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
