import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "八丁堀ランチアプリ",
	description: "八丁堀エリアのランチ情報管理システム",
	icons: {
		icon: "/favicon.ico",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja">
			<body className="min-h-screen bg-gray-50 font-sans antialiased">
				{children}
			</body>
		</html>
	);
}
