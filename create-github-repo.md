# GitHubリポジトリ作成手順

## GitHub CLIでログイン

```bash
gh auth login
```

ブラウザが開いてGitHubアカウントでログインしてください。

## リポジトリ作成とプッシュ

```bash
# GitHubにリポジトリを作成してプッシュ
gh repo create meo-watch --public --source=. --remote=origin --push

# または、プライベートリポジトリとして作成する場合：
# gh repo create meo-watch --private --source=. --remote=origin --push
```

## 作成後の確認

- リポジトリURL: https://github.com/[username]/meo-watch
- GitHub Actions CI/CDが正常に動作しているか確認
- READMEファイルが正しく表示されているか確認

## Vercel連携

1. [Vercel Dashboard](https://vercel.com/dashboard) にログイン
2. 「New Project」をクリック
3. GitHubリポジトリ「meo-watch」を選択
4. 環境変数を設定:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```
5. 「Deploy」をクリック

これで自動デプロイが開始されます。