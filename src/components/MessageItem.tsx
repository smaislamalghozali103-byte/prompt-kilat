import React from "react";
import { ChatMessage } from "../types.js";
import { CodeBlockPrompt } from "./CodeBlockPrompt.js";
import { Sparkles, User, Clock, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import Markdown from "react-markdown";

interface MessageItemProps {
  message: ChatMessage;
  onSavePrompt?: (text: string) => void;
  savedPromptTexts?: Set<string>;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onSavePrompt,
  savedPromptTexts = new Set(),
}) => {
  const isAssistant = message.role === "assistant";

  // Parse prompt blocks from message content
  // Format: ```prompt\n...\n``` or ```\n...\n```
  const renderContent = (content: string) => {
    const codeBlockRegex = /```(?:prompt)?\s*([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Text before code block
      if (match.index > lastIndex) {
        const textBefore = content.substring(lastIndex, match.index);
        parts.push({
          type: "text",
          content: textBefore,
        });
      }

      // Code block
      const promptBody = match[1];
      parts.push({
        type: "prompt",
        content: promptBody,
      });

      lastIndex = match.index + match[0].length;
    }

    // Trailing text
    if (lastIndex < content.length) {
      parts.push({
        type: "text",
        content: content.substring(lastIndex),
      });
    }

    // If no code blocks were found, return pure text
    if (parts.length === 0) {
      parts.push({ type: "text", content });
    }

    return (
      <div className="space-y-2">
        {parts.map((part, idx) => {
          if (part.type === "prompt") {
            const isSaved = savedPromptTexts.has(part.content.trim());
            return (
              <CodeBlockPrompt
                key={idx}
                promptText={part.content}
                onSave={onSavePrompt}
                isSaved={isSaved}
              />
            );
          }
          return (
            <div key={idx} className="text-[14px] leading-relaxed markdown-content">
              <Markdown>{part.content}</Markdown>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`flex items-start gap-3 my-4 ${
        isAssistant ? "justify-start" : "justify-end"
      }`}
    >
      {/* Assistant Avatar */}
      {isAssistant && (
        <div className="flex-shrink-0 w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 text-amber-950 font-display font-extrabold flex items-center justify-center shadow-sm border border-amber-300/60 mt-1">
          <span className="text-xs">PK</span>
        </div>
      )}

      {/* Message Box */}
      <div
        className={`max-w-2xl lg:max-w-3xl rounded-2xl p-4 transition-all shadow-xs ${
          isAssistant
            ? "bg-white border border-slate-200/90 text-slate-800"
            : "bg-amber-400 text-amber-950 font-medium ml-auto"
        }`}
      >
        {/* Media Preview if user uploaded an image or video */}
        {message.mediaUrl && (
          <div className="mb-3 rounded-xl overflow-hidden border border-slate-200/80 bg-slate-100 max-h-60 max-w-sm">
            {message.mediaType === "video" ? (
              <video
                src={message.mediaUrl}
                controls
                className="w-full h-auto object-cover max-h-60"
              />
            ) : (
              <img
                src={message.mediaUrl}
                alt="Uploaded media preview"
                className="w-full h-auto object-contain max-h-60"
              />
            )}
            <div className="px-2.5 py-1 text-[11px] text-slate-500 flex items-center gap-1 bg-slate-50 border-t border-slate-200">
              {message.mediaType === "video" ? (
                <VideoIcon className="w-3 h-3 text-amber-500" />
              ) : (
                <ImageIcon className="w-3 h-3 text-amber-500" />
              )}
              <span>Media terlampir untuk dianalisis</span>
            </div>
          </div>
        )}

        {/* Message body */}
        <div className="overflow-hidden">{renderContent(message.content)}</div>

        {/* Message footer timestamp */}
        <div
          className={`flex items-center justify-between gap-2 mt-2 pt-1 border-t text-[11px] ${
            isAssistant ? "border-slate-100 text-slate-400" : "border-amber-300/60 text-amber-900"
          }`}
        >
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 opacity-60" />
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isAssistant && message.source && (
            <span className="flex items-center gap-1 font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
              <Sparkles className="w-3 h-3" />
              {message.source === "gemini-3.8-flash" ? "Gemini AI" : "PromKil Kilat"}
            </span>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="flex-shrink-0 w-9 h-9 rounded-2xl bg-slate-800 text-white flex items-center justify-center shadow-sm mt-1">
          <User className="w-4 h-4 text-slate-200" />
        </div>
      )}
    </div>
  );
};
