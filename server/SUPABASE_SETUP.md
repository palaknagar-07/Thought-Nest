# Supabase Setup Guide for Thought Nest

This guide will help you set up Supabase as your database for the Thought Nest application.

## Prerequisites

- A Supabase account (free at [supabase.com](https://supabase.com))
- Node.js and npm installed
- The Thought Nest project cloned locally

## Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Sign in** with GitHub or email
3. **Create a new project**:
   - Click "New Project"
   - Choose your organization
   - Enter project name: `thought-nest`
   - Enter database password (save this!)
   - Choose region closest to you
   - Click "Create new project"

## Step 2: Get Your Project Credentials

1. **Go to your project dashboard**
2. **Navigate to Settings → API**
3. **Copy the following values**:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. **Open your `.env.local` file** in the project root
2. **Replace the placeholder values** with your actual credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

## Step 4: Set Up Database Tables

1. **Go to your Supabase dashboard**
2. **Navigate to SQL Editor**
3. **Create a new query**
4. **Copy and paste the entire contents** of `supabase-setup.sql`
5. **Click "Run"** to execute the SQL

This will create:
- `users` table for user profiles
- `diary_entries` table for diary entries
- Row Level Security (RLS) policies
- Indexes for better performance
- Triggers for automatic timestamp updates

## Step 5: Configure Authentication

1. **Go to Authentication → Settings**
2. **Configure your site URL**:
   - Add `http://localhost:5173` for development
   - Add your production URL when deploying
3. **Optional: Configure email templates** under "Email Templates"

## Step 6: Test the Setup

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Open your app** at `http://localhost:5173`

3. **Try to register a new account** - this will test:
   - User registration
   - Database connection
   - Profile creation

## Step 7: Verify Database

1. **Go to your Supabase dashboard**
2. **Navigate to Table Editor**
3. **Check that tables were created**:
   - `users` table
   - `diary_entries` table

## Troubleshooting

### Common Issues

**"Missing Supabase environment variables"**
- Make sure your `.env.local` file exists and has the correct values
- Restart your development server after changing environment variables

**"User not found" or authentication errors**
- Check that your Supabase URL and key are correct
- Verify that the SQL setup script ran successfully
- Check the browser console for detailed error messages

**"Permission denied" errors**
- Ensure Row Level Security (RLS) policies are properly set up
- Check that the SQL setup script completed without errors

### Database Schema

The application uses two main tables:

**users table:**
- `id` - UUID (references auth.users)
- `username` - Unique username
- `email` - User's email
- `first_name`, `last_name` - User's name
- `avatar_url`, `bio`, `date_of_birth`, `location`, `website` - Profile info
- `preferences` - JSON object with user preferences
- `stats` - JSON object with user statistics
- `created_at`, `updated_at` - Timestamps

**diary_entries table:**
- `id` - UUID primary key
- `user_id` - References users.id
- `date` - Entry date
- `title`, `content` - Entry content
- `mood` - User's mood rating
- `tags` - Array of tags
- `created_at`, `updated_at` - Timestamps

## Security Features

The setup includes:
- **Row Level Security (RLS)** - Users can only access their own data
- **Automatic timestamps** - Updated automatically on changes
- **Foreign key constraints** - Ensures data integrity
- **Indexes** - Optimized for common queries

## Next Steps

Once setup is complete:
1. **Test all features** - Create entries, update profile, etc.
2. **Deploy to production** - Update environment variables for your production domain
3. **Monitor usage** - Check Supabase dashboard for usage statistics
4. **Backup data** - Set up regular backups in Supabase dashboard

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Supabase project settings
3. Check the Supabase documentation at [supabase.com/docs](https://supabase.com/docs)
4. Review the SQL setup script for any syntax errors 