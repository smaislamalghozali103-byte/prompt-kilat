import React, { useState } from "react";
import { Copy, Check, Bookmark, Download, Sparkles, Wand2 } from "lucide-react";

interface CodeBlockPromptProps {
  promptText: string;
  onSave?: (text: string) => void;
  isSaved?: boolean;
}

export const CodeBlockPrompt: React.FC<CodeBlockPromptProps> = ({
  promptText,
  onSave,
  isSaved = false,
}) => {
  const [copied, setCopied] = useState(false);

  const cleanText = promptText.trim();

  // Extract Aspect Ratio if present
  const aspectMatch = cleanText.match(/Aspect Ratio:\s*([^\n\r]+)/i);
  const detectedRatio = aspectMatch ? aspectMatch[1].trim() : null;

  // Extract Design Type if present
  const designMatch = cleanText.match(/Design Type:\s*([^\n\r]+)/i);
  const detectedDesign = designMatch ? designMatch[1].trim() : null;

  // Check if Video prompt
  const isVideo = cleanText.startsWith("SCENE:") || cleanText.includes("CAMERA MOVEMENT:");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([cleanText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `promkil-prompt-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;

  return (
    <div className="my-3 rounded-xl border border-slate-700/80 bg-slate-900 text-slate-100 shadow-md overflow-hidden text-sm">
      {/* Prompt Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-slate-800/90 border-b border-slate-700/70 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-semibold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            {isVideo ? "Prompt Video AI" : "Prompt Gambar AI"}
          </span>
          {detectedRatio && (
            <span className="px-2 py-0.5 rounded-md bg-slate-700 font-mono text-slate-200 border border-slate-600">
              {detectedRatio}
            </span>
          )}
          {detectedDesign && (
            <span className="hidden sm:inline px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-800/60">
              {detectedDesign}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px] mr-1 hidden md:inline">
            {wordCount} kata
          </span>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-400 text-amber-950 hover:bg-amber-300 font-semibold transition-colors text-xs"
            title="Salin Prompt"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-800" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Prompt</span>
              </>
            )}
          </button>

          {onSave && (
            <button
              onClick={() => onSave(cleanText)}
              className={`p-1.5 rounded-md transition-colors ${
                isSaved
                  ? "text-emerald-400 bg-emerald-950/60 border border-emerald-800"
                  : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
              title={isSaved ? "Tersimpan di Galeri" : "Simpan ke Galeri"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-emerald-400" : ""}`} />
            </button>
          )}

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Unduh .txt"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Code Text Content */}
      <div className="p-4 overflow-x-auto max-h-[440px] font-mono text-[13px] leading-relaxed select-text whitespace-pre-wrap text-amber-50/95 selection:bg-amber-400 selection:text-slate-900">
        {cleanText}
      </div>

      {/* Quick Tool Target Bar */}
      <div className="px-3.5 py-2 bg-slate-800/40 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Wand2 className="w-3 h-3 text-amber-400" />
          Siap digunakan di:
          <span className="text-slate-200 font-medium">
            {isVideo
              ? "Google Veo, Kling AI, OpenAI Sora, Runway Gen-3, Hailuo"
              : "Midjourney, DALL-E 3, Flux 1.1, Stable Diffusion, Recraft, Ideogram"}
          </span>
        </span>
      </div>
    </div>
  );
};
