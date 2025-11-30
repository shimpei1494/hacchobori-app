import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AIChat } from "@/components/ai-chat";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "AIチャット | 八丁堀ランチアプリ",
  description: "AIアシスタントがおすすめのランチを提案します",
};

export default function AIChatPage() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] flex-col">
      <div className="shrink-0 border-b py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-9 w-9">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">ホームに戻る</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">AIランチアシスタント</h1>
            <p className="text-sm text-muted-foreground">希望に合ったランチのお店をAIが提案します</p>
          </div>
        </div>
      </div>
      <AIChat />
    </div>
  );
}
