import React, { useState } from "react";
import { PROMKIL_OPTIONS } from "../data/promkilConfig.js";
import { Sparkles, Palette, User, Ratio, Layers, ChevronRight, Wand2 } from "lucide-react";

interface QuickOptionBarProps {
  onSelectOption: (category: string, value: string) => void;
  onQuickSend: (text: string) => void;
}

export const QuickOptionBar: React.FC<QuickOptionBarProps> = ({
  onSelectOption,
  onQuickSend,
}) => {
  const [activeCategory, setActiveCategory] = useState<
    "popular" | "design" | "style" | "character" | "color" | "ratio" | "mode"
  >("popular");

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-xs mb-3">
      {/* Category Pills Header */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100 text-xs font-semibold">
        <button
          onClick={() => setActiveCategory("popular")}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeCategory === "popular"
              ? "bg-amber-400 text-amber-950 shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Menu Populer</span>
        </button>

        <button
          onClick={() => setActiveCategory("design")}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeCategory === "design"
              ? "bg-amber-400 text-amber-950 shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>1. Jenis Desain</span>
        </button>

        <button
          onClick={() => setActiveCategory("style")}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeCategory === "style"
              ? "bg-amber-400 text-amber-950 shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>2. Gaya Visual</span>
        </button>

        <button
          onClick={() => setActiveCategory("ratio")}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeCategory === "ratio"
              ? "bg-amber-400 text-amber-950 shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>5. Rasio (r916, r11...)</span>
        </button>

        <button
          onClick={() => setActiveCategory("mode")}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeCategory === "mode"
              ? "bg-amber-400 text-amber-950 shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>7. Mode Khusus</span>
        </button>

        <button
          onClick={() => setActiveCategory("character")}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeCategory === "character"
              ? "bg-amber-400 text-amber-950 shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>3. Karakter</span>
        </button>

        <button
          onClick={() => setActiveCategory("color")}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeCategory === "color"
              ? "bg-amber-400 text-amber-950 shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>4. Warna</span>
        </button>
      </div>

      {/* Chips Area */}
      <div className="pt-2.5">
        {activeCategory === "popular" && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
              <Wand2 className="w-3 h-3 text-amber-500" />
              Satu Klik:
            </span>
            <button
              onClick={() => onQuickSend("Auto Generate 5 Gaya untuk poster Hari Bumi kelestarian alam")}
              className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 font-medium transition-colors"
            >
              ✨ Auto 5 Gaya: Hari Bumi
            </button>
            <button
              onClick={() => onQuickSend("Mode Guru-Friendly untuk LKPD Matematika Penjumlahan Seru Kelas 2 SD r45")}
              className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 font-medium transition-colors"
            >
              🍎 LKPD Guru-Friendly (r45)
            </button>
            <button
              onClick={() => onQuickSend("Sticker Sheet Cute Animal Mascot pastel kawaii r11")}
              className="text-xs px-2.5 py-1 rounded-full bg-pink-50 text-pink-900 border border-pink-200 hover:bg-pink-100 font-medium transition-colors"
            >
              🐱 Sticker Sheet Cute Animals
            </button>
            <button
              onClick={() => onQuickSend("Carousel 10 Slide tips produktivitas kerja kreatif r11 Mode Agensi Profesional")}
              className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100 font-medium transition-colors"
            >
              📑 Carousel 10 Slide Agensi
            </button>
            <button
              onClick={() => onQuickSend("#v Seorang barista meracik kopi estetik di cafe bertema kayu hangat dan tanaman hijau, sinematik 4k")}
              className="text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 font-medium transition-colors"
            >
              🎬 #v Video Barista Cafe
            </button>
            <button
              onClick={() => onQuickSend("Logo Maker minimal modern coffee aesthetic brand")}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200 font-medium transition-colors"
            >
              ☕ Logo Maker Minimal
            </button>
          </div>
        )}

        {activeCategory === "design" && (
          <div className="flex flex-wrap gap-1.5">
            {PROMKIL_OPTIONS.designTypes.map((item) => (
              <button
                key={item}
                onClick={() => onSelectOption("Jenis Desain", item)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {activeCategory === "style" && (
          <div className="flex flex-wrap gap-1.5">
            {PROMKIL_OPTIONS.visualStyles.map((item) => (
              <button
                key={item}
                onClick={() => onSelectOption("Gaya Visual", item)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {activeCategory === "ratio" && (
          <div className="flex flex-wrap gap-2">
            {PROMKIL_OPTIONS.aspectRatios.map((item) => (
              <button
                key={item.code}
                onClick={() => onSelectOption("Rasio", item.code)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-50 text-amber-950 hover:bg-amber-100 border border-amber-200 transition-colors"
              >
                <code className="font-mono font-bold text-amber-700">{item.code}</code>
                <span>({item.ratio})</span>
                <span className="text-slate-400 text-[11px]">- {item.desc}</span>
              </button>
            ))}
          </div>
        )}

        {activeCategory === "mode" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
            {PROMKIL_OPTIONS.specialModes.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectOption("Mode Khusus", item.name)}
                className="text-left p-2 rounded-lg bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 transition-colors"
              >
                <div className="font-semibold text-xs text-slate-800 flex items-center justify-between">
                  <span>{item.name}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{item.desc}</p>
              </button>
            ))}
          </div>
        )}

        {activeCategory === "character" && (
          <div className="flex flex-wrap gap-1.5">
            {PROMKIL_OPTIONS.characters.map((item) => (
              <button
                key={item}
                onClick={() => onSelectOption("Karakter", item)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {activeCategory === "color" && (
          <div className="flex flex-wrap gap-1.5">
            {PROMKIL_OPTIONS.colorPalettes.map((item) => (
              <button
                key={item}
                onClick={() => onSelectOption("Warna", item)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
