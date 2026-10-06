import dotenv from 'dotenv';

// Sicheres Laden der Umgebungsvariablen vor jedem Import
const envResult = dotenv.config();
if (envResult.parsed) {
  for (const [key, val] of Object.entries(envResult.parsed)) {
    if (val && typeof val === 'string' && val.trim() !== '') {
      process.env[key] = val.trim();
    }
  }
}

import { startServer } from './server/index.js';

startServer().catch((err) => {
  console.error('[QuickClick Startup] Fataler Fehler beim Serverstart:', err);
  process.exit(1);
});

