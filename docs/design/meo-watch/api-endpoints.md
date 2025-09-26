# MEO Watch API エンドポイント仕様

## 概要

MEO Watch は Next.js 15 の API Routes を使用したRESTful APIを提供します。全てのエンドポイントは `/api/` プレフィックスを持ち、Supabase Auth によるJWT認証を使用します。

## 認証

### ベースURL
```
https://meo-watch.vercel.app/api
```

### 認証方式
- **Bearer Token**: JWTトークンを `Authorization: Bearer <token>` ヘッダーで送信
- **Cookie**: httpOnly Cookie による自動認証（ブラウザ）

## 共通レスポンス形式

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
  };
}
```

## エラーコード

| コード | 説明 |
|--------|------|
| 400 | Bad Request - 無効なリクエストパラメータ |
| 401 | Unauthorized - 認証が必要 |
| 403 | Forbidden - 権限不足 |
| 404 | Not Found - リソースが見つからない |
| 429 | Too Many Requests - レート制限超過 |
| 500 | Internal Server Error - サーバーエラー |

---

## 認証関連エンドポイント

### POST /api/auth/signup
新規ユーザー登録

**リクエスト:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "田中太郎"
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "田中太郎",
      "subscription_plan": "starter",
      "created_at": "2025-09-26T10:00:00Z"
    },
    "session": {
      "access_token": "jwt-token-here",
      "refresh_token": "refresh-token-here",
      "expires_at": 1640995200
    }
  }
}
```

### POST /api/auth/login
ユーザーログイン

**リクエスト:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス:** 同上

### POST /api/auth/logout
ログアウト

**リクエスト:** なし

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "message": "ログアウトしました"
  }
}
```

### POST /api/auth/refresh
トークンリフレッシュ

**リクエスト:**
```json
{
  "refresh_token": "refresh-token-here"
}
```

---

## ユーザープロフィール関連

### GET /api/profile
現在のユーザー情報取得

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "田中太郎",
    "business_name": "田中商店",
    "subscription_plan": "business",
    "subscription_status": "active",
    "created_at": "2025-09-26T10:00:00Z"
  }
}
```

### PUT /api/profile
ユーザー情報更新

**リクエスト:**
```json
{
  "name": "田中次郎",
  "business_name": "田中商事",
  "business_address": "東京都渋谷区...",
  "timezone": "Asia/Tokyo"
}
```

---

## キーワード管理

### GET /api/keywords
キーワード一覧取得

**クエリパラメータ:**
- `page`: ページ番号 (デフォルト: 1)
- `limit`: 1ページあたりの件数 (デフォルト: 20)
- `is_active`: アクティブなキーワードのみ (true/false)

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "keywords": [
      {
        "id": "keyword-uuid",
        "keyword": "渋谷 ラーメン",
        "target_location": "東京都渋谷区",
        "business_name": "田中ラーメン",
        "current_rank": 3,
        "previous_rank": 5,
        "rank_change": 2,
        "last_checked_at": "2025-09-26T09:00:00Z",
        "is_active": true,
        "created_at": "2025-09-20T10:00:00Z"
      }
    ]
  },
  "meta": {
    "total": 8,
    "page": 1,
    "per_page": 20
  }
}
```

### POST /api/keywords
新規キーワード追加

**リクエスト:**
```json
{
  "keyword": "新宿 美容院",
  "target_location": "東京都新宿区",
  "business_name": "ヘアサロンXYZ",
  "business_place_id": "ChIJKxjxuaNyCGAR4g"
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "new-keyword-uuid",
    "keyword": "新宿 美容院",
    "target_location": "東京都新宿区",
    "business_name": "ヘアサロンXYZ",
    "is_active": true,
    "created_at": "2025-09-26T10:00:00Z"
  }
}
```

### PUT /api/keywords/[id]
キーワード更新

**リクエスト:**
```json
{
  "keyword": "新宿 美容室",
  "is_active": false
}
```

### DELETE /api/keywords/[id]
キーワード削除

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "message": "キーワードを削除しました"
  }
}
```

---

## 順位データ関連

### GET /api/keywords/[id]/rankings
特定キーワードの順位履歴

**クエリパラメータ:**
- `start_date`: 開始日 (YYYY-MM-DD)
- `end_date`: 終了日 (YYYY-MM-DD)
- `limit`: 取得件数 (デフォルト: 30)

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "keyword": {
      "id": "keyword-uuid",
      "keyword": "渋谷 ラーメン",
      "business_name": "田中ラーメン"
    },
    "rankings": [
      {
        "rank_position": 3,
        "search_date": "2025-09-26T09:00:00Z",
        "total_results": 1250
      },
      {
        "rank_position": 5,
        "search_date": "2025-09-25T09:00:00Z",
        "total_results": 1240
      }
    ],
    "summary": {
      "current_rank": 3,
      "previous_rank": 5,
      "best_rank": 1,
      "worst_rank": 12,
      "average_rank": 4.5
    }
  }
}
```

### GET /api/rankings/bulk
複数キーワードの最新順位一括取得

**リクエスト (POST body):**
```json
{
  "keyword_ids": ["uuid1", "uuid2", "uuid3"]
}
```

---

## 競合分析関連 (Business+ プランのみ)

### GET /api/keywords/[id]/competitors
競合分析データ取得

**クエリパラメータ:**
- `date_range`: 期間 (7d, 30d, 90d)

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "competitors": [
      {
        "business_name": "競合ラーメン店A",
        "place_id": "ChIJKxjxuaNyCGAR4g",
        "current_rank": 1,
        "rating": 4.5,
        "review_count": 120,
        "rank_history": [
          { "date": "2025-09-26", "rank": 1 },
          { "date": "2025-09-25", "rank": 2 }
        ],
        "rank_trend": "up"
      }
    ],
    "market_insights": {
      "total_businesses": 20,
      "average_rating": 4.2,
      "category_breakdown": {
        "restaurant": 15,
        "cafe": 5
      }
    }
  }
}
```

