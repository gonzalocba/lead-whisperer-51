import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rpipozkmeqvavaxpvwrm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaXBvemttZXF2YXZheHB2d3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NjEyNjksImV4cCI6MjA5MzIzNzI2OX0.mif0_2KvKUcxQEeqFbGCoypaDvrjlMqXJHcrKYSfcbA';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase.from('Leads').select('*');
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}

run();
