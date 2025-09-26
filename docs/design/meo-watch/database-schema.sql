-- MEO Watch データベーススキーマ設計
-- Database: PostgreSQL 15+ (Supabase)
-- 作成日: 2025-09-26

-- ==============================
-- 拡張機能の有効化
-- ==============================

-- UUID生成用
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 日時関連
CREATE EXTENSION IF NOT EXISTS "timescaledb";

-- ==============================
-- カスタム型定義
-- ==============================

-- 料金プラン
CREATE TYPE subscription_plan AS ENUM ('starter', 'business', 'professional');

-- サブスクリプションステータス
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'incomplete', 'trialing');

-- 通知機能は MVP では除外

-- ==============================
-- ユーザー関連テーブル
-- ==============================

-- ユーザープロフィール拡張テーブル（Supabase Authと連携）
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    business_name VARCHAR(255),
    business_address TEXT,
    business_phone VARCHAR(50),
    timezone VARCHAR(50) DEFAULT 'Asia/Tokyo',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) 有効化
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS ポリシー: ユーザーは自分のデータのみアクセス可能
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- ==============================
-- サブスクリプション関連テーブル
-- ==============================

-- サブスクリプション情報
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    plan subscription_plan NOT NULL DEFAULT 'starter',
    status subscription_status NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- インデックス
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ==============================
-- キーワード監視関連テーブル
-- ==============================

-- キーワード管理
CREATE TABLE keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    target_location VARCHAR(255) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_place_id VARCHAR(255), -- Google Places API ID
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own keywords" ON keywords
    FOR ALL USING (auth.uid() = user_id);

-- インデックス
CREATE INDEX idx_keywords_user_id ON keywords(user_id);
CREATE INDEX idx_keywords_active ON keywords(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_keywords_business_place_id ON keywords(business_place_id);

-- 複合インデックス（検索最適化）
CREATE INDEX idx_keywords_user_keyword_location ON keywords(user_id, keyword, target_location);

-- ==============================
-- 順位データテーブル（TimescaleDB対応）
-- ==============================

-- 順位履歴データ
CREATE TABLE ranking_data (
    id UUID DEFAULT uuid_generate_v4(),
    keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
    rank_position INTEGER, -- NULL の場合は圏外（20位以下）
    search_date TIMESTAMPTZ NOT NULL,
    total_results INTEGER DEFAULT 0,
    search_location VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    PRIMARY KEY (id, search_date)
);

-- TimescaleDB ハイパーテーブル化（時系列データ最適化）
SELECT create_hypertable('ranking_data', 'search_date', if_not_exists => TRUE);

ALTER TABLE ranking_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ranking data" ON ranking_data
    FOR SELECT USING (
        auth.uid() IN (
            SELECT k.user_id FROM keywords k WHERE k.id = ranking_data.keyword_id
        )
    );

-- インデックス（時系列データ最適化）
CREATE INDEX idx_ranking_data_keyword_date ON ranking_data(keyword_id, search_date DESC);
CREATE INDEX idx_ranking_data_rank_position ON ranking_data(rank_position) WHERE rank_position IS NOT NULL;

-- ==============================
-- 競合分析関連テーブル
-- ==============================

-- 競合店舗情報
CREATE TABLE competitor_businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
    ranking_data_id UUID, -- 関連する順位データ
    business_name VARCHAR(255) NOT NULL,
    place_id VARCHAR(255) NOT NULL,
    rank_position INTEGER NOT NULL,
    rating DECIMAL(2,1),
    review_count INTEGER DEFAULT 0,
    business_type VARCHAR(100),
    address TEXT,
    phone VARCHAR(50),
    website TEXT,
    search_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    FOREIGN KEY (ranking_data_id, search_date) REFERENCES ranking_data(id, search_date)
);

-- TimescaleDB ハイパーテーブル化
SELECT create_hypertable('competitor_businesses', 'search_date', if_not_exists => TRUE);

ALTER TABLE competitor_businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own competitor data" ON competitor_businesses
    FOR SELECT USING (
        auth.uid() IN (
            SELECT k.user_id FROM keywords k WHERE k.id = competitor_businesses.keyword_id
        )
    );

-- インデックス
CREATE INDEX idx_competitor_businesses_keyword_date ON competitor_businesses(keyword_id, search_date DESC);
CREATE INDEX idx_competitor_businesses_place_id ON competitor_businesses(place_id);
CREATE INDEX idx_competitor_businesses_rank ON competitor_businesses(rank_position);

-- ==============================
-- 通知機能テーブル (MVP では除外)
-- ==============================

-- アラート・通知機能は Phase 2 で実装予定

-- ==============================
-- データエクスポート関連テーブル
-- ==============================

-- エクスポート履歴
CREATE TABLE export_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    export_type VARCHAR(20) NOT NULL, -- 'csv', 'xlsx', 'json'
    file_path TEXT,
    file_size INTEGER,
    keyword_ids UUID[], -- エクスポート対象キーワード
    date_range TSRANGE, -- 期間指定
    include_competitors BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'processing', -- 'processing', 'completed', 'failed'
    download_url TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE export_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own export logs" ON export_logs
    FOR SELECT USING (auth.uid() = user_id);

-- インデックス
CREATE INDEX idx_export_logs_user_id ON export_logs(user_id);
CREATE INDEX idx_export_logs_created_at ON export_logs(created_at DESC);
CREATE INDEX idx_export_logs_expires_at ON export_logs(expires_at) WHERE expires_at IS NOT NULL;

