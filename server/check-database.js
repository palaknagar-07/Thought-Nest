import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log('🔍 Checking database connection...');
  
  try {
    // Test connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:', error.message);
      console.log('📋 Please run the SQL setup script in your Supabase dashboard');
      console.log('📁 Check server/supabase-setup.sql for the setup commands');
      return;
    }
    
    console.log('✅ Database connection successful!');
    
    // Check if tables exist
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (usersError) {
      console.log('❌ Users table not found:', usersError.message);
      console.log('📋 Please run the SQL setup script in your Supabase dashboard');
    } else {
      console.log('✅ Users table exists');
    }
    
    const { data: entries, error: entriesError } = await supabase
      .from('diary_entries')
      .select('id')
      .limit(1);
    
    if (entriesError) {
      console.log('❌ Diary entries table not found:', entriesError.message);
      console.log('📋 Please run the SQL setup script in your Supabase dashboard');
    } else {
      console.log('✅ Diary entries table exists');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkDatabase(); 