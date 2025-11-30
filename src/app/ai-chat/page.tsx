import type { Metadata } from "next";
import { AIChat } from "@/components/ai-chat";

export const metadata: Metadata = {
  title: "AIチャット | 八丁堀ランチアプリ",
  description: "AIアシスタントがおすすめのランチを提案します",
};

export default function AIChatPage() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] flex-col">
      <div className="shrink-0 border-b py-4">
        <h1 className="text-2xl font-bold">AIランチアシスタント</h1>
        <p className="text-sm text-muted-foreground">希望に合ったランチのお店をAIが提案します</p>
      </div>
      <AIChat />
    </div>
  );
}
