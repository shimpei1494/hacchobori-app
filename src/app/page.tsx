import Link from "next/link";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="container mx-auto px-4 py-16">
				{/* Header */}
				<div className="text-center mb-16">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						八丁堀ランチアプリ
					</h1>
					<p className="text-xl text-gray-600 mb-8">
						八丁堀エリアのランチ情報管理システム
					</p>
					<div className="flex justify-center gap-4">
						<Link
							href="/login"
							className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center gap-2"
						>
							ログイン
							<span>→</span>
						</Link>
					</div>
				</div>

				{/* Features */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
					<div className="bg-white rounded-lg shadow-md p-6">
						<div className="mb-4">
							<h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
								<span className="text-blue-600">🍱</span>
								レストラン管理
							</h3>
							<p className="text-gray-600 text-sm">
								八丁堀エリアのレストラン情報を一元管理
							</p>
						</div>
						<div>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>• レストラン情報の登録・編集</li>
								<li>• 営業時間・定休日管理</li>
								<li>• カテゴリ分類</li>
							</ul>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-md p-6">
						<div className="mb-4">
							<h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
								<span className="text-green-600">🍽️</span>
								メニュー管理
							</h3>
							<p className="text-gray-600 text-sm">
								ランチメニューと価格情報の管理
							</p>
						</div>
						<div>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>• 日替わりメニュー登録</li>
								<li>• 価格情報管理</li>
								<li>• メニュー写真アップロード</li>
							</ul>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-md p-6">
						<div className="mb-4">
							<h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
								<span className="text-purple-600">⭐</span>
								レビュー管理
							</h3>
							<p className="text-gray-600 text-sm">
								ユーザーレビューと評価の管理
							</p>
						</div>
						<div>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>• レビュー投稿・編集</li>
								<li>• 評価システム</li>
								<li>• おすすめ度管理</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="text-center text-gray-500">
					<p>&copy; 2024 八丁堀ランチアプリ. All rights reserved.</p>
				</div>
			</div>
		</div>
	);
}
