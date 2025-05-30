import express from 'express';
import pool from '../db';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT id, naziv FROM sastojci');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom učitavanja sastojaka' });
  }
});

export default router;
