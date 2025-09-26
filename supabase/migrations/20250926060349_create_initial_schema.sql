-- MEO Watch Initial Database Schema
-- Created: 2025-09-26

-- ==============================
-- Extensions
-- ==============================

-- UUID generation (using built-in pgcrypto)
-- Note: Supabase has gen_random_uuid() available by default

-- ==============================
-- Custom Types
-- ==============================

-- Subscription plans
CREATE TYPE subscription_plan AS ENUM ('starter', 'business', 'professional');

-- Subscription status
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'incomplete', 'trialing');

-- ==============================
-- User Related Tables
-- ==============================

-- User profiles (extends Supabase Auth)
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

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ==============================
-- Subscription Related Tables
-- ==============================

-- Subscription information
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- ==============================
-- Keyword Monitoring Tables
-- ==============================

-- Keywords management
CREATE TABLE keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- ==============================
-- Ranking Data Tables
-- ==============================

-- Ranking history data
CREATE TABLE ranking_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
    rank_position INTEGER, -- NULL means out of range (20+ position)
    search_date TIMESTAMPTZ NOT NULL,
    total_results INTEGER DEFAULT 0,
    search_location VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ranking_data ENABLE ROW LEVEL SECURITY;

-- ==============================
-- Competitor Analysis Tables
-- ==============================

-- Competitor business information
CREATE TABLE competitor_businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
    ranking_data_id UUID REFERENCES ranking_data(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    place_id VARCHAR(255) NOT NULL,
    rank_position INTEGER NOT NULL,
    rating DECIMAL(2,1),
    review_count INTEGER DEFAULT 0,
    business_type VARCHAR(100),
    address TEXT,
    phone VARCHAR(50),
    website TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE competitor_businesses ENABLE ROW LEVEL SECURITY;

-- ==============================
-- Data Export Tables
-- ==============================

-- Export history logs
CREATE TABLE export_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    export_type VARCHAR(20) NOT NULL, -- 'csv', 'xlsx', 'json'
    file_path TEXT,
    file_size INTEGER,
    keyword_ids UUID[], -- Target keywords for export
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    include_competitors BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'processing', -- 'processing', 'completed', 'failed'
    download_url TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE export_logs ENABLE ROW LEVEL SECURITY;

-- ==============================
-- API Usage Logs
-- ==============================

CREATE TABLE api_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER,
    response_time INTEGER, -- milliseconds
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================
-- Job Queue
-- ==============================

CREATE TABLE job_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- ==============================
-- System Settings
-- ==============================

CREATE TABLE system_settings (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================
-- Indexes
-- ==============================

-- Subscriptions
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Keywords
CREATE INDEX idx_keywords_user_id ON keywords(user_id);
CREATE INDEX idx_keywords_active ON keywords(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_keywords_business_place_id ON keywords(business_place_id);
CREATE INDEX idx_keywords_user_keyword_location ON keywords(user_id, keyword, target_location);

-- Ranking Data
CREATE INDEX idx_ranking_data_keyword_date ON ranking_data(keyword_id, search_date DESC);
CREATE INDEX idx_ranking_data_rank_position ON ranking_data(rank_position) WHERE rank_position IS NOT NULL;

-- Competitor Businesses
CREATE INDEX idx_competitor_businesses_keyword_id ON competitor_businesses(keyword_id);
CREATE INDEX idx_competitor_businesses_ranking_data_id ON competitor_businesses(ranking_data_id);
CREATE INDEX idx_competitor_businesses_place_id ON competitor_businesses(place_id);
CREATE INDEX idx_competitor_businesses_rank ON competitor_businesses(rank_position);

-- Export Logs
CREATE INDEX idx_export_logs_user_id ON export_logs(user_id);
CREATE INDEX idx_export_logs_created_at ON export_logs(created_at DESC);
CREATE INDEX idx_export_logs_expires_at ON export_logs(expires_at) WHERE expires_at IS NOT NULL;

-- API Usage Logs
CREATE INDEX idx_api_usage_logs_user_id ON api_usage_logs(user_id, created_at DESC);
CREATE INDEX idx_api_usage_logs_endpoint ON api_usage_logs(endpoint);

-- Job Queue
CREATE INDEX idx_job_queue_status ON job_queue(status, scheduled_for);
CREATE INDEX idx_job_queue_job_type ON job_queue(job_type);
CREATE INDEX idx_job_queue_priority ON job_queue(priority DESC, created_at);

-- ==============================
-- Trigger Functions
-- ==============================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_keywords_updated_at BEFORE UPDATE ON keywords
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================
-- Initial Settings
-- ==============================

INSERT INTO system_settings (key, value, description) VALUES
    ('google_maps_api_daily_limit', '10000', 'Google Maps API daily usage limit'),
    ('ranking_check_schedule', '"0 9 * * *"', 'CRON schedule for ranking checks'),
    ('max_export_file_size', '52428800', 'Maximum export file size (50MB)'),
    ('data_retention_days', '365', 'Data retention period in days');