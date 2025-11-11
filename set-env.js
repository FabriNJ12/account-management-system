// set-env.js
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, 'src', 'environments', 'environment.production.ts');

const supabaseUrl = process.env.NG_APP_SUPABASE_URL || '';
const supabaseKey = process.env.NG_APP_SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  NG_APP_SUPABASE_URL or NG_APP_SUPABASE_KEY is empty. The generated file will contain empty strings.');
}

const content = `export const environment = {
  production: true,
  supabaseUrl: '${supabaseUrl.replace(/'/g, "\\'")}',
  supabaseKey: '${supabaseKey.replace(/'/g, "\\'")}',
};
`;

fs.mkdirSync(path.dirname(envPath), { recursive: true });
fs.writeFileSync(envPath, content, { encoding: 'utf8' });
console.log('✅ Generated', envPath);
