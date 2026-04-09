/**
 * execute-schema.mjs — Creates portfolio tables in Supabase via the REST API.
 * Run: node scripts/execute-schema.mjs
 */

const SUPABASE_URL = 'https://adsotfmmqqmiukhqlmbg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wWsWknUJ0cLX2TuyzZ9mhg_vZGhl-hE';

// Try to check if tables already exist by querying education
async function checkTables() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/education?select=id&limit=1`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  });
  return { status: res.status, ok: res.ok, body: await res.text() };
}

// Insert seed data using the REST API
async function seedTable(table, rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'resolution=ignore-duplicates',
    },
    body: JSON.stringify(rows),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error(`  ❌ ${table}: ${res.status} — ${text}`);
    return false;
  }
  console.log(`  ✅ ${table}: ${rows.length} row(s) seeded`);
  return true;
}

async function main() {
  console.log('🔍 Checking if tables exist...');
  const check = await checkTables();
  
  if (check.status === 404 || check.body.includes('does not exist')) {
    console.log('\n⚠️  Tables do NOT exist yet.\n');
    console.log('You need to create them first. Please run the SQL in:');
    console.log('  supabase/migrations/001_portfolio_schema.sql');
    console.log('\nOption 1: Supabase Dashboard SQL Editor');
    console.log(`  → ${SUPABASE_URL.replace('.co', '.com/dashboard')}/project/adsotfmmqqmiukhqlmbg/sql/new`);
    console.log('\nOption 2: Supabase CLI (after login)');
    console.log('  → npx supabase db push');
    console.log('\nOption 3: Direct psql (if you have the password)');
    console.log('  → psql postgresql://postgres:YOUR_PASSWORD@db.adsotfmmqqmiukhqlmbg.supabase.co:5432/postgres -f supabase/migrations/001_portfolio_schema.sql');
    return;
  }

  if (check.ok) {
    console.log('✅ Tables exist! Seeding data...\n');
  } else {
    console.log(`⚠️  Got status ${check.status}: ${check.body}`);
    console.log('Attempting to seed anyway...\n');
  }

  // Seed data
  await seedTable('education', [
    {
      id: 'education-cusat-btech-it',
      title: 'B.Tech in Information Technology',
      institution: 'Cochin University of Science and Technology (CUSAT)',
      description: 'Built a strong software engineering foundation while serving as Zone Captain for the Sargam arts festival.',
      date_range: '2023-2027',
      type: 'major_milestone',
    },
  ]);

  await seedTable('projects', [
    {
      id: 'project-citypulse-ai',
      title: 'CityPulse AI',
      description: 'An AI-powered urban insight platform for extracting and analyzing city-scale signals.',
      tech_stack: ['Python', 'Google Gemini', 'PostgreSQL', 'FastAPI', 'React'],
      github_link: 'https://github.com/your-username/citypulse-ai',
      category: 'AI Agent',
    },
    {
      id: 'project-job-seeker-ai-agent',
      title: 'Job Seeker AI Agent',
      description: 'An agentic workflow that automates job discovery, ranking, and application support.',
      tech_stack: ['Python', 'Google Gemini', 'Selenium', 'Playwright', 'Supabase'],
      github_link: 'https://github.com/your-username/job-seeker-ai-agent',
      category: 'AI Agent',
    },
  ]);

  await seedTable('experience', [
    {
      id: 'experience-strokx-website-developer-intern',
      role: 'Website Developer Intern',
      company: 'Strokx Technologies',
      date_range: '2025-01 to 2025-04',
    },
    {
      id: 'experience-keltron-intern',
      role: 'Software Development Intern',
      company: 'Keltron',
      date_range: '2024-06 to 2024-08',
    },
  ]);

  await seedTable('creative', [
    {
      id: 'creative-cucek-photography',
      role: 'Creative Member',
      organization: 'CUCEK Photography Club',
      date_range: '2023-2026',
    },
    {
      id: 'creative-tedxcusat',
      role: 'Design / Media Team',
      organization: 'TEDxCUSAT',
      date_range: '2024-2026',
    },
  ]);

  await seedTable('timeline_stops', [
    { id: 'stop-cusat-btech-it', source_type: 'education', source_id: 'education-cusat-btech-it', type: 'major_milestone', label: 'B.Tech in Information Technology', z_index: 0 },
    { id: 'stop-citypulse-ai', source_type: 'project', source_id: 'project-citypulse-ai', type: 'standard', label: 'CityPulse AI', z_index: 1 },
    { id: 'stop-job-seeker-ai-agent', source_type: 'project', source_id: 'project-job-seeker-ai-agent', type: 'standard', label: 'Job Seeker AI Agent', z_index: 2 },
    { id: 'stop-strokx-technologies', source_type: 'experience', source_id: 'experience-strokx-website-developer-intern', type: 'standard', label: 'Website Developer Intern at Strokx Technologies', z_index: 3 },
    { id: 'stop-keltron', source_type: 'experience', source_id: 'experience-keltron-intern', type: 'standard', label: 'Keltron', z_index: 4 },
    { id: 'stop-cucek-photography-club', source_type: 'creative', source_id: 'creative-cucek-photography', type: 'standard', label: 'CUCEK Photography Club', z_index: 5 },
    { id: 'stop-tedxcusat', source_type: 'creative', source_id: 'creative-tedxcusat', type: 'standard', label: 'TEDxCUSAT', z_index: 6 },
  ]);

  console.log('\n🎉 Seeding complete!');
  
  // Verify by fetching timeline stops
  console.log('\n🔍 Verifying data...');
  const verifyRes = await fetch(`${SUPABASE_URL}/rest/v1/timeline_stops?select=id,label,z_index&order=z_index`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
  });
  
  if (verifyRes.ok) {
    const stops = await verifyRes.json();
    console.log(`✅ Found ${stops.length} timeline stops:`);
    stops.forEach(s => console.log(`   ${s.z_index}: ${s.label}`));
  }
}

main().catch(console.error);
