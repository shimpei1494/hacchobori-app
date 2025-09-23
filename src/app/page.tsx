"use client"

import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/bottom-navigation"
import { RestaurantCard } from "@/components/restaurant-card"

// サンプルデータ
const restaurants = [
  {
    id: 1,
    name: "カフェ・ド・八丁堀",
    category: "カフェ",
    rating: 4.5,
    price: "¥800-1,200",
    distance: "2分",
    address: "東京都中央区八丁堀2-1-1",
    tabelog: "https://tabelog.com/tokyo/A1313/A131302/13001234/",
    website: "https://cafe-hachobori.com",
    tags: ["Wi-Fi", "禁煙", "テイクアウト"],
    description: "落ち着いた雰囲気でランチタイムにぴったりのカフェです。",
    isFavorite: false,
  },
  {
    id: 2,
    name: "八丁堀ラーメン横丁",
    category: "ラーメン",
    rating: 4.2,
    price: "¥600-900",
    distance: "5分",
    address: "東京都中央区八丁堀3-2-5",
    tabelog: "https://tabelog.com/tokyo/A1313/A131302/13005678/",
    tags: ["カウンター席", "深夜営業"],
    description: "昔ながらの味を守る老舗ラーメン店。",
    isFavorite: true,
  },
  {
    id: 3,
    name: "オフィス街の定食屋",
    category: "定食",
    rating: 4.7,
    price: "¥700-1,000",
    distance: "3分",
    address: "東京都中央区八丁堀1-5-3",
    tabelog: "https://tabelog.com/tokyo/A1313/A131302/13009012/",
    tags: ["ボリューム満点", "日替わり"],
    description: "サラリーマンに人気の定食屋。ボリューム満点でコスパ抜群！",
    isFavorite: false,
  },
  {
    id: 4,
    name: "イタリアン・ビストロ",
    category: "イタリアン",
    rating: 4.3,
    price: "¥1,200-1,800",
    distance: "7分",
    address: "東京都中央区八丁堀4-1-8",
    website: "https://italian-bistro-hachobori.jp",
    tags: ["パスタ", "ワイン", "おしゃれ"],
    description: "本格的なイタリアンが楽しめるビストロ。",
    isFavorite: false,
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("discover")

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ヘッダー */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-primary">🍱 八丁堀ランチ</h1>
              <p className="text-sm text-muted-foreground">美味しいランチを見つけよう</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>八丁堀駅周辺</span>
            </div>
          </div>

          {/* 検索バー */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="レストランや料理を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="px-4 py-6">
        {/* 統計カード */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-primary">24</div>
              <div className="text-xs text-muted-foreground">登録店舗</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-secondary">12</div>
              <div className="text-xs text-muted-foreground">お気に入り</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-accent">4.3</div>
              <div className="text-xs text-muted-foreground">平均評価</div>
            </CardContent>
          </Card>
        </div>

        {/* カテゴリーフィルター */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["すべて", "カフェ", "ラーメン", "定食", "イタリアン", "和食", "中華"].map((category) => (
            <Badge
              key={category}
              variant={category === "すべて" ? "default" : "secondary"}
              className="whitespace-nowrap cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* レストランリスト */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">おすすめのお店</h2>
            <span className="text-sm text-muted-foreground">{filteredRestaurants.length}件見つかりました</span>
          </div>

          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </main>

      {/* ボトムナビゲーション */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
