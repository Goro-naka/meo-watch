-- Row Level Security Policies for MEO Watch

-- User profiles table policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

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

-- Export logs table policies
CREATE POLICY "Users can view their own export logs" ON public.export_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own export logs" ON public.export_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- API usage logs table policies (admin only - no policies for regular users)

-- Job queue policies (system only - no policies for regular users)

-- System settings policies (admin only - no policies for regular users)