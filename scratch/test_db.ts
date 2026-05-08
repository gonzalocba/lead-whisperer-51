import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf-8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)?.[1] || '';
const supabaseKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1] || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Checking acciones_dia...");
  const { data: d1, error: e1 } = await supabase.from('acciones_dia').select('*').limit(1);
  console.log("acciones_dia:", d1, e1);
}

test();
