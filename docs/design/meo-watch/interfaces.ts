// MEO Watch TypeScript インターフェース定義

// ==============================
// 基本型定義
// ==============================

export type UUID = string;
export type ISODateString = string;
export type EmailAddress = string;

// ==============================
// エンティティ型定義
// ==============================

// ユーザー関連
export interface User {
  id: UUID;
  email: EmailAddress;
  name: string;
  avatar_url?: string;
  subscription_plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  stripe_customer_id?: string;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface UserProfile {
  id: UUID;
  user_id: UUID;
  business_name?: string;
  business_address?: string;
  business_phone?: string;
  timezone: string;
  created_at: ISODateString;
  updated_at: ISODateString;
}

// 料金プラン関連
export type SubscriptionPlan = "starter" | "business" | "professional";
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "incomplete"
  | "trialing";

export interface SubscriptionLimits {
  max_keywords: number;
  has_competitor_analysis: boolean;
  has_csv_export: boolean;
  has_api_access: boolean;
  has_priority_support: boolean;
}

export interface Subscription {
  id: UUID;
  user_id: UUID;
  stripe_subscription_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_start: ISODateString;
  current_period_end: ISODateString;
  cancel_at_period_end: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
}

// キーワード関連
export interface Keyword {
  id: UUID;
  user_id: UUID;
  keyword: string;
  target_location: string;
  business_name: string;
  business_place_id?: string;
  is_active: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
}

// 順位データ関連
export interface RankingData {
  id: UUID;
  keyword_id: UUID;
  rank_position?: number; // null の場合は圏外
  search_date: ISODateString;
  total_results: number;
  search_location: string;
  created_at: ISODateString;
}

// 競合店舗関連
export interface CompetitorBusiness {
  id: UUID;
  keyword_id: UUID;
  ranking_data_id: UUID;
  business_name: string;
  place_id: string;
  rank_position: number;
  rating?: number;
  review_count?: number;
  business_type?: string;
  address?: string;
  phone?: string;
  website?: string;
  created_at: ISODateString;
}

// 通知関連 (MVP では除外 - Phase 2 で実装予定)
// export interface AlertRule { ... }
// export type AlertType = 'rank_up' | 'rank_down' | 'rank_change' | 'competitor_change';
// export type NotificationChannel = 'email' | 'slack' | 'discord' | 'webhook';
// export interface AlertNotification { ... }

// ==============================
// API リクエスト/レスポンス型
// ==============================

// 共通APIレスポンス
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
  };
}

// 認証関連
export interface LoginRequest {
  email: EmailAddress;
  password: string;
}

export interface SignupRequest {
  email: EmailAddress;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

// キーワード管理
export interface CreateKeywordRequest {
  keyword: string;
  target_location: string;
  business_name: string;
  business_place_id?: string;
}

export interface UpdateKeywordRequest {
  keyword?: string;
  target_location?: string;
  business_name?: string;
  is_active?: boolean;
}

export interface KeywordListResponse {
  keywords: (Keyword & {
    latest_ranking?: RankingData;
    rank_change?: number;
  })[];
}

// 順位データ
export interface RankingHistoryRequest {
  keyword_id: UUID;
  start_date?: string;
  end_date?: string;
  limit?: number;
}

export interface RankingHistoryResponse {
  rankings: RankingData[];
  keyword: Keyword;
  summary: {
    current_rank?: number;
    previous_rank?: number;
    best_rank?: number;
    worst_rank?: number;
    average_rank?: number;
  };
}

// 競合分析
export interface CompetitorAnalysisRequest {
  keyword_id: UUID;
  date_range?: {
    start_date: string;
    end_date: string;
  };
}

export interface CompetitorAnalysisResponse {
  competitors: (CompetitorBusiness & {
    rank_history?: { date: string; rank: number }[];
    rank_trend?: "up" | "down" | "stable";
  })[];
  market_insights: {
    total_businesses: number;
    average_rating: number;
    category_breakdown: Record<string, number>;
  };
}

// データエクスポート
export interface ExportRequest {
  format: "csv" | "xlsx" | "json";
  keyword_ids?: UUID[];
  start_date?: string;
  end_date?: string;
  include_competitors?: boolean;
}

export interface ExportResponse {
  download_url: string;
  expires_at: ISODateString;
  file_size: number;
}

// 料金プラン
export interface SubscriptionUpdateRequest {
  plan: SubscriptionPlan;
  billing_interval?: "monthly" | "yearly";
}

export interface PaymentMethodRequest {
  payment_method_id: string;
}

// ダッシュボード
export interface DashboardStatsResponse {
  total_keywords: number;
  active_keywords: number;
  average_rank: number;
  rank_changes_today: {
    improved: number;
    declined: number;
    unchanged: number;
  };
  // recent_alerts は Phase 2 で実装予定
  top_performing_keywords: (Keyword & { current_rank?: number })[];
  subscription_info: {
    plan: SubscriptionPlan;
    usage: {
      keywords_used: number;
      keywords_limit: number;
    };
    billing_period_end: ISODateString;
  };
}

// ==============================
// フロントエンド専用型
// ==============================

// UI状態管理
export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}

