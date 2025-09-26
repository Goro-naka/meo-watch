# MEO Watch - コードスタイルとコンベンション

## TypeScript設定
- **Target**: ES2017
- **Strict**: true（厳密な型チェック）
- **JSX**: preserve（Next.jsで処理）
- **Module Resolution**: bundler
- **Path Mapping**: `@/*` → `./src/*`

## ESLint設定
- **Extends**: next/core-web-vitals, next/typescript
- **Ignored**: node_modules, .next, out, build, next-env.d.ts

## プロジェクト構造
```
src/
├── app/           # Next.js App Router
│   ├── page.tsx   # ホームページ
│   ├── layout.tsx # ルートレイアウト
│   └── globals.css # グローバルスタイル
```

## コーディングスタイル
- **関数コンポーネント**: デフォルトエクスポート
- **TypeScript**: 厳密な型定義
- **CSS**: Tailwind CSS のユーティリティクラス
- **命名規則**: 
  - コンポーネント: PascalCase (例: `Home`, `RootLayout`)
  - 変数: camelCase
  - ファイル: kebab-case for pages, PascalCase for components

## スタイリング規則
- Tailwind CSS を使用
- グラデーション: `bg-gradient-to-r from-blue-600 to-purple-600`
- カラーパレット: blue, purple, green, red系統
- レスポンシブデザイン: `md:` ブレークポイント使用

## コンポーネント設計
- 機能別にセクション分割
- 日本語UIテキスト使用
- アクセシビリティ対応（セマンティックHTML）
- モバイルファースト設計