---

## データエクスポート関連 (Business+ プランのみ)

### POST /api/export
データエクスポート要求

**リクエスト:**
```json
{
  "format": "csv",
  "keyword_ids": ["uuid1", "uuid2"],
  "start_date": "2025-09-01",
  "end_date": "2025-09-26",
  "include_competitors": true
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "export_id": "export-uuid",
    "status": "processing",
    "estimated_completion": "2025-09-26T10:05:00Z"
  }
}
```

### GET /api/export/[id]
エクスポート状況確認

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "export-uuid",
    "status": "completed",
    "download_url": "https://storage.supabase.co/...",
    "expires_at": "2025-09-27T10:00:00Z",
    "file_size": 2048000
  }
}
```

---

## アラート・通知関連 (Phase 2 で実装予定)

**MVP では通知機能を除外し、CSV出力によるデータ取得を重視**

---

## サブスクリプション・決済関連

### GET /api/subscription
現在のサブスクリプション情報

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "plan": "business",
    "status": "active",
    "current_period_end": "2025-10-26T10:00:00Z",
    "cancel_at_period_end": false,
    "usage": {
      "keywords_used": 8,
      "keywords_limit": 10
    }
  }
}
```

### POST /api/subscription/checkout
サブスクリプション変更・決済セッション作成

**リクエスト:**
```json
{
  "plan": "professional",
  "billing_interval": "monthly"
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "checkout_url": "https://checkout.stripe.com/...",
    "session_id": "cs_session_id"
  }
}
```

### POST /api/subscription/cancel
サブスクリプション解約

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "message": "期間終了時に解約予定に設定しました",
    "cancel_at_period_end": true,
    "current_period_end": "2025-10-26T10:00:00Z"
  }
}
```

### POST /api/webhooks/stripe
Stripe Webhook (システム内部用)

---

## ダッシュボード関連

### GET /api/dashboard/stats
ダッシュボード統計情報

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "total_keywords": 8,
    "active_keywords": 7,
    "average_rank": 4.2,
    "rank_changes_today": {
      "improved": 3,
      "declined": 1,
      "unchanged": 4
    },
    // recent_alerts は Phase 2 で実装予定
    "top_performing_keywords": [
      {
        "keyword": "新宿 美容院",
        "current_rank": 1,
        "business_name": "ヘアサロンXYZ"
      }
    ],
    "subscription_info": {
      "plan": "business",
      "usage": {
        "keywords_used": 8,
        "keywords_limit": 10
      },
      "billing_period_end": "2025-10-26T10:00:00Z"
    }
  }
}
```

---

## システム管理関連

### GET /api/health
ヘルスチェック

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-09-26T10:00:00Z",
    "version": "1.0.0"
  }
}
```

### GET /api/system/limits
API制限情報

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "rate_limit": {
      "requests_per_minute": 100,
      "remaining": 95,
      "reset_at": "2025-09-26T10:01:00Z"
    },
    "subscription_limits": {
      "max_keywords": 10,
      "has_competitor_analysis": true,
      "has_csv_export": true
    }
  }
}
```

---

## バックグラウンドジョブ関連 (管理者用)

### POST /api/jobs/ranking-check
手動順位チェック実行

**リクエスト:**
```json
{
  "keyword_ids": ["uuid1", "uuid2"]
}
```

### GET /api/jobs/status/[job_id]
ジョブ実行状況確認

---

## レート制限

| エンドポイントグループ | 制限 |
|----------------------|------|
| 認証関連 | 10回/分 |
| 一般API | 100回/分 |
| エクスポート | 5回/時間 |
| Webhook | 1000回/分 |

## WebSocket (リアルタイム通知)

Supabase Realtime を使用したWebSocket接続:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key)

// 通知のリアルタイム受信
supabase
  .channel('notifications')
  .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'alert_notifications' },
      payload => console.log('New notification:', payload)
  )
  .subscribe()
```

---

## APIクライアント例

### JavaScript/TypeScript
```typescript
class MeoWatchApiClient {
  constructor(private baseUrl: string, private token?: string) {}

  async getKeywords(): Promise<KeywordListResponse> {
    const response = await fetch(`${this.baseUrl}/api/keywords`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }
}
```

### Python
```python
import requests

class MeoWatchAPI:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

    def get_keywords(self):
        response = requests.get(
            f'{self.base_url}/api/keywords',
            headers=self.headers
        )
        return response.json()
```