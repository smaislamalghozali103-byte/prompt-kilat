import React, { useState, useEffect } from "react";
import { Header } from "./components/Header.js";
import { ChatView } from "./components/ChatView.js";
import { StudioBuilder } from "./components/StudioBuilder.js";
import { SavedPrompts } from "./components/SavedPrompts.js";
import { ChatMessage, PromptItem } from "./types.js";

const INITIAL_GREETING = `Hai sahabat! Kenalin aku PromKil yang siap bantu kamu buat prompt 🎨💛

Silakan pilih dulu ya, kalau enggak ada, boleh langsung bilang kamu mau buat apa:

1. Jenis Desain
- Poster
- Infografis
- Banner
- Feed IG
- Slide
- Worksheet
- LKPD
- Cover Modul
- Sertifikat
- Tiket
- Brosur (bi-fold / tri-fold)
- Map Acara
- Comic Strip
- Sticker Pack
- Logo
- Mockup
- dll

2. Gaya Visual
- Islami
- Pastel Cute
- Vibrant
- Clay 3D
- Chibi
- Profesional
- Estetik Korea
- Minimalis
- Retro
- Neon Cyberpunk
- Scrapbook
- Watercolor
- Gouache
- Oil Paint
- Hologram
- AR
- Kawaii
- Manga
- Pixar Clay
- dll

3. Karakter
- Anak SD
- Remaja
- Guru
- Dokter
- Chibi
- Faceless
- Outline
- Mascot
- Animal Cute
- Robot Blob

4. Warna
- Pastel
- Earth Tone
- Neon
- Monochrome
- Merah Putih
- Coffee Aesthetic
- Tropical
- Sky Blue
- Retro Muted
- dll

5. Rasio
- 1:1
- 4:5
- 6:9
- 9:16 (default)
- 16:9

6. Tema Utama
→ Sebutkan tema desain yang diinginkan.

7. Mode Khusus (opsional)
- Auto Generate 5 Gaya
- Mode Agensi Profesional
- Mode Guru-Friendly
- Auto Layout Builder
- Sticker Sheet
- Logo Maker
- Comic Panel
- 3D Pop-Up
- Hologram
- AR Poster
- Storybook
- Blueprint
- UI Dashboard
- Carousel 10 Slide
- Character Sheet RPG
- Fantasy Map
- Exhibition Poster
- Food Poster
- Emoji Pack
- Cute Shop Branding
- Flowchart Mode
- Mindmap Mode
- Flashcard Generator
- Badge Reward
- Eco Poster
- Pastel Kawaii Dashboard
- Mini Research Poster

Ayo pilih opsinya sahabat! 😊`;

export default function App() {
  const [activeTab, setActiveTab] = useState<"chat" | "builder" | "saved">("chat");

  // Load saved prompts from localStorage
  const [savedPrompts, setSavedPrompts] = useState<PromptItem[]>(() => {
    try {
      const stored = localStorage.getItem("promkil_saved_prompts");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Load messages from localStorage or initialize with PromKil's exact greeting
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem("promkil_messages");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return [
      {
        id: "initial-greeting",
        role: "assistant",
        content: INITIAL_GREETING,
        timestamp: Date.now(),
        source: "promkil-engine",
      },
    ];
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync saved prompts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("promkil_saved_prompts", JSON.stringify(savedPrompts));
    } catch (e) {
      console.warn("Unable to save to localStorage:", e);
    }
  }, [savedPrompts]);

  // Sync messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("promkil_messages", JSON.stringify(messages));
    } catch (e) {
      console.warn("Unable to save messages to localStorage:", e);
    }
  }, [messages]);

  const handleSendMessage = async (
    text: string,
    mediaData?: { base64: string; mimeType: string; url: string; type: "image" | "video" }
  ) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
      mediaUrl: mediaData?.url,
      mediaType: mediaData?.type,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/promkil/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mediaData: mediaData
            ? {
                base64: mediaData.base64,
                mimeType: mediaData.mimeType,
              }
            : undefined,
        }),
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          data.reply ||
          "Maaf sahabat, ada kendala koneksi sebentar. Boleh diulang kembali pertanyaannya? 😊",
        timestamp: Date.now(),
        source: data.source || "promkil-engine",
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const fallbackMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "Hai sahabat! Ada kendala saat menghubungi server. Kamu juga bisa meracik prompt langsung lewat tab **Studio Builder** di atas ya! 🎨💛",
        timestamp: Date.now(),
        source: "promkil-engine",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if (window.confirm("Mulai ulang percakapan dengan PromKil dari awal?")) {
      const fresh: ChatMessage[] = [
        {
          id: `initial-${Date.now()}`,
          role: "assistant",
          content: INITIAL_GREETING,
          timestamp: Date.now(),
          source: "promkil-engine",
        },
      ];
      setMessages(fresh);
    }
  };

  const handleSavePrompt = (promptText: string) => {
    const cleanText = promptText.trim();
    if (savedPrompts.some((p) => p.promptText === cleanText)) {
      return; // already saved
    }

    // Extract Title or Theme
    const themeMatch = cleanText.match(/Theme:\s*"([^"]+)"/i) || cleanText.match(/Theme:\s*([^\n\r]+)/i);
    const designMatch = cleanText.match(/Design Type:\s*([^\n\r]+)/i);
    const aspectMatch = cleanText.match(/Aspect Ratio:\s*([^\n\r]+)/i);

    const title = themeMatch ? themeMatch[1].trim() : designMatch ? designMatch[1].trim() : "Prompt Visual PromKil";

    const newPromptItem: PromptItem = {
      id: `prompt-${Date.now()}`,
      title,
      promptText: cleanText,
      designType: designMatch ? designMatch[1].trim() : undefined,
      aspectRatio: aspectMatch ? aspectMatch[1].trim() : undefined,
      timestamp: Date.now(),
      isVideo: cleanText.startsWith("SCENE:") || cleanText.includes("CAMERA MOVEMENT:"),
    };

    setSavedPrompts((prev) => [newPromptItem, ...prev]);
  };

  const handleDeleteSavedPrompt = (id: string) => {
    setSavedPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearAllSaved = () => {
    if (window.confirm("Hapus semua koleksi prompt tersimpan?")) {
      setSavedPrompts([]);
    }
  };

  const savedPromptTextsSet = new Set(savedPrompts.map((p) => p.promptText));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedPrompts.length}
      />

      <main className="flex-1">
        {activeTab === "chat" && (
          <ChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onResetChat={handleResetChat}
            onSavePrompt={handleSavePrompt}
            savedPromptTexts={savedPromptTextsSet}
          />
        )}

        {activeTab === "builder" && (
          <StudioBuilder
            onSavePrompt={handleSavePrompt}
            savedPromptTexts={savedPromptTextsSet}
          />
        )}

        {activeTab === "saved" && (
          <SavedPrompts
            savedPrompts={savedPrompts}
            onDeletePrompt={handleDeleteSavedPrompt}
            onClearAll={handleClearAllSaved}
            onNavigateToBuilder={() => setActiveTab("builder")}
          />
        )}
      </main>
    </div>
  );
}
