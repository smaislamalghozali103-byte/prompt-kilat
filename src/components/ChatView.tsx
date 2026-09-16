import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types.js";
import { MessageItem } from "./MessageItem.js";
import { QuickOptionBar } from "./QuickOptionBar.js";
import {
  Send,
  Sparkles,
  Paperclip,
  X,
  RefreshCw,
  Image as ImageIcon,
  Video as VideoIcon,
  HelpCircle,
  Zap,
} from "lucide-react";

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (
    text: string,
    mediaData?: { base64: string; mimeType: string; url: string; type: "image" | "video" }
  ) => Promise<void>;
  isLoading: boolean;
  onResetChat: () => void;
  onSavePrompt: (text: string) => void;
  savedPromptTexts: Set<string>;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onResetChat,
  onSavePrompt,
  savedPromptTexts,
}) => {
  const [inputText, setInputText] = useState("");
  const [mediaFile, setMediaFile] = useState<{
    file: File;
    previewUrl: string;
    base64: string;
    type: "image" | "video";
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !mediaFile) || isLoading) return;

    const currentText = inputText.trim();
    const currentMedia = mediaFile
      ? {
          base64: mediaFile.base64,
          mimeType: mediaFile.file.type,
          url: mediaFile.previewUrl,
          type: mediaFile.type,
        }
      : undefined;

    setInputText("");
    setMediaFile(null);

    await onSendMessage(currentText, currentMedia);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isImage && !isVideo) {
      alert("Hanya format gambar atau video yang didukung.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      setMediaFile({
        file,
        previewUrl,
        base64,
        type: isVideo ? "video" : "image",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSelectQuickOption = (_category: string, value: string) => {
    setInputText((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) {
        return value;
      }
      return `${trimmed} ${value}`;
    });
    textareaRef.current?.focus();
  };

  const handleQuickSend = (text: string) => {
    onSendMessage(text);
  };

  const appendRatio = (code: string) => {
    setInputText((prev) => {
      // Remove any existing ratio code if present
      const cleaned = prev.replace(/\b(r916|r11|r45|r169|r69)\b/g, "").trim();
      return cleaned ? `${cleaned} ${code}` : code;
    });
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-5xl mx-auto px-3 sm:px-6 py-2">
      {/* Top Banner & Action */}
      <div className="flex items-center justify-between py-1.5 px-2 text-xs text-slate-500 border-b border-slate-200/60 mb-2">
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>PromKil Online</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 hidden sm:inline">
            Siap buat prompt poster, infografis, LKPD, logo, 3D, hingga video #v
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetChat}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
            title="Mulai percakapan baru"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            onSavePrompt={onSavePrompt}
            savedPromptTexts={savedPromptTexts}
          />
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 my-4">
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-amber-950 font-display font-extrabold flex items-center justify-center shadow-xs">
              PK
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl px-4 py-3 shadow-xs">
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <span className="animate-spin text-amber-500">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span>PromKil sedang meracik prompt visual detail untukmu...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Option Menu Bar */}
      <div className="pt-2">
        <QuickOptionBar
          onSelectOption={handleSelectQuickOption}
          onQuickSend={handleQuickSend}
        />
      </div>

      {/* Input Form Area */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3 relative">
        {/* Media Preview Box */}
        {mediaFile && (
          <div className="mb-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              {mediaFile.type === "image" ? (
                <img
                  src={mediaFile.previewUrl}
                  alt="Upload preview"
                  className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                />
              ) : (
                <video
                  src={mediaFile.previewUrl}
                  className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                />
              )}
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-800 truncate max-w-[200px]">
                  {mediaFile.file.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  {mediaFile.type === "video" ? "Video untuk Mode Video Otomatis" : "Gambar untuk analisis visual"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setMediaFile(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Text Input */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik tema desain, atau pilih opsi di atas... (contoh: Poster Hari Guru r916 gaya watercolor, atau #v untuk video)"
            rows={2}
            className="w-full resize-none outline-hidden text-sm text-slate-800 placeholder-slate-400 leading-relaxed font-sans"
          />

          {/* Bottom Bar Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            {/* Left Quick Adders */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,video/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium transition-colors border border-slate-200"
                title="Unggah Gambar / Video untuk dianalisis"
              >
                <Paperclip className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Unggah Media</span>
              </button>

              <span className="text-slate-300">|</span>

              <span className="text-[11px] text-slate-400 mr-0.5">Rasio:</span>
              <button
                type="button"
                onClick={() => appendRatio("r916")}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-950 font-mono text-xs font-semibold"
                title="Aspect Ratio 9:16 (Default)"
              >
                r916
              </button>
              <button
                type="button"
                onClick={() => appendRatio("r11")}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-950 font-mono text-xs font-semibold"
                title="Aspect Ratio 1:1"
              >
                r11
              </button>
              <button
                type="button"
                onClick={() => appendRatio("r45")}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-950 font-mono text-xs font-semibold"
                title="Aspect Ratio 4:5"
              >
                r45
              </button>
              <button
                type="button"
                onClick={() => appendRatio("r169")}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-950 font-mono text-xs font-semibold"
                title="Aspect Ratio 16:9"
              >
                r169
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputText((prev) => (prev.includes("#v") ? prev : `#v ${prev}`));
                  textareaRef.current?.focus();
                }}
                className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 hover:bg-purple-200 font-mono text-xs font-bold flex items-center gap-1"
                title="Format Video Prompt"
              >
                <VideoIcon className="w-3 h-3" />
                #v Video
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={(!inputText.trim() && !mediaFile) || isLoading}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                (!inputText.trim() && !mediaFile) || isLoading
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-sm active:scale-95"
              }`}
            >
              <span>Kirim ke PromKil</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
