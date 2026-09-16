import React from "react";
import { Sparkles, MessageSquare, Sliders, Bookmark, Zap, Film } from "lucide-react";

interface HeaderProps {
  activeTab: "chat" | "builder" | "saved";
  setActiveTab: (tab: "chat" | "builder" | "saved") => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, savedCount }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Brand & Persona */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-400 text-amber-950 font-display font-extrabold text-xl shadow-md shadow-amber-400/20">
              <span>PK</span>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight flex items-center gap-1.5">
                  PromKil
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200/60 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                    Prompt Kilat
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Asisten AI Kreatif Pembuat Prompt Visual & Video Profesional
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/70 w-full sm:w-auto justify-center">
            <button
              id="tab-chat"
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "chat"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>Chat PromKil</span>
            </button>

            <button
              id="tab-builder"
              onClick={() => setActiveTab("builder")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "builder"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>Studio Builder</span>
            </button>

            <button
              id="tab-saved"
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "saved"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Bookmark className="w-4 h-4 text-emerald-500" />
              <span>Tersimpan</span>
              {savedCount > 0 && (
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {savedCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Shortcuts Pill */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 bg-amber-50/70 border border-amber-200/50 px-3 py-1.5 rounded-xl">
            <span className="font-semibold text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Kode Kilat:
            </span>
            <code className="bg-white px-1.5 py-0.5 rounded text-[11px] font-mono border border-amber-200 text-amber-800">r916</code>
            <code className="bg-white px-1.5 py-0.5 rounded text-[11px] font-mono border border-amber-200 text-amber-800">r11</code>
            <code className="bg-white px-1.5 py-0.5 rounded text-[11px] font-mono border border-amber-200 text-amber-800">r169</code>
            <code className="bg-white px-1.5 py-0.5 rounded text-[11px] font-mono border border-amber-200 text-amber-800">#v</code>
          </div>
        </div>
      </div>
    </header>
  );
};
