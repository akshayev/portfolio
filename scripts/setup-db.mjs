/**
 * Setup script — runs the migration SQL against Supabase via the REST SQL endpoint.
 *
 * Usage:  node scripts/setup-db.mjs
 *
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars,
 *           OR falls back to the publishable key for the SQL HTTP endpoint.
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://adsotfmmqqmiukhqlmbg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_wWsWknUJ0cLX2TuyzZ9mhg_vZGhl-hE';

async function runSQL(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SQL execution failed (${res.status}): ${text}`);
  }
  return res.json();
}

async function main() {
  console.log('📦 Reading migration file...');
  const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '001_portfolio_schema.sql');
  const sql = readFileSync(migrationPath, 'utf-8');

  console.log('🚀 Executing migration against Supabase...');
  console.log(`   URL: ${SUPABASE_URL}`);
  
  try {
    await runSQL(sql);
    console.log('✅ Migration executed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.log('\n💡 Tip: You can run this SQL directly in the Supabase Dashboard SQL Editor:');
    console.log(`   ${SUPABASE_URL}/project/adsotfmmqqmiukhqlmbg/sql`);
    console.log('\n   Copy the contents of supabase/migrations/001_portfolio_schema.sql');
    process.exit(1);
  }
}

main();
