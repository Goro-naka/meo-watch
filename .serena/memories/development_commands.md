# MEO Watch - 開発コマンド

## 基本開発コマンド

### 開発サーバー
```bash
npm run dev
```
- Turbopack を使用した高速開発サーバー
- http://localhost:3000 でアクセス

### プロダクションビルド
```bash
npm run build
```
- Turbopack を使用したビルド

### プロダクション実行
```bash
npm start
```
- ビルド済みアプリケーションの実行

### コード品質チェック
```bash
npm run lint
```
- ESLint を使用したコード品質チェック

## タスク完了時の推奨手順
1. `npm run lint` - コード品質チェック
2. `npm run build` - ビルドエラーがないか確認
3. 動作確認

## 利用可能なシステムコマンド (Darwin/macOS)
- `git` - バージョン管理
- `ls` - ファイル一覧
- `cd` - ディレクトリ移動  
- `grep` - テキスト検索
- `find` - ファイル検索

## 外部サービス
- **Supabase**: データベースとAuth管理
- **Stripe**: 決済処理
- **Vercel**: デプロイメント

## パッケージ管理
- `npm install` - 依存関係インストール
- `npm update` - パッケージ更新