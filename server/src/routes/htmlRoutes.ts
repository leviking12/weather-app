// src/routes/index.ts
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Serve React app entry point for any unmatched GET request
router.get('/*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

export default router;
