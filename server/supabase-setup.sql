-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
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
CREATE TABLE IF NOT EXISTS public.diary_entries (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_diary_entries_user_id ON public.diary_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_entries_date ON public.diary_entries(date);
CREATE INDEX IF NOT EXISTS idx_diary_entries_user_date ON public.diary_entries(user_id, date);

-- Enable Row Level Security on tables
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diary_entries_updated_at BEFORE UPDATE ON public.diary_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo user data (optional)
-- INSERT INTO public.users (id, username, email, first_name, last_name, bio, stats) VALUES (
--     'demo-user-id', -- Replace with actual UUID
--     'demo',
--     'demo@example.com',
--     'Demo',
--     'User',
--     'Welcome to my thought nest! 🌱',
--     '{
--         "total_entries": 5,
--         "streak_days": 3,
--         "longest_streak": 7,
--         "average_mood": 4.2,
--         "favorite_tags": ["gratitude", "reflection", "goals"]
--     }'::jsonb
-- ); 