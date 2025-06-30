-- Alternative approach to fix database permission issues
-- This script handles the case where tables exist but have wrong permissions

-- First, let's check what tables exist and their ownership
-- Run this in Supabase SQL Editor to see the current state:
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'diary_entries');

-- If the above shows tables exist with wrong ownership, we need to:
-- 1. Drop them completely
-- 2. Recreate them with proper ownership

-- Drop everything and start fresh
DO $$ 
BEGIN
    -- Drop tables if they exist
    DROP TABLE IF EXISTS public.diary_entries CASCADE;
    DROP TABLE IF EXISTS public.users CASCADE;
    
    -- Drop functions if they exist
    DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
    
    -- Drop policies if they exist
    DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
    DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
    DROP POLICY IF EXISTS "Users can view own entries" ON public.diary_entries;
    DROP POLICY IF EXISTS "Users can insert own entries" ON public.diary_entries;
    DROP POLICY IF EXISTS "Users can update own entries" ON public.diary_entries;
    DROP POLICY IF EXISTS "Users can delete own entries" ON public.diary_entries;
    
    RAISE NOTICE 'Dropped existing tables and functions';
END $$;

-- Enable Row Level Security on auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table with proper ownership
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    date_of_birth DATE,
    location TEXT,
    website TEXT,
    preferences JSONB DEFAULT '{
        "theme": "system",
        "notifications": true,
        "privacy": "private",
        "language": "en"
    }'::jsonb,
    stats JSONB DEFAULT '{
        "total_entries": 0,
        "streak_days": 0,
        "longest_streak": 0,
        "average_mood": 0,
        "favorite_tags": []
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create diary_entries table
CREATE TABLE public.diary_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    mood TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_diary_entries_user_id ON public.diary_entries(user_id);
CREATE INDEX idx_diary_entries_date ON public.diary_entries(date);
CREATE INDEX idx_diary_entries_user_date ON public.diary_entries(user_id, date);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for diary_entries table
CREATE POLICY "Users can view own entries" ON public.diary_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries" ON public.diary_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries" ON public.diary_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries" ON public.diary_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diary_entries_updated_at 
    BEFORE UPDATE ON public.diary_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.diary_entries TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Verify the setup
SELECT 'Tables created successfully' as status; 