export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  source?: "gemini-3.8-flash" | "promkil-engine";
  mediaUrl?: string;
  mediaType?: "image" | "video";
}

export interface PromptItem {
  id: string;
  title: string;
  promptText: string;
  designType?: string;
  visualStyle?: string;
  aspectRatio?: string;
  timestamp: number;
  isFavorite?: boolean;
  tags?: string[];
  isVideo?: boolean;
}

export interface BuilderState {
  designType: string;
  visualStyle: string;
  character: string;
  colorPalette: string;
  aspectRatio: string;
  theme: string;
  specialMode: string;
  isVideo: boolean;
}
