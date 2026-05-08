import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf-8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)?.[1] || '';
const supabaseKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1] || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Fetching a lead...");
  const { data: leads, error: e1 } = await supabase.from('leads').select('*').limit(1);
  if (e1 || !leads || leads.length === 0) {
    console.error("Could not fetch lead:", e1);
    return;
  }
  const lead = leads[0];
  console.log("Found lead:", lead.id_lead);

  console.log("Attempting to insert into acciones_dia...");
  const { data, error } = await supabase.from('acciones_dia').insert({
    id_lead: lead.id_lead,
    id_tipo_accion: 1, // Llamada
    id_resultado: 2, // Responde
    descripcion: "Test desc",
    fecha_accion: new Date().toISOString()
  });

  console.log("Insert result:", data, error);
}

test();
