-- Row Level Security Policies for MEO Watch
-- Run this SQL in your Supabase SQL Editor after creating the tables

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranking_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_businesses ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- User profiles table policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Subscriptions table policies
CREATE POLICY "Users can view their own subscription" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON public.subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Keywords table policies
CREATE POLICY "Users can view their own keywords" ON public.keywords
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own keywords" ON public.keywords
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own keywords" ON public.keywords
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own keywords" ON public.keywords
    FOR DELETE USING (auth.uid() = user_id);

-- Ranking data table policies
CREATE POLICY "Users can view ranking data for their keywords" ON public.ranking_data
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.keywords
            WHERE keywords.id = ranking_data.keyword_id
            AND keywords.user_id = auth.uid()
        )
    );

CREATE POLICY "System can insert ranking data" ON public.ranking_data
    FOR INSERT WITH CHECK (true); -- This will be restricted to service role in practice

-- Competitor businesses table policies
CREATE POLICY "Users can view competitor data for their keywords" ON public.competitor_businesses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.keywords
            WHERE keywords.id = competitor_businesses.keyword_id
            AND keywords.user_id = auth.uid()
        )
    );

CREATE POLICY "System can insert competitor data" ON public.competitor_businesses
    FOR INSERT WITH CHECK (true); -- This will be restricted to service role in practice

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_keywords_user_id ON public.keywords(user_id);
CREATE INDEX IF NOT EXISTS idx_ranking_data_keyword_id ON public.ranking_data(keyword_id);
CREATE INDEX IF NOT EXISTS idx_ranking_data_search_date ON public.ranking_data(search_date);
CREATE INDEX IF NOT EXISTS idx_competitor_businesses_keyword_id ON public.competitor_businesses(keyword_id);
CREATE INDEX IF NOT EXISTS idx_competitor_businesses_ranking_data_id ON public.competitor_businesses(ranking_data_id);