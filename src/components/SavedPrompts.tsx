import React, { useState } from "react";
import { PromptItem } from "../types.js";
import { CodeBlockPrompt } from "./CodeBlockPrompt.js";
import {
  Bookmark,
  Search,
  Trash2,
  Download,
  Copy,
  Check,
  Sparkles,
  Layers,
  ArrowUpRight,
} from "lucide-react";

interface SavedPromptsProps {
  savedPrompts: PromptItem[];
  onDeletePrompt: (id: string) => void;
  onClearAll: () => void;
  onNavigateToBuilder: () => void;
}

export const SavedPrompts: React.FC<SavedPromptsProps> = ({
  savedPrompts,
  onDeletePrompt,
  onClearAll,
  onNavigateToBuilder,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPrompts = savedPrompts.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.promptText.toLowerCase().includes(q) ||
      (item.designType && item.designType.toLowerCase().includes(q))
    );
  });

  const handleCopySingle = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  const exportAllAsJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(savedPrompts, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `promkil-library-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportAllAsTXT = () => {
    let content = "=== KOLEKSI PROMPT VISUAL PROMKIL ===\n\n";
    savedPrompts.forEach((p, idx) => {
      content += `--- PROMPT #${idx + 1}: ${p.title} ---\n`;
      content += `Tanggal: ${new Date(p.timestamp).toLocaleString()}\n`;
      content += `\n${p.promptText}\n\n=========================================\n\n`;
    });

    const file = new Blob([content], { type: "text/plain" });
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = URL.createObjectURL(file);
    downloadAnchor.download = `promkil-prompts-all-${Date.now()}.txt`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-500 fill-emerald-500" />
            <span>Koleksi Prompt Tersimpan</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {savedPrompts.length} prompt
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Daftar seluruh prompt visual dan video yang kamu simpan dari obrolan PromKil.
          </p>
        </div>

        {savedPrompts.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={exportAllAsTXT}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .TXT</span>
            </button>

            <button
              onClick={exportAllAsJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .JSON</span>
            </button>

            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua</span>
            </button>
          </div>
        )}
      </div>

      {/* Search Filter */}
      {savedPrompts.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari prompt tersimpan berdasarkan kata kunci, tema, rasio..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 outline-hidden text-sm text-slate-800 bg-white"
          />
        </div>
      )}

      {/* Prompts List */}
      {filteredPrompts.length > 0 ? (
        <div className="space-y-4">
          {filteredPrompts.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-slate-300 transition-all space-y-3"
            >
              {/* Prompt Card Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(item.timestamp).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopySingle(item.id, item.promptText)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-950 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onDeletePrompt(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Hapus dari koleksi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Prompt Code Block */}
              <CodeBlockPrompt promptText={item.promptText} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-200/80 p-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200/60">
            <Bookmark className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              {savedPrompts.length === 0
                ? "Belum ada prompt tersimpan"
                : "Tidak ada prompt yang cocok dengan pencarian"}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {savedPrompts.length === 0
                ? "Saat PromKil menghasilkan prompt visual di tab Chat atau Studio Builder, klik ikon bookmark untuk menyimpannya ke koleksi ini."
                : "Coba ubah kata kunci pencarian kamu untuk menemukan prompt yang diinginkan."}
            </p>
          </div>

          {savedPrompts.length === 0 && (
            <button
              onClick={onNavigateToBuilder}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-xs transition-all"
            >
              <span>Buka Studio Builder Sekarang</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
