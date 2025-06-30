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

async function testAuth() {
  console.log('🔍 Testing authentication...');
  
  try {
    // Test 1: Check if we can access auth
    console.log('1. Testing auth access...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Session error:', sessionError.message);
    } else {
      console.log('✅ Auth access successful');
      console.log('   Current session:', session ? 'Active' : 'None');
    }
    
    // Test 2: Check if email confirmation is required
    console.log('\n2. Testing user registration...');
    const testEmail = `testuser${Date.now()}@gmail.com`;
    const testPassword = 'TestPassword123!';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (signUpError) {
      console.log('❌ Sign up error:', signUpError.message);
      console.log('💡 This might be due to email confirmation being required');
    } else {
      console.log('✅ Sign up successful');
      console.log('   User ID:', signUpData.user?.id);
      console.log('   Email confirmed:', signUpData.user?.email_confirmed_at ? 'Yes' : 'No');
      
      if (!signUpData.user?.email_confirmed_at) {
        console.log('⚠️  Email confirmation required - check your Supabase dashboard settings');
        console.log('💡 You may need to disable email confirmation for testing');
      }
      
      // Test 3: Try to sign in (this might fail if email confirmation is required)
      console.log('\n3. Testing user sign in...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      if (signInError) {
        console.log('❌ Sign in error:', signInError.message);
        if (signInError.message.includes('Email not confirmed')) {
          console.log('💡 This is expected if email confirmation is enabled');
        }
      } else {
        console.log('✅ Sign in successful');
        console.log('   User ID:', signInData.user?.id);
        
        // Test 4: Check if user profile exists
        console.log('\n4. Testing user profile access...');
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', signInData.user.id)
          .single();
        
        if (profileError) {
          console.log('❌ Profile error:', profileError.message);
        } else {
          console.log('✅ Profile access successful');
          console.log('   Username:', profile.username);
        }
        
        // Clean up: Sign out
        await supabase.auth.signOut();
        console.log('\n🧹 Cleaned up test session');
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testAuth(); 