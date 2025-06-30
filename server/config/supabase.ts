import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          first_name: string;
          last_name: string;
          avatar_url?: string;
          bio?: string;
          date_of_birth?: string;
          location?: string;
          website?: string;
          preferences: {
            theme: 'light' | 'dark' | 'system';
            notifications: boolean;
            privacy: 'public' | 'private' | 'friends';
            language: string;
          };
          stats: {
            total_entries: number;
            streak_days: number;
            longest_streak: number;
            average_mood: number;
            favorite_tags: string[];
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          first_name: string;
          last_name: string;
          avatar_url?: string;
          bio?: string;
          date_of_birth?: string;
          location?: string;
          website?: string;
          preferences?: {
            theme: 'light' | 'dark' | 'system';
            notifications: boolean;
            privacy: 'public' | 'private' | 'friends';
            language: string;
          };
          stats?: {
            total_entries: number;
            streak_days: number;
            longest_streak: number;
            average_mood: number;
            favorite_tags: string[];
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          avatar_url?: string;
          bio?: string;
          date_of_birth?: string;
          location?: string;
          website?: string;
          preferences?: {
            theme: 'light' | 'dark' | 'system';
            notifications: boolean;
            privacy: 'public' | 'private' | 'friends';
            language: string;
          };
          stats?: {
            total_entries: number;
            streak_days: number;
            longest_streak: number;
            average_mood: number;
            favorite_tags: string[];
          };
          created_at?: string;
          updated_at?: string;
        };
      };
      diary_entries: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          title: string;
          content: string;
          mood: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          title: string;
          content: string;
          mood: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          title?: string;
          content?: string;
          mood?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
} 