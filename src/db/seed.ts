import { db } from "./db";
import { categories, restaurantCategories, restaurants } from "./schema";

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

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
      { name: "洋食", slug: "western", displayOrder: 9 },
      { name: "エスニック", slug: "ethnic", displayOrder: 10 },
      { name: "フレンチ", slug: "french", displayOrder: 11 },
      { name: "その他", slug: "other", displayOrder: 12 },
    ];

    const createdCategories = await db.insert(categories).values(categoryData).returning();
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create restaurants from restaurant-sample.md
    const restaurantData = [
      {
        name: "魚豊",
        priceMin: null,
        priceMax: 999,
        distance: "徒歩5分",
        googleMapUrl: "https://maps.app.goo.gl/5dEfSFn1py9GySXc6",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13194436/",
        description: "1000円未満のメニューあり、ごはん多め。\n【注意点】混むので早い時間に行くのがおすすめ。",
        isActive: true,
      },
      {
        name: "ラティーノ",
        priceMin: null,
        priceMax: null,
        distance: "徒歩8分",
        googleMapUrl: "https://maps.app.goo.gl/xFk5bPdwvs9FVjgK8",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13010909/",
        description: "メニューが豊富（焼きカレー、タコライス）。\n【注意点】混むので早い時間に行くのがおすすめ。",
        isActive: true,
      },
      {
        name: "ハチョボリーノ",
        priceMin: null,
        priceMax: null,
        distance: "徒歩5分",
        googleMapUrl: "https://maps.app.goo.gl/hSTzP9MMuzszyH2U9",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13209734/",
        description: "パスタやピザが楽しめる。",
        isActive: true,
      },
      {
        name: "エベレストイン",
        priceMin: null,
        priceMax: null,
        distance: "徒歩3分",
        googleMapUrl: "https://maps.app.goo.gl/TF9jXUsfrSLji2bL8",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13174799/",
        description: "",
        isActive: true,
      },
      {
        name: "SITA",
        priceMin: null,
        priceMax: null,
        distance: "徒歩4分",
        googleMapUrl: "https://maps.app.goo.gl/mmmDP3cSmaxaz3USA",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13211709/",
        description: "エスニックメニューもあり。",
        isActive: true,
      },
      {
        name: "コピティアム",
        priceMin: null,
        priceMax: null,
        distance: "徒歩5分",
        googleMapUrl: "https://maps.app.goo.gl/J1GKWvfjVWBAn4hx8",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130202/13159096/",
        description: "めずらしいメニューが楽しめる。",
        isActive: true,
      },
      {
        name: "BOICHI",
        priceMin: null,
        priceMax: null,
        distance: "徒歩4分",
        googleMapUrl: "https://maps.app.goo.gl/Wo1mPRjMmJZjY9GK8",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13181311/",
        description: "ローストビーフがおすすめ。\n【注意点】ちょっとお高め。",
        isActive: true,
      },
      {
        name: "こんぴらさん",
        priceMin: null,
        priceMax: null,
        distance: "徒歩5分",
        googleMapUrl: "https://maps.app.goo.gl/4hD7ksQVDVNRBLqA7",
        tabelogUrl: "https://tabelog.com/tokyo/A1313/A131302/13278669/",
        description: "サクッと食べたいときにおすすめ。",
        isActive: true,
      },
      {
        name: "はしご",
        priceMin: null,
        priceMax: null,
        distance: "徒歩6分",
        googleMapUrl: "https://maps.app.goo.gl/FWRH9kurwxXJCfi6A",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13007684/",
        description: "だんだん麺がめちゃ美味い！\n【注意点】混むので早い時間に行くのがおすすめ。",
        isActive: true,
      },
      {
        name: "四万十",
        priceMin: null,
        priceMax: null,
        distance: "徒歩6分",
        googleMapUrl: "https://maps.app.goo.gl/S4iEU5KbBQt7A14t9",
        tabelogUrl: "https://tabelog.com/tokyo/A1313/A131301/13237588/",
        description: "カツオのたたき定食が絶品。\n【注意点】混むので早い時間に行くのがおすすめ。",
        isActive: true,
      },
      {
        name: "掃部介（かもんのすけ）",
        priceMin: null,
        priceMax: null,
        distance: "徒歩8分",
        googleMapUrl: "https://maps.app.goo.gl/adAhpe2bborkBvM48",
        tabelogUrl: "https://tabelog.com/tokyo/A1313/A131301/13246329/",
        description: "安い！もやしラーメンがおすすめ。\n【注意点】混むので早い時間に行くのがおすすめ。",
        isActive: true,
      },
      {
        name: "イル バッカ",
        priceMin: null,
        priceMax: null,
        distance: "徒歩6分",
        googleMapUrl: "https://maps.app.goo.gl/QxBSwxoMTx2TrmEbA",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13078660/",
        description: "ウニパスタが最高。\n【注意点】少々お高め。",
        isActive: true,
      },
      {
        name: "さ和鳥",
        priceMin: null,
        priceMax: null,
        distance: "徒歩3分",
        googleMapUrl: "https://maps.app.goo.gl/DU8J6WNcP3KvkxUG8",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13103209/",
        description: "親子どんぶり、蕎麦が絶品。\n【注意点】混むので早い時間に行くのがおすすめ。",
        isActive: true,
      },
      {
        name: "キッチンROVEN",
        priceMin: null,
        priceMax: null,
        distance: "徒歩6分",
        googleMapUrl: "https://maps.app.goo.gl/Bz4PRF2SKFo7j7VJA",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13225672/",
        description: "ハンバーグ、ロールキャベツがおすすめ。\n【注意点】ちょっとお高め。",
        isActive: true,
      },
      {
        name: "バンコック ポニー食堂",
        priceMin: null,
        priceMax: 999,
        distance: "徒歩7分",
        googleMapUrl: "https://maps.app.goo.gl/FQp669TUtcnFW74c8",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13149993/",
        description: "1000円未満のメニューあり。\n【注意点】お店が狭め。",
        isActive: true,
      },
      {
        name: "魚然",
        priceMin: 1000,
        priceMax: 1000,
        distance: "徒歩4分",
        googleMapUrl: "https://maps.app.goo.gl/8Z9EfG2hTpcxGYE98",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13158638/",
        description: "焼魚、海鮮丼など近場の魚屋。1000円程度。",
        isActive: true,
      },
      {
        name: "KADONO",
        priceMin: null,
        priceMax: null,
        distance: "徒歩4分",
        googleMapUrl: "https://maps.app.goo.gl/5cEt9YRoBGJ3TaAj9",
        tabelogUrl: "https://tabelog.com/tokyo/A1313/A131301/13150978/",
        description: "スパイスカレー、グリーンカレーが美味。",
        isActive: true,
      },
      {
        name: "七彩",
        priceMin: null,
        priceMax: null,
        distance: "徒歩7分",
        googleMapUrl: "https://maps.app.goo.gl/XXmhQN899wQpKUMk7",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13184399/",
        description: "手打ち太麺。種類豊富。\n【注意点】混む＆提供時間がかかるので早めに行くのがおすすめ。",
        isActive: true,
      },
      {
        name: "旬菜山",
        priceMin: null,
        priceMax: null,
        distance: "徒歩7分",
        googleMapUrl: "https://maps.app.goo.gl/hDP5eMuyWkdCqjHq6",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13064506/",
        description: "焼き魚、煮魚、海鮮丼など豊富。",
        isActive: true,
      },
      {
        name: "肴屋",
        priceMin: 1200,
        priceMax: 1200,
        distance: "徒歩3分",
        googleMapUrl: "https://maps.app.goo.gl/Kf2YLHmt1TkUcSKP7",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13032786/",
        description: "1200円の刺身定食はおすすめ。\n【注意点】混むので早い時間に行くのがおすすめ。",
        isActive: true,
      },
      {
        name: "鈴木米店",
        priceMin: null,
        priceMax: null,
        distance: "徒歩3分",
        googleMapUrl: "https://maps.app.goo.gl/Cb9GEXicuqaKDYdm7",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13241458/",
        description: "魚のフライ定食がおいしい。\n【注意点】混むので早めに！お店は狭め（4名までOK）。",
        isActive: true,
      },
      {
        name: "DE ICHIBA",
        priceMin: null,
        priceMax: null,
        distance: "徒歩5分",
        googleMapUrl: "https://maps.app.goo.gl/XFGDGxPj6RvcdGYa6",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13050611/",
        description: "デミグラスなオムライスおすすめ。\n【注意点】混むので早い時間に行くのがおすすめ。",
        isActive: true,
      },
      {
        name: "一汁三菜イタリア〜の",
        priceMin: null,
        priceMax: null,
        distance: "徒歩4分",
        googleMapUrl: "https://maps.app.goo.gl/k8iedY5oeMD2ZhaRA",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13012442/",
        description: "野菜やたんぱく質を摂れるメニュー。",
        isActive: true,
      },
      {
        name: "バンゲラズ",
        priceMin: null,
        priceMax: null,
        distance: "徒歩3分",
        googleMapUrl: "https://maps.app.goo.gl/cMeqfff2z9sbUdGL8",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13278196/",
        description: "カレーやビリヤニ、スパイシーなビリヤニおすすめ。\n【注意点】混むので早い時間に行くのがおすすめ。",
        isActive: true,
      },
      {
        name: "PIZZERIA Lucia",
        priceMin: null,
        priceMax: null,
        distance: "徒歩4分",
        googleMapUrl: "https://maps.app.goo.gl/u8Lga2XRCtNQmQsY7",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13163097/",
        description: "サラダ・味噌汁・ドリンクバー付き海鮮丼、洋食。",
        isActive: true,
      },
      {
        name: "たじま",
        priceMin: null,
        priceMax: null,
        distance: "徒歩4分",
        googleMapUrl: "https://maps.app.goo.gl/2R4qpcei3T3TWJLj7",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13222673/",
        description: "海鮮、美味しいけど安くはない。\n【注意点】混むので早い時間に行くのがおすすめ。",
        isActive: true,
      },
      {
        name: "八丁堀食堂",
        priceMin: null,
        priceMax: null,
        distance: "徒歩3分",
        googleMapUrl: "https://maps.app.goo.gl/UuA1R1kpjPtEirQ97",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13142931/",
        description: "唐揚げがめちゃデカい。\n【注意点】休みが多いのでX（Twitter）で確認推奨。",
        isActive: true,
      },
      {
        name: "西八丁堀 八眞茂登",
        priceMin: 1000,
        priceMax: 1000,
        distance: "徒歩4分",
        googleMapUrl: "https://maps.app.goo.gl/JKvGqUtCACEDh9ft7",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13120842/",
        description: "揚げたて熱々の揚げ物定食（1000円）。\n【その他】2階席あり（4名程度可）。",
        isActive: true,
      },
      {
        name: "翠幸",
        priceMin: 1000,
        priceMax: 1000,
        distance: "徒歩6分",
        googleMapUrl: "https://maps.app.goo.gl/NLX7rosZkXBthU1NA",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13056965/",
        description: "すき焼き、ハンバーグ、まぐろなど1000円程度。\n【注意点】混むので早い時間に行くのがおすすめ。お店が狭め。",
        isActive: true,
      },
      {
        name: "柚",
        priceMin: null,
        priceMax: null,
        distance: "徒歩5分",
        googleMapUrl: "https://maps.app.goo.gl/jcATc6bfmGGfafTG6",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13058404/",
        description: "和御膳、日替定食（煮魚、焼き魚、ネギトロ丼など）。",
        isActive: true,
      },
      {
        name: "BISTRO HAMAIF",
        priceMin: 1500,
        priceMax: null,
        distance: "徒歩6分",
        googleMapUrl: "https://maps.app.goo.gl/WEy49A1BUmvUjfrG9",
        tabelogUrl: "https://tabelog.com/tokyo/A1313/A131301/13226552/",
        description: "お肉プレートランチ、ジビエあり。夜も美味しい。\n【その他】1500円〜。",
        isActive: true,
      },
      {
        name: "Dopo Domani",
        priceMin: null,
        priceMax: null,
        distance: "徒歩3分",
        googleMapUrl: "https://maps.app.goo.gl/mpuxkKgvSxeVzTo28",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130202/13163993/",
        description: "日替わりパスタ、リゾット。パン・サラダ付。",
        isActive: true,
      },
      {
        name: "仲宮里",
        priceMin: null,
        priceMax: null,
        distance: "徒歩5分",
        googleMapUrl: "https://maps.app.goo.gl/CWhwX21dKk1ozhk18",
        tabelogUrl: "https://tabelog.com/tokyo/A1313/A131301/13083281/",
        description: "ゴーヤチャンプル、タコライス、沖縄そば。",
        isActive: true,
      },
      {
        name: "ワッカ Japanese Spice Curry wacca",
        priceMin: null,
        priceMax: null,
        distance: "徒歩5分",
        googleMapUrl: "https://maps.app.goo.gl/xSXdv9y8N8hNsJz27",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13254664/",
        description: "大阪の有名店。",
        isActive: true,
      },
      {
        name: "beer&wine厨房 tamaya八丁堀店",
        priceMin: null,
        priceMax: null,
        distance: "徒歩5分",
        googleMapUrl: "https://maps.app.goo.gl/jwQiQamjzFwi4Xqg9",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13122796/",
        description: "パスタ、サラダランチ（サラダとパン）。",
        isActive: true,
      },
      {
        name: "おつきさま",
        priceMin: null,
        priceMax: null,
        distance: "徒歩5分",
        googleMapUrl: "https://maps.app.goo.gl/ELbad6jzaRZxtiqY9",
        tabelogUrl: "https://tabelog.com/tokyo/A1302/A130203/13276446/",
        description: "サンドイッチ専門店（バナナチョコ、スイートポテトアップルなど）。",
        isActive: true,
      },
      {
        name: "うら銀座くらぶ",
        priceMin: null,
        priceMax: null,
        distance: "徒歩6分",
        googleMapUrl: "https://maps.app.goo.gl/7WpBjVUb1oPrxFhv7",
        tabelogUrl: "https://tabelog.com/tokyo/A1313/A131301/13205496/",
        description: "担々麺、生姜焼き定食、焼き魚定食など酒類豊富！\n【注意点】混むので早い時間に行くのがおすすめ。\n【その他】※34番（BISTRO HAMAIF）の上の階",
        isActive: true,
      },
    ];

    const createdRestaurants = await db.insert(restaurants).values(restaurantData).returning();
    console.log(`✅ Created ${createdRestaurants.length} restaurants`);

    // Link restaurants with categories
    // カテゴリインデックス: 0:ラーメン 1:定食 2:カフェ 3:イタリアン 4:和食 5:中華 6:海鮮 7:カレー 8:洋食 9:エスニック 10:フレンチ 11:その他
    const restaurantCategoryLinks = [
      { restaurantId: createdRestaurants[0].id, categoryId: createdCategories[6].id }, // 魚豊 → 海鮮
      { restaurantId: createdRestaurants[1].id, categoryId: createdCategories[9].id }, // ラティーノ → エスニック
      { restaurantId: createdRestaurants[2].id, categoryId: createdCategories[3].id }, // ハチョボリーノ → イタリアン
      { restaurantId: createdRestaurants[3].id, categoryId: createdCategories[7].id }, // エベレストイン → カレー
      { restaurantId: createdRestaurants[4].id, categoryId: createdCategories[7].id }, // SITA → カレー
      { restaurantId: createdRestaurants[4].id, categoryId: createdCategories[9].id }, // SITA → エスニック
      { restaurantId: createdRestaurants[5].id, categoryId: createdCategories[9].id }, // コピティアム → エスニック
      { restaurantId: createdRestaurants[6].id, categoryId: createdCategories[8].id }, // BOICHI → 洋食
      { restaurantId: createdRestaurants[7].id, categoryId: createdCategories[11].id }, // こんぴらさん → その他
      { restaurantId: createdRestaurants[8].id, categoryId: createdCategories[0].id }, // はしご → ラーメン
      { restaurantId: createdRestaurants[9].id, categoryId: createdCategories[1].id }, // 四万十 → 定食
      { restaurantId: createdRestaurants[10].id, categoryId: createdCategories[0].id }, // 掃部介 → ラーメン
      { restaurantId: createdRestaurants[11].id, categoryId: createdCategories[3].id }, // イル バッカ → イタリアン
      { restaurantId: createdRestaurants[12].id, categoryId: createdCategories[4].id }, // さ和鳥 → 和食
      { restaurantId: createdRestaurants[13].id, categoryId: createdCategories[8].id }, // キッチンROVEN → 洋食
      { restaurantId: createdRestaurants[14].id, categoryId: createdCategories[9].id }, // バンコック ポニー食堂 → エスニック
      { restaurantId: createdRestaurants[15].id, categoryId: createdCategories[6].id }, // 魚然 → 海鮮
      { restaurantId: createdRestaurants[16].id, categoryId: createdCategories[7].id }, // KADONO → カレー
      { restaurantId: createdRestaurants[17].id, categoryId: createdCategories[0].id }, // 七彩 → ラーメン
      { restaurantId: createdRestaurants[18].id, categoryId: createdCategories[6].id }, // 旬菜山 → 海鮮
      { restaurantId: createdRestaurants[19].id, categoryId: createdCategories[6].id }, // 肴屋 → 海鮮
      { restaurantId: createdRestaurants[20].id, categoryId: createdCategories[1].id }, // 鈴木米店 → 定食
      { restaurantId: createdRestaurants[21].id, categoryId: createdCategories[8].id }, // DE ICHIBA → 洋食
      { restaurantId: createdRestaurants[22].id, categoryId: createdCategories[3].id }, // 一汁三菜イタリア〜の → イタリアン
      { restaurantId: createdRestaurants[23].id, categoryId: createdCategories[7].id }, // バンゲラズ → カレー
      { restaurantId: createdRestaurants[23].id, categoryId: createdCategories[9].id }, // バンゲラズ → エスニック
      { restaurantId: createdRestaurants[24].id, categoryId: createdCategories[6].id }, // PIZZERIA Lucia → 海鮮
      { restaurantId: createdRestaurants[24].id, categoryId: createdCategories[8].id }, // PIZZERIA Lucia → 洋食
      { restaurantId: createdRestaurants[25].id, categoryId: createdCategories[6].id }, // たじま → 海鮮
      { restaurantId: createdRestaurants[26].id, categoryId: createdCategories[1].id }, // 八丁堀食堂 → 定食
      { restaurantId: createdRestaurants[27].id, categoryId: createdCategories[1].id }, // 西八丁堀 八眞茂登 → 定食
      { restaurantId: createdRestaurants[28].id, categoryId: createdCategories[1].id }, // 翠幸 → 定食
      { restaurantId: createdRestaurants[29].id, categoryId: createdCategories[4].id }, // 柚 → 和食
      { restaurantId: createdRestaurants[30].id, categoryId: createdCategories[10].id }, // BISTRO HAMAIF → フレンチ
      { restaurantId: createdRestaurants[31].id, categoryId: createdCategories[3].id }, // Dopo Domani → イタリアン
      { restaurantId: createdRestaurants[32].id, categoryId: createdCategories[9].id }, // 仲宮里 → エスニック
      { restaurantId: createdRestaurants[33].id, categoryId: createdCategories[7].id }, // ワッカ → カレー
      { restaurantId: createdRestaurants[34].id, categoryId: createdCategories[3].id }, // beer&wine厨房 tamaya → イタリアン
      { restaurantId: createdRestaurants[35].id, categoryId: createdCategories[11].id }, // おつきさま → その他
      { restaurantId: createdRestaurants[36].id, categoryId: createdCategories[1].id }, // うら銀座くらぶ → 定食
      { restaurantId: createdRestaurants[36].id, categoryId: createdCategories[5].id }, // うら銀座くらぶ → 中華
    ];

    await db.insert(restaurantCategories).values(restaurantCategoryLinks);
    console.log(`✅ Created ${restaurantCategoryLinks.length} restaurant-category links`);

    console.log("🎉 Database seeding completed successfully!");

    // Summary
    console.log("\n📋 Seeding Summary:");
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
