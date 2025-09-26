# MEO Watch データフロー図

## システム全体のデータフロー

```mermaid
flowchart TD
    A[ユーザー] -->|認証/操作| B[Next.js Frontend]
    B -->|API Request| C[Next.js API Routes]
    C -->|認証確認| D[Supabase Auth]
    C -->|データ操作| E[Supabase Database]
    C -->|順位取得| F[Google Maps API]
    C -->|決済処理| G[Stripe API]

    H[Vercel Cron Jobs] -->|定期実行| C
    C -->|メール送信| I[Email Service]
    C -->|通知| J[Push Notifications]

    K[Redis Cache] -->|セッション/制限| C
    C -->|キャッシュ| K

    L[Sentry] -->|エラー監視| C
    M[Vercel Analytics] -->|メトリクス| B
```

## ユーザー認証フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant F as Frontend
    participant API as API Routes
    participant SA as Supabase Auth
    participant DB as Database

    U->>F: ログイン要求
    F->>API: POST /auth/login
    API->>SA: 認証処理
    SA-->>API: JWT Token
    API->>DB: ユーザー情報取得
    DB-->>API: ユーザーデータ
    API-->>F: 認証成功 + ユーザー情報
    F-->>U: ダッシュボード表示
```

## キーワード管理フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant F as Frontend
    participant API as API Routes
    participant DB as Database
    participant R as Redis Cache

    U->>F: キーワード追加
    F->>API: POST /keywords
    API->>R: レート制限チェック
    R-->>API: 制限OK
    API->>DB: プラン制限チェック
    DB-->>API: 制限内
    API->>DB: キーワード保存
    DB-->>API: 保存完了
    API-->>F: 追加成功
    F-->>U: 成功メッセージ
```

## 順位監視自動実行フロー

```mermaid
sequenceDiagram
    participant C as Vercel Cron
    participant API as API Routes
    participant DB as Database
    participant G as Google Maps API
    participant E as Email Service

    C->>API: 日次順位チェック開始
    API->>DB: 監視対象キーワード取得
    DB-->>API: キーワードリスト

    loop 各キーワード
        API->>G: 検索実行
        G-->>API: 検索結果
        API->>DB: 順位データ保存

        alt 順位変動検出
            API->>DB: 前日データと比較
            API->>E: アラートメール送信
        end
    end

    API-->>C: 処理完了
```

## 競合分析データ取得フロー

```mermaid
flowchart TD
    A[順位チェック実行] --> B{Business+プラン?}
    B -->|Yes| C[競合店舗情報取得]
    B -->|No| D[基本順位のみ保存]

    C --> E[Google Maps API Call]
    E --> F[競合店舗データ解析]
    F --> G[店舗情報保存]
    G --> H[順位比較計算]
    H --> I[競合分析データ保存]

    D --> J[処理完了]
    I --> J
```

## 決済処理フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant F as Frontend
    participant API as API Routes
    participant S as Stripe
    participant DB as Database

    U->>F: プラン変更要求
    F->>API: POST /subscriptions
    API->>S: 決済セッション作成
    S-->>API: セッションURL
    API-->>F: リダイレクトURL
    F->>S: 決済画面表示

    U->>S: 決済情報入力
    S->>API: Webhook: 決済完了
    API->>DB: プラン情報更新
    API->>DB: 制限値更新
    API-->>S: 処理完了

    S-->>F: 決済完了ページ
    F-->>U: 成功メッセージ
```

## データエクスポートフロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant F as Frontend
    participant API as API Routes
    participant DB as Database
    participant S as Supabase Storage

    U->>F: CSVエクスポート要求
    F->>API: POST /export/csv
    API->>DB: プラン確認 (Business+)
    DB-->>API: 権限OK
    API->>DB: 順位データ取得
    DB-->>API: 履歴データ
    API->>API: CSV形式変換
    API->>S: 一時ファイル保存
    S-->>API: ダウンロードURL
    API-->>F: ダウンロードリンク
    F-->>U: ファイルダウンロード
```

## リアルタイム通知フロー

```mermaid
sequenceDiagram
    participant C as Cron Job
    participant API as API Routes
    participant DB as Database
    participant RT as Supabase Realtime
    participant F as Frontend

    C->>API: 順位変動検出
    API->>DB: 通知データ保存
    DB->>RT: リアルタイム更新
    RT-->>F: WebSocket通知
    F->>F: 画面更新
```

## エラーハンドリングフロー

```mermaid
flowchart TD
    A[API Request] --> B{エラー発生?}
    B -->|No| C[正常処理]
    B -->|Yes| D{エラータイプ}

    D -->|認証エラー| E[401 Unauthorized]
    D -->|権限エラー| F[403 Forbidden]
    D -->|データエラー| G[400 Bad Request]
    D -->|外部APIエラー| H[502 Bad Gateway]
    D -->|システムエラー| I[500 Internal Error]

    E --> J[Sentryログ記録]
    F --> J
    G --> J
    H --> J
    I --> J

    J --> K[エラーレスポンス]
    C --> L[成功レスポンス]
```

## キャッシュ戦略フロー

```mermaid
flowchart TD
    A[API Request] --> B{キャッシュ確認}
    B -->|Hit| C[キャッシュデータ返却]
    B -->|Miss| D[データベースアクセス]
    D --> E[データ処理]
    E --> F[キャッシュ保存]
    F --> G[レスポンス返却]

    H[データ更新] --> I[キャッシュ無効化]
    I --> J[新データでキャッシュ更新]
```

## データ保持・クリーンアップフロー

```mermaid
sequenceDiagram
    participant C as Vercel Cron (月次)
    participant API as API Routes
    participant DB as Database
    participant S as Supabase Storage

    C->>API: データクリーンアップ開始
    API->>DB: 1年超過データ検索
    DB-->>API: 古いデータリスト

    API->>S: アーカイブファイル作成
    S-->>API: アーカイブ完了

    API->>DB: 古いデータ削除
    DB-->>API: 削除完了

    API-->>C: クリーンアップ完了
```

## 主要なデータフローの特徴

### パフォーマンス最適化
- Redis キャッシュによる高速レスポンス
- Supabase Realtime による効率的な更新通知
- 非同期バックグラウンド処理による応答性向上

### スケーラビリティ
- Vercel Edge Runtime による地理的分散処理
- データベース接続プールによる効率的なリソース利用
- 段階的なデータアーカイブによるパフォーマンス維持

### 信頼性
- 多層エラーハンドリング
- 自動リトライ機能
- 包括的なログとモニタリング