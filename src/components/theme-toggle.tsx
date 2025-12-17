"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ハイドレーション後にマウント状態を更新
  useEffect(() => {
    setMounted(true);
  }, []);

  // サーバーサイドレンダリング中はスケルトンを表示
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-accent/10" disabled>
        <Sun className="h-5 w-5" />
        <span className="sr-only">テーマ切り替え</span>
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 hover:bg-accent/10"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* 意図的な色分け: 太陽=黄色（日中を想起）、月=灰色（夜を想起） */}
      {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-slate-700" />}
      <span className="sr-only">テーマ切り替え</span>
    </Button>
  );
}
