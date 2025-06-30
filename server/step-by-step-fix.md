# Step-by-Step Database Fix

Since you're getting permission errors with SQL, let's use the Supabase dashboard interface to fix this:

## Step 1: Check Current Tables

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Go to **Table Editor** in the left sidebar
4. Check if you see `users` and `diary_entries` tables

## Step 2: Delete Existing Tables (if they exist)

1. In **Table Editor**, if you see `users` table:
   - Click on the `users` table
   - Click the **Settings** tab (gear icon)
   - Scroll down and click **Delete table**
   - Confirm the deletion

2. If you see `diary_entries` table:
   - Click on the `diary_entries` table
   - Click the **Settings** tab (gear icon)
   - Scroll down and click **Delete table**
   - Confirm the deletion

## Step 3: Create Tables Using Dashboard

### Create Users Table:

1. Click **New table**
2. Table name: `users`
3. Enable Row Level Security (RLS): **Yes**
4. Add columns:
   - `id` (type: `uuid`, Primary Key, Default: `gen_random_uuid()`)
   - `username` (type: `text`, Unique: Yes, Not Null: Yes)
   - `email` (type: `text`, Unique: Yes, Not Null: Yes)
   - `first_name` (type: `text`, Not Null: Yes)
   - `last_name` (type: `text`, Not Null: Yes)
   - `avatar_url` (type: `text`)
   - `bio` (type: `text`)
   - `date_of_birth` (type: `date`)
   - `location` (type: `text`)
   - `website` (type: `text`)
   - `preferences` (type: `jsonb`, Default: `{"theme": "system", "notifications": true, "privacy": "private", "language": "en"}`)
   - `stats` (type: `jsonb`, Default: `{"total_entries": 0, "streak_days": 0, "longest_streak": 0, "average_mood": 0, "favorite_tags": []}`)
   - `created_at` (type: `timestamptz`, Default: `now()`)
   - `updated_at` (type: `timestamptz`, Default: `now()`)
5. Click **Save**

### Create Diary Entries Table:

1. Click **New table**
2. Table name: `diary_entries`
3. Enable Row Level Security (RLS): **Yes**
4. Add columns:
   - `id` (type: `uuid`, Primary Key, Default: `gen_random_uuid()`)
   - `user_id` (type: `uuid`, Foreign Key: `users.id`, Not Null: Yes)
   - `date` (type: `date`, Not Null: Yes)
   - `title` (type: `text`, Not Null: Yes)
   - `content` (type: `text`, Not Null: Yes)
   - `mood` (type: `text`, Not Null: Yes)
   - `tags` (type: `text[]`, Default: `{}`)
   - `created_at` (type: `timestamptz`, Default: `now()`)
   - `updated_at` (type: `timestamptz`, Default: `now()`)
5. Click **Save**

## Step 4: Set Up Row Level Security Policies

### For Users Table:

1. Go to **Authentication** → **Policies**
2. Find the `users` table
3. Click **New Policy**
4. Policy name: `Users can view own profile`
5. Target roles: `authenticated`
6. Using expression: `auth.uid() = id`
7. Click **Save**

4. Click **New Policy** again
5. Policy name: `Users can update own profile`
6. Target roles: `authenticated`
7. Using expression: `auth.uid() = id`
8. Click **Save**

4. Click **New Policy** again
5. Policy name: `Users can insert own profile`
6. Target roles: `authenticated`
7. Using expression: `auth.uid() = id`
8. Click **Save**

### For Diary Entries Table:

1. Find the `diary_entries` table
2. Click **New Policy**
3. Policy name: `Users can view own entries`
4. Target roles: `authenticated`
5. Using expression: `auth.uid() = user_id`
6. Click **Save**

7. Click **New Policy** again
8. Policy name: `Users can insert own entries`
9. Target roles: `authenticated`
10. Using expression: `auth.uid() = user_id`
11. Click **Save**

12. Click **New Policy** again
13. Policy name: `Users can update own entries`
14. Target roles: `authenticated`
15. Using expression: `auth.uid() = user_id`
16. Click **Save**

17. Click **New Policy** again
18. Policy name: `Users can delete own entries`
19. Target roles: `authenticated`
20. Using expression: `auth.uid() = user_id`
21. Click **Save**

## Step 5: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Add your site URL: `http://localhost:5173`
3. Save settings

## Step 6: Test the Setup

After completing the above steps, try signing in again in your app. The permission issues should be resolved. 