-- ==============================
-- システム管理関連テーブル
-- ==============================

-- API使用量記録
CREATE TABLE api_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER,
    response_time INTEGER, -- ミリ秒
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TimescaleDB ハイパーテーブル化
SELECT create_hypertable('api_usage_logs', 'created_at', if_not_exists => TRUE);

-- インデックス
CREATE INDEX idx_api_usage_logs_user_id ON api_usage_logs(user_id, created_at DESC);
CREATE INDEX idx_api_usage_logs_endpoint ON api_usage_logs(endpoint);

-- システム設定
CREATE TABLE system_settings (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 初期設定値
INSERT INTO system_settings (key, value, description) VALUES
    ('google_maps_api_daily_limit', '10000', 'Google Maps API 1日あたりの利用制限'),
    ('ranking_check_schedule', '"0 9 * * *"', 'CRON形式での順位チェックスケジュール'),
    ('max_export_file_size', '52428800', 'エクスポートファイルの最大サイズ (50MB)'),
    ('data_retention_days', '365', 'データ保持期間（日数）');

-- ==============================
-- バックグラウンドジョブ関連テーブル
-- ==============================

-- ジョブキュー
CREATE TABLE job_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    priority INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    attempts INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_job_queue_status ON job_queue(status, scheduled_for);
CREATE INDEX idx_job_queue_job_type ON job_queue(job_type);
CREATE INDEX idx_job_queue_priority ON job_queue(priority DESC, created_at);

-- ==============================
-- トリガー関数（自動更新）
-- ==============================

-- updated_at 自動更新関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 各テーブルにトリガーを設定
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_keywords_updated_at BEFORE UPDATE ON keywords
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- alert_rules テーブルは MVP では除外

-- ==============================
-- ビュー定義（よく使用するクエリの最適化）
-- ==============================

-- ユーザーのサブスクリプション情報付きプロフィールビュー
CREATE VIEW user_profiles_with_subscription AS
SELECT
    up.*,
    s.plan,
    s.status as subscription_status,
    s.current_period_end,
    CASE
        WHEN s.plan = 'starter' THEN 3
        WHEN s.plan = 'business' THEN 10
        WHEN s.plan = 'professional' THEN 50
        ELSE 0
    END as max_keywords,
    CASE
        WHEN s.plan IN ('business', 'professional') THEN TRUE
        ELSE FALSE
    END as has_competitor_analysis
FROM user_profiles up
LEFT JOIN subscriptions s ON up.id = s.user_id
WHERE s.status = 'active' OR s.status IS NULL;

-- キーワード別最新順位ビュー
CREATE VIEW keywords_with_latest_rank AS
SELECT
    k.*,
    rd.rank_position as current_rank,
    rd.search_date as last_checked_at,
    LAG(rd.rank_position) OVER (PARTITION BY k.id ORDER BY rd.search_date DESC) as previous_rank
FROM keywords k
LEFT JOIN LATERAL (
    SELECT rank_position, search_date
    FROM ranking_data rd
    WHERE rd.keyword_id = k.id
    ORDER BY search_date DESC
    LIMIT 2
) rd ON TRUE;

-- ==============================
-- データ保持ポリシー（TimescaleDB）
-- ==============================

-- 古い順位データの自動削除（1年後）
SELECT add_retention_policy('ranking_data', INTERVAL '365 days');

-- 古い競合データの自動削除（1年後）
SELECT add_retention_policy('competitor_businesses', INTERVAL '365 days');

-- 古いAPIログの自動削除（3ヶ月後）
SELECT add_retention_policy('api_usage_logs', INTERVAL '90 days');

-- ==============================
-- 初期データ投入
-- ==============================

-- 開発環境用テストデータ（本番では削除）
-- INSERT INTO user_profiles (id, email, name) VALUES
--     ('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', 'テストユーザー');

-- ==============================
-- パフォーマンス最適化設定
-- ==============================

-- 統計情報の自動更新
ALTER TABLE ranking_data SET (timescaledb.compress_after = '7 days');
ALTER TABLE competitor_businesses SET (timescaledb.compress_after = '7 days');

-- 圧縮設定（時系列データの容量最適化）
SELECT add_compression_policy('ranking_data', INTERVAL '30 days');
SELECT add_compression_policy('competitor_businesses', INTERVAL '30 days');

-- ==============================
-- セキュリティ設定
-- ==============================

-- RLS の強制有効化
ALTER DATABASE postgres SET row_security = on;

-- 本番環境でのスーパーユーザーアクセス制限
-- REVOKE ALL ON SCHEMA public FROM public;
-- GRANT USAGE ON SCHEMA public TO authenticated;

COMMENT ON DATABASE postgres IS 'MEO Watch - Google Maps順位監視SaaS';
COMMENT ON SCHEMA public IS 'メインアプリケーションスキーマ';
COMMENT ON TABLE user_profiles IS 'ユーザープロフィール情報';
COMMENT ON TABLE subscriptions IS 'サブスクリプション・課金情報';
COMMENT ON TABLE keywords IS '監視対象キーワード';
COMMENT ON TABLE ranking_data IS '順位履歴データ（時系列）';
COMMENT ON TABLE competitor_businesses IS '競合店舗情報（時系列）';
COMMENT ON TABLE alert_rules IS 'アラート設定';
COMMENT ON TABLE alert_notifications IS '通知履歴';
COMMENT ON TABLE export_logs IS 'データエクスポート履歴';