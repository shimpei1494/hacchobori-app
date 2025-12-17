"use client";

import { Heart, Plus, Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthRequiredDialog } from "@/components/auth/auth-required-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useSearchParams } from "@/hooks/use-search-params";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const router = useRouter();
  const { isAuthenticated, hasCompanyEmail } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authDialogRequireCompanyEmail, setAuthDialogRequireCompanyEmail] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const handleAddClick = () => {
    // ログイン & 会社アドレス登録チェック
    if (!isAuthenticated || !hasCompanyEmail) {
      setAuthDialogRequireCompanyEmail(!hasCompanyEmail);
      setShowAuthDialog(true);
      return;
    }
    router.push("/restaurants/new");
  };

  const handleFavoriteClick = () => {
    // ログインチェックのみ（会社アドレス不要）
    if (!isAuthenticated) {
      setAuthDialogRequireCompanyEmail(false);
      setShowAuthDialog(true);
      return;
    }
    // お気に入りフィルタを有効化
    setSearchParams({ favorite: "true" });
    onTabChange("favorites");
  };

  const handleDiscoverClick = () => {
    // お気に入りフィルタを解除
    setSearchParams({ favorite: "" });
    onTabChange("discover");
  };

  const handleAIChatClick = () => {
    // ログイン & 会社アドレス登録チェック
    if (!isAuthenticated || !hasCompanyEmail) {
      setAuthDialogRequireCompanyEmail(!hasCompanyEmail);
      setShowAuthDialog(true);
      return;
    }
    router.push("/ai-chat");
  };

  const tabs = [
    { id: "discover", label: "発見", icon: Search, onClick: handleDiscoverClick },
    { id: "favorites", label: "お気に入り", icon: Heart, onClick: handleFavoriteClick },
    { id: "add", label: "追加", icon: Plus, onClick: handleAddClick },
    { id: "ai-chat", label: "AIに相談", icon: Sparkles, onClick: handleAIChatClick },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-orange-100 dark:border-orange-900/30 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (tab.onClick) {
                    tab.onClick();
                  } else {
                    onTabChange(tab.id);
                  }
                }}
                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "text-icon-active bg-gradient-to-t from-accent/20 to-accent/5"
                    : "text-icon hover:text-icon-active"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <AuthRequiredDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        isAuthenticated={isAuthenticated}
        requireCompanyEmail={authDialogRequireCompanyEmail}
      />
    </>
  );
}
