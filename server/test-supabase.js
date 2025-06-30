import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yubekfmzlvkvqhxncmyx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YmVrZm16bHZrdnFoeG5jbXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExODE0ODAsImV4cCI6MjA2Njc1NzQ4MH0.Xd_aAUkjhifiaDYkqP6r4iQ1SXsc1h652jkKuO-dtpE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

(async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(1);
  console.log('Test fetch:', { data, error });
})(); 