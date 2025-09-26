# MEO Watch デプロイメントガイド

## Vercel デプロイメント設定

### 前提条件

1. GitHubリポジトリが作成されている
2. Vercelアカウントを持っている
3. 必要なサービスアカウントが準備されている:
   - Supabase プロジェクト
   - Stripe アカウント
   - Google Maps API キー

### デプロイ手順

#### 1. Vercelプロジェクト作成

```bash
# Vercel CLIをインストール（まだの場合）
npm i -g vercel

# プロジェクトをVercelにリンク
vercel login
vercel link
```

#### 2. 環境変数設定

Vercel Dashboard > Settings > Environment Variables で以下を設定：

**Production & Preview 両方:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**Production のみ:**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

**Preview のみ (テスト用):**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://your-preview-url.vercel.app
```

#### 3. ドメイン設定

1. Vercel Dashboard > Settings > Domains
2. カスタムドメインを追加
3. DNS設定を更新

#### 4. Cron Jobs 設定

Vercelの設定:
- Cron Jobs は Pro プラン以上で利用可能
- `/api/cron/daily-ranking-check` が毎日9時に実行される

### GitHub自動デプロイ

1. GitHubリポジトリにコードをプッシュ
2. Vercelが自動的にデプロイを開始
3. `main` ブランチ → 本番環境
4. `develop` ブランチ → ステージング環境
5. その他のブランチ → プレビュー環境

### デプロイメント後の確認事項

#### ✅ 基本機能確認

- [ ] サイトが正常に表示される
- [ ] Supabaseデータベースに接続できる
- [ ] 認証が機能する
- [ ] 環境変数が正しく読み込まれる

#### ✅ API エンドポイント確認

- [ ] `/api/health` でヘルスチェックが通る
- [ ] Supabase APIが応答する
- [ ] Stripe Webhookが受信できる

#### ✅ セキュリティ確認

- [ ] HTTPSが有効
- [ ] セキュリティヘッダーが設定されている
- [ ] 環境変数が漏洩していない

### トラブルシューティング

#### ビルドエラー

```bash
# ローカルで確認
npm run vercel-build

#型チェックエラーの場合
npm run type-check

# Lintエラーの場合
npm run lint:check
```

#### 環境変数エラー

1. Vercel Dashboard で設定確認
2. 値をQuoteで囲む必要がある場合あり
3. リデプロイで反映される

#### データベース接続エラー

1. SupabaseのRLSポリシー確認
2. 環境変数の値が正しいか確認
3. Supabase プロジェクトのステータス確認

### 監視・メトリクス

#### Vercel Analytics

- Real User Monitoring が利用可能
- Core Web Vitals の追跡
- Function実行時間の監視

#### エラー監視

- 将来的にSentryを統合予定
- Vercel Functionsのログ監視

### 運用上の注意点

1. **Cron Jobs制限**: Pro プラン以上必要
2. **Function制限**: 実行時間30秒まで
3. **環境変数更新**: リデプロイが必要
4. **ドメイン設定**: DNS伝播に時間がかかる場合あり

### 本番環境チェックリスト

デプロイ前に確認する項目:

- [ ] 全てのテストが通る
- [ ] Lighthouseスコア 90以上
- [ ] セキュリティ監査完了
- [ ] バックアップ計画確立
- [ ] 監視アラート設定
- [ ] ドキュメント更新