import React, { useState } from "react";
import { PROMKIL_OPTIONS } from "../data/promkilConfig.js";
import { BuilderState } from "../types.js";
import { CodeBlockPrompt } from "./CodeBlockPrompt.js";
import {
  Sparkles,
  Layers,
  Palette,
  User,
  Sliders,
  Ratio,
  Wand2,
  Copy,
  Check,
  RotateCcw,
  Film,
  Zap,
} from "lucide-react";

interface StudioBuilderProps {
  onSavePrompt: (text: string) => void;
  savedPromptTexts: Set<string>;
}

export const StudioBuilder: React.FC<StudioBuilderProps> = ({
  onSavePrompt,
  savedPromptTexts,
}) => {
  const [state, setState] = useState<BuilderState>({
    designType: "Poster",
    visualStyle: "Minimalis",
    character: "Faceless",
    colorPalette: "Pastel",
    aspectRatio: "9:16",
    theme: "Hari Peduli Lingkungan & Kelestarian Alam",
    specialMode: "",
    isVideo: false,
  });

  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const themeInspirations = [
    "Poster Hari Kemerdekaan Merah Putih",
    "LKPD Matematika Pecahan Menyenangkan Kelas 4 SD",
    "Feed IG Peluncuran Menu Cafe Aesthetic",
    "Brosur Paket Wisata Petualangan Gunung Bromo",
    "Cover Modul Modul Belajar Digital Masa Kini",
    "Sticker Sheet Hewan Hutan Lucu Kawaii",
    "UI Dashboard Analytics Penjualan E-Commerce",
    "Sertifikat Penghargaan Guru Teladan Berprestasi",
    "Comic Strip 4 Panel Cerita Sahabat Sekolah",
    "Infografis Alur Daur Ulang Sampah Plastik",
  ];

  const handleGenerate = async () => {
    if (!state.theme.trim()) {
      setErrorMsg("Mohon tuliskan tema utama desain terlebih dahulu!");
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/promkil/quick-build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designType: state.designType,
          visualStyle: state.visualStyle,
          character: state.character,
          colorPalette: state.colorPalette,
          aspectRatio: state.aspectRatio,
          theme: state.theme,
          specialMode: state.specialMode,
          isVideo: state.isVideo,
        }),
      });

      const data = await response.json();
      if (data.reply) {
        setGeneratedPrompt(data.reply);
      } else {
        setErrorMsg("Gagal meracik prompt. Silakan coba kembali.");
      }
    } catch (err: any) {
      console.error("Builder generation error:", err);
      setErrorMsg("Terjadi kendala koneksi ke server PromKil.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setState({
      designType: "Poster",
      visualStyle: "Minimalis",
      character: "Faceless",
      colorPalette: "Pastel",
      aspectRatio: "9:16",
      theme: "Hari Peduli Lingkungan & Kelestarian Alam",
      specialMode: "",
      isVideo: false,
    });
    setGeneratedPrompt(null);
  };

  // Color mapping helper for visual swatch
  const getColorSwatch = (name: string) => {
    switch (name) {
      case "Pastel":
        return "bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200";
      case "Earth Tone":
        return "bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-800";
      case "Neon":
        return "bg-gradient-to-r from-cyan-400 via-emerald-400 to-fuchsia-500";
      case "Monochrome":
        return "bg-gradient-to-r from-slate-900 via-slate-600 to-slate-200";
      case "Merah Putih":
        return "bg-gradient-to-r from-red-600 to-white border border-red-200";
      case "Coffee Aesthetic":
        return "bg-gradient-to-r from-amber-900 via-amber-800 to-amber-600";
      case "Tropical":
        return "bg-gradient-to-r from-emerald-500 via-yellow-400 to-teal-500";
      case "Sky Blue":
        return "bg-gradient-to-r from-sky-400 to-blue-500";
      case "Retro Muted":
        return "bg-gradient-to-r from-amber-600 via-rose-500 to-teal-700";
      default:
        return "bg-slate-300";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 rounded-3xl p-6 sm:p-8 text-amber-950 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-amber-900 text-xs font-bold mb-3 shadow-xs">
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            Studio Builder Kilat
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-slate-950">
            Rancang Prompt Visual dengan Sekali Klik
          </h2>
          <p className="text-sm sm:text-base text-amber-950/80 mt-2 leading-relaxed">
            Kombinasikan jenis desain, gaya visual, karakter, palet warna, dan mode khusus.
            PromKil akan menyusun prompt berstandar industri dengan formula visual lengkap!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Config Panel */}
        <div className="lg:col-span-7 space-y-6 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          {/* Section 6: Tema Utama */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>6. Tema Utama Desain</span>
              <span className="text-xs font-normal text-amber-600">Wajib diisi</span>
            </label>
            <input
              type="text"
              value={state.theme}
              onChange={(e) => setState({ ...state, theme: e.target.value })}
              placeholder="Contoh: Poster Hari Kemerdekaan, LKPD Belajar Pecahan, dll..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/60 outline-hidden text-sm text-slate-800 transition-all font-medium"
            />
            {/* Quick Inspiration Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mr-1">
                Inspirasi:
              </span>
              {themeInspirations.slice(0, 4).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setState({ ...state, theme: item })}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-600 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Jenis Desain */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>1. Jenis Desain</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {PROMKIL_OPTIONS.designTypes.map((dt) => (
                <button
                  key={dt}
                  type="button"
                  onClick={() => setState({ ...state, designType: dt })}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border ${
                    state.designType === dt
                      ? "bg-amber-400 text-amber-950 border-amber-400 shadow-xs scale-[1.02]"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {dt}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Gaya Visual */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-indigo-500" />
              <span>2. Gaya Visual</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PROMKIL_OPTIONS.visualStyles.map((vs) => (
                <button
                  key={vs}
                  type="button"
                  onClick={() => setState({ ...state, visualStyle: vs })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    state.visualStyle === vs
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {vs}
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Rasio (Aspect Ratio) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Ratio className="w-4 h-4 text-emerald-500" />
              <span>5. Rasio Kanvas</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PROMKIL_OPTIONS.aspectRatios.map((r) => (
                <button
                  key={r.ratio}
                  type="button"
                  onClick={() => setState({ ...state, aspectRatio: r.ratio })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    state.aspectRatio === r.ratio
                      ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="font-mono font-bold text-sm">{r.ratio}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{r.code}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 7: Mode Khusus */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>7. Mode Khusus (Opsional)</span>
              </label>
              {state.specialMode && (
                <button
                  type="button"
                  onClick={() => setState({ ...state, specialMode: "" })}
                  className="text-xs text-rose-600 hover:underline"
                >
                  Hapus Mode
                </button>
              )}
            </div>
            <select
              value={state.specialMode}
              onChange={(e) => setState({ ...state, specialMode: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 outline-hidden focus:border-amber-400"
            >
              <option value="">-- Pilih Mode Khusus (Atau gunakan Standar) --</option>
              {PROMKIL_OPTIONS.specialModes.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.desc}
                </option>
              ))}
            </select>
          </div>

          {/* Section 3 & 4: Karakter & Warna */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Karakter */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-500" />
                <span>3. Karakter</span>
              </label>
              <select
                value={state.character}
                onChange={(e) => setState({ ...state, character: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-hidden"
              >
                {PROMKIL_OPTIONS.characters.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Warna */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-pink-500" />
                <span>4. Warna</span>
              </label>
              <select
                value={state.colorPalette}
                onChange={(e) => setState({ ...state, colorPalette: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-hidden"
              >
                {PROMKIL_OPTIONS.colorPalettes.map((cp) => (
                  <option key={cp} value={cp}>
                    {cp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Video Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50/80 border border-purple-200 cursor-pointer">
              <input
                type="checkbox"
                checked={state.isVideo}
                onChange={(e) => setState({ ...state, isVideo: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <div className="text-xs">
                <span className="font-bold text-purple-950 flex items-center gap-1">
                  <Film className="w-3.5 h-3.5 text-purple-700" />
                  Format Video Prompt (#v)
                </span>
                <span className="text-purple-800">
                  Hasilkan prompt video sinematik dengan CAMERA MOVEMENT, LIGHTING, dan DURATION (untuk Veo, Kling, Sora, Runway).
                </span>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Pilihan</span>
            </button>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-sm shadow-md shadow-amber-400/20 active:scale-95 transition-all"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <span>Meracik Prompt...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>⚡ Racik Prompt Kilat</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Hasil Prompt PromKil</span>
              </h3>
              {generatedPrompt && (
                <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Siap Salin
                </span>
              )}
            </div>

            {generatedPrompt ? (
              <div className="mt-3">
                <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {/* Extract codeblocks or render full text */}
                  {generatedPrompt.includes("```") ? (
                    (() => {
                      const match = generatedPrompt.match(/```(?:prompt)?\s*([\s\S]*?)```/);
                      if (match) {
                        return (
                          <CodeBlockPrompt
                            promptText={match[1]}
                            onSave={onSavePrompt}
                            isSaved={savedPromptTexts.has(match[1].trim())}
                          />
                        );
                      }
                      return (
                        <CodeBlockPrompt
                          promptText={generatedPrompt}
                          onSave={onSavePrompt}
                          isSaved={savedPromptTexts.has(generatedPrompt.trim())}
                        />
                      );
                    })()
                  ) : (
                    <CodeBlockPrompt
                      promptText={generatedPrompt}
                      onSave={onSavePrompt}
                      isSaved={savedPromptTexts.has(generatedPrompt.trim())}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-200/50">
                  <Wand2 className="w-6 h-6" />
                </div>
                <div className="max-w-xs mx-auto">
                  <p className="text-xs font-semibold text-slate-700">Belum Ada Prompt Dibuat</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Pilih opsi di sebelah kiri lalu klik tombol "⚡ Racik Prompt Kilat" untuk melihat hasilnya di sini.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Specifications Guide Card */}
          <div className="bg-amber-50/70 border border-amber-200/60 rounded-3xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              Panduan Struktur PromKil:
            </h4>
            <ul className="text-amber-900/80 space-y-1 pl-4 list-disc text-[11px]">
              <li>Format prompt dijamin rapi dengan tag desain, layout, font, lighting, dan mood.</li>
              <li>Sesuai untuk Midjourney, DALL-E 3, Stable Diffusion, Recraft, dan video generator.</li>
              <li>Gunakan kode kilat seperti <code>r916</code> atau <code>#v</code> di tab chat untuk eksekusi kilat.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
