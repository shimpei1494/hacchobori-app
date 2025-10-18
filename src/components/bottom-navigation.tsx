"use client";

import { Heart, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthRequiredDialog } from "@/components/auth/auth-required-dialog";
import { useAuth } from "@/hooks/use-auth";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const router = useRouter();
  const { isAuthenticated, hasCompanyEmail } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleAddClick = () => {
    // ログイン & 会社アドレス登録チェック
    if (!isAuthenticated || !hasCompanyEmail) {
      setShowAuthDialog(true);
      return;
    }
    router.push("/restaurants/new");
  };

  const tabs = [
    { id: "discover", label: "発見", icon: Search },
    { id: "add", label: "追加", icon: Plus, onClick: handleAddClick },
    { id: "favorites", label: "お気に入り", icon: Heart },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
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
                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
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
        requireCompanyEmail={!hasCompanyEmail}
      />
    </>
  );
}
