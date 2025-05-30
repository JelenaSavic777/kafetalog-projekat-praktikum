import { Router } from 'express';
import db from '../db';

const router = Router();

// GET /api/kategorije - lista svih kategorija
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, naziv FROM kategorije');
    res.json(rows);
  } catch (err) {
    console.error('Greška pri dohvatanju kategorija:', err);
    res.status(500).json({ error: 'Greška pri dohvatanju kategorija' });
  }
});

export default router;