export interface ErrorState {
  hasError: boolean;
  errorMessage?: string;
  errorCode?: string;
}

// フォーム
export interface KeywordFormData {
  keyword: string;
  targetLocation: string;
  businessName: string;
  businessPlaceId?: string;
}

export interface UserProfileFormData {
  name: string;
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  timezone: string;
}

// チャートデータ
export interface ChartDataPoint {
  date: string;
  rank: number | null;
  label?: string;
}

export interface CompetitorChartData {
  businessName: string;
  data: ChartDataPoint[];
  color: string;
}

// テーブル表示用
export interface KeywordTableRow {
  id: UUID;
  keyword: string;
  targetLocation: string;
  businessName: string;
  currentRank?: number;
  previousRank?: number;
  rankChange?: number;
  lastUpdated: ISODateString;
  isActive: boolean;
}

// ==============================
// 定数
// ==============================

export const SUBSCRIPTION_LIMITS: Record<SubscriptionPlan, SubscriptionLimits> =
  {
    starter: {
      max_keywords: 3,
      has_competitor_analysis: false,
      has_csv_export: false,
      has_api_access: false,
      has_priority_support: false,
    },
    business: {
      max_keywords: 10,
      has_competitor_analysis: true,
      has_csv_export: true,
      has_api_access: false,
      has_priority_support: false,
    },
    professional: {
      max_keywords: 50,
      has_competitor_analysis: true,
      has_csv_export: true,
      has_api_access: true,
      has_priority_support: true,
    },
  };

export const SUBSCRIPTION_PRICES = {
  starter: 1980,
  business: 3980,
  professional: 7980,
} as const;

// ==============================
// Utility Types
// ==============================

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Database insert/update types
export type UserInsert = Omit<User, "id" | "created_at" | "updated_at">;
export type UserUpdate = Partial<
  Omit<User, "id" | "created_at" | "updated_at">
>;

export type KeywordInsert = Omit<Keyword, "id" | "created_at" | "updated_at">;
export type KeywordUpdate = Partial<
  Omit<Keyword, "id" | "user_id" | "created_at" | "updated_at">
>;

export type RankingDataInsert = Omit<RankingData, "id" | "created_at">;
export type CompetitorBusinessInsert = Omit<
  CompetitorBusiness,
  "id" | "created_at"
>;

// ==============================
// Type Guards
// ==============================

export function isValidSubscriptionPlan(
  plan: string
): plan is SubscriptionPlan {
  return ["starter", "business", "professional"].includes(plan);
}

// アラート関連の Type Guards は Phase 2 で実装予定
// export function isValidAlertType(type: string): type is AlertType { ... }
// export function isValidNotificationChannel(channel: string): channel is NotificationChannel { ... }
