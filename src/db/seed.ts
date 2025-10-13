import { db } from "./db";
import { categories, restaurantCategories, restaurants, users } from "./schema";

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Create sample user
    const [sampleUser] = await db
      .insert(users)
      .values({
        name: "テストユーザー",
        email: "test@example.com",
        emailVerified: true,
        image: "https://via.placeholder.com/150",
      })
      .returning();

    console.log(`✅ Created user: ${sampleUser.name} (${sampleUser.email})`);

    // Create categories
    const categoryData = [
      { name: "ラーメン", slug: "ramen", displayOrder: 1 },
      { name: "定食", slug: "teishoku", displayOrder: 2 },
      { name: "カフェ", slug: "cafe", displayOrder: 3 },
      { name: "イタリアン", slug: "italian", displayOrder: 4 },
      { name: "和食", slug: "japanese", displayOrder: 5 },
      { name: "中華", slug: "chinese", displayOrder: 6 },
      { name: "海鮮", slug: "seafood", displayOrder: 7 },
      { name: "カレー", slug: "curry", displayOrder: 8 },
    ];

    const createdCategories = await db.insert(categories).values(categoryData).returning();
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create sample restaurants
    const restaurantData = [
      {
        name: "八丁堀ラーメン",
        rating: "4.2",
        priceMin: 800,
        priceMax: 1200,
        distance: "徒歩2分",
        address: "東京都中央区八丁堀1-2-3",
        tabelogUrl: "https://tabelog.com/example1",
        description: "八丁堀で人気のラーメン店。濃厚な豚骨スープが自慢。",
        imageUrl: "https://via.placeholder.com/400x300?text=Ramen",
        isActive: true,
      },
      {
        name: "定食屋まる",
        rating: "4.0",
        priceMin: 700,
        priceMax: 1000,
        distance: "徒歩3分",
        address: "東京都中央区八丁堀2-3-4",
        tabelogUrl: "https://tabelog.com/example2",
        description: "日替わり定食が人気。ボリューム満点でコスパ◎",
        imageUrl: "https://via.placeholder.com/400x300?text=Teishoku",
        isActive: true,
      },
      {
        name: "カフェ・ド・八丁堀",
        rating: "4.5",
        priceMin: 900,
        priceMax: 1500,
        distance: "徒歩1分",
        address: "東京都中央区八丁堀1-1-1",
        tabelogUrl: "https://tabelog.com/example3",
        websiteUrl: "https://cafe-example.com",
        description: "落ち着いた雰囲気のカフェ。ランチセットが充実。",
        imageUrl: "https://via.placeholder.com/400x300?text=Cafe",
        isActive: true,
      },
      {
        name: "トラットリア イタリアーノ",
        rating: "4.3",
        priceMin: 1200,
        priceMax: 2000,
        distance: "徒歩5分",
        address: "東京都中央区八丁堀3-4-5",
        tabelogUrl: "https://tabelog.com/example4",
        description: "本格イタリアンが楽しめる。パスタランチがおすすめ。",
        imageUrl: "https://via.placeholder.com/400x300?text=Italian",
        isActive: true,
      },
      {
        name: "寿司処 海鮮丸",
        rating: "4.6",
        priceMin: 1500,
        priceMax: 3000,
        distance: "徒歩4分",
        address: "東京都中央区八丁堀2-5-6",
        tabelogUrl: "https://tabelog.com/example5",
        description: "新鮮な海鮮が自慢の寿司店。ランチはお得な握りセット。",
        imageUrl: "https://via.placeholder.com/400x300?text=Sushi",
        isActive: true,
      },
      {
        name: "中華料理 龍門",
        rating: "3.9",
        priceMin: 800,
        priceMax: 1500,
        distance: "徒歩3分",
        address: "東京都中央区八丁堀1-3-2",
        tabelogUrl: "https://tabelog.com/example6",
        description: "町中華の定番。麻婆豆腐とチャーハンが人気。",
        imageUrl: "https://via.placeholder.com/400x300?text=Chinese",
        isActive: true,
      },
      {
        name: "カレーハウス スパイス",
        rating: "4.1",
        priceMin: 900,
        priceMax: 1300,
        distance: "徒歩2分",
        address: "東京都中央区八丁堀1-4-3",
        tabelogUrl: "https://tabelog.com/example7",
        description: "スパイスカレー専門店。日替わりカレーが楽しめる。",
        imageUrl: "https://via.placeholder.com/400x300?text=Curry",
        isActive: true,
      },
    ];

    const createdRestaurants = await db.insert(restaurants).values(restaurantData).returning();
    console.log(`✅ Created ${createdRestaurants.length} restaurants`);

    // Link restaurants with categories
    const restaurantCategoryLinks = [
      // 八丁堀ラーメン → ラーメン
      {
        restaurantId: createdRestaurants[0].id,
        categoryId: createdCategories[0].id,
      },
      // 定食屋まる → 定食
      {
        restaurantId: createdRestaurants[1].id,
        categoryId: createdCategories[1].id,
      },
      // カフェ・ド・八丁堀 → カフェ
      {
        restaurantId: createdRestaurants[2].id,
        categoryId: createdCategories[2].id,
      },
      // トラットリア イタリアーノ → イタリアン
      {
        restaurantId: createdRestaurants[3].id,
        categoryId: createdCategories[3].id,
      },
      // 寿司処 海鮮丸 → 和食、海鮮
      {
        restaurantId: createdRestaurants[4].id,
        categoryId: createdCategories[4].id,
      },
      {
        restaurantId: createdRestaurants[4].id,
        categoryId: createdCategories[6].id,
      },
      // 中華料理 龍門 → 中華
      {
        restaurantId: createdRestaurants[5].id,
        categoryId: createdCategories[5].id,
      },
      // カレーハウス スパイス → カレー
      {
        restaurantId: createdRestaurants[6].id,
        categoryId: createdCategories[7].id,
      },
    ];

    await db.insert(restaurantCategories).values(restaurantCategoryLinks);
    console.log(`✅ Created ${restaurantCategoryLinks.length} restaurant-category links`);

    console.log("🎉 Database seeding completed successfully!");

    // Summary
    console.log("\n📋 Seeding Summary:");
    console.log(`  Users: 1`);
    console.log(`  Categories: ${createdCategories.length}`);
    console.log(`  Restaurants: ${createdRestaurants.length}`);
    console.log(`  Restaurant-Category Links: ${restaurantCategoryLinks.length}`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

// Run seed
seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
