"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white">🔍</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            MEO Watch
          </h1>
          <p className="text-xl text-gray-600 mb-2">汎用MEO監視ツール</p>
          <p className="text-lg text-gray-500">
            毎日の手動チェックを完全自動化
          </p>
        </div>

        {/* Problem Statement */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              😫 こんな作業していませんか？
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center text-red-700">
                <span className="mr-3">⏰</span>
                <span>毎日Googleマップで順位チェック</span>
              </div>
              <div className="flex items-center text-red-700">
                <span className="mr-3">📊</span>
                <span>手動でスプレッドシートに記録</span>
              </div>
              <div className="flex items-center text-red-700">
                <span className="mr-3">🏆</span>
                <span>競合他社の順位も気になる</span>
              </div>
              <div className="flex items-center text-red-700">
                <span className="mr-3">📱</span>
                <span>口コミの数や評価もチェック</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-red-100 rounded-lg">
              <p className="text-red-800 font-medium">
                💸 <strong>年間18時間</strong>の作業時間 = 時給2000円なら
                <strong>年間36,000円の損失</strong>
              </p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              ✨ MEO Watchで解決！
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center text-green-700">
                <span className="mr-3">🤖</span>
                <span>完全自動で毎日監視</span>
              </div>
              <div className="flex items-center text-green-700">
                <span className="mr-3">📈</span>
                <span>グラフで推移が一目瞭然</span>
              </div>
              <div className="flex items-center text-green-700">
                <span className="mr-3">🎯</span>
                <span>競合比較も自動取得</span>
              </div>
              <div className="flex items-center text-green-700">
                <span className="mr-3">📧</span>
                <span>順位変動時はアラート通知</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">主要機能</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-2">フリーキーワード対応</h3>
              <p className="text-gray-600">
                「地域名 + 業種」はもちろん、「安い ランチ
                品川」など、どんなキーワードでも監視可能
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-2">競合分析</h3>
              <p className="text-gray-600">
                同じ検索結果に表示される競合店舗の情報も自動取得。順位推移を比較分析
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-2">アラート通知</h3>
              <p className="text-gray-600">
                順位が上がった・下がった時に即座にメール通知。重要な変化を見逃しません
              </p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">料金プラン</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  完全無料
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-3xl font-bold text-green-600 mb-4">
                ¥0<span className="text-sm text-gray-500">/月</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li>✅ 1キーワードのみ</li>
                <li>✅ 日次監視</li>
                <li>✅ 基本レポート（7日間）</li>
                <li>❌ メール通知</li>
                <li>❌ 競合分析</li>
                <li>❌ CSV出力</li>
              </ul>
              <button className="w-full mt-6 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                今すぐ無料で始める
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                ¥980<span className="text-sm text-gray-500">/月</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li>✅ 5キーワードまで</li>
                <li>✅ 日次監視</li>
                <li>✅ 基本レポート（30日間）</li>
                <li>✅ メール通知</li>
                <li>✅ CSV出力</li>
                <li>❌ 競合分析</li>
              </ul>
              <button className="w-full mt-6 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                14日間無料トライアル
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-600 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  人気No.1
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Business</h3>
              <div className="text-3xl font-bold text-purple-600 mb-4">
                ¥2,980<span className="text-sm text-gray-500">/月</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li>✅ 30キーワードまで</li>
                <li>✅ 競合分析</li>
                <li>✅ CSV出力</li>
                <li>✅ 詳細レポート（無制限）</li>
                <li>✅ 優先サポート</li>
                <li>✅ アラート通知</li>
              </ul>
              <button className="w-full mt-6 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                14日間無料トライアル
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">今すぐ無料で始める</h2>
            <p className="mb-6">
              14日間の無料トライアル。クレジットカード登録不要。
            </p>
            <Link
              href="/auth/signup"
              className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              無料で始める →
            </Link>
            <p className="text-sm mt-4 opacity-90">
              既にアカウントをお持ちの方は{" "}
              <Link href="/auth/login" className="underline">
                ログイン
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
