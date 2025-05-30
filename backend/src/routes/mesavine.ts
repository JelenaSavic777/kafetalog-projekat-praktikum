import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import db from '../db';

const router = Router();

// GET /api/mesavine - javni katalog
router.get('/', async (req, res) => {
  try {
    const [mesavine] = await db.execute(
      `SELECT id, naziv, opis, fotografija, ukupna_cena FROM mesavine WHERE sakriven = 0`
    );

    const [sastojci] = await db.execute(
      `SELECT s.id, s.naziv, s.fotografija, ms.udeo, ms.mesavina_id
       FROM sastojci s
       JOIN mesavina_sastojci ms ON s.id = ms.sastojak_id`
    );

    const [kategorije] = await db.execute(
      `SELECT mk.mesavina_id, k.naziv
       FROM kategorije k
       JOIN mesavina_kategorije mk ON k.id = mk.kategorija_id`
    );

    const sastojciMap = (sastojci as any[]).reduce((acc, s) => {
      if (!acc[s.mesavina_id]) acc[s.mesavina_id] = [];
      acc[s.mesavina_id].push(s);
      return acc;
    }, {} as Record<number, any[]>);

    const kategorijeMap = (kategorije as any[]).reduce((acc, k) => {
      if (!acc[k.mesavina_id]) acc[k.mesavina_id] = [];
      acc[k.mesavina_id].push(k.naziv);
      return acc;
    }, {} as Record<number, string[]>);

    const rezultat = (mesavine as any[]).map(m => ({
      id: m.id,
      naziv: m.naziv,
      opis: m.opis,
      fotografija: m.fotografija,
      cena: m.ukupna_cena,
      sastojci: sastojciMap[m.id] || [],
      kategorije: kategorijeMap[m.id] || []
    }));

    res.json(rezultat);
  } catch (err) {
    console.error('Greška prilikom dohvatanja mešavina:', err);
    res.status(500).json({ error: 'Greška prilikom učitavanja mešavina' });
  }
});

//Dodavanje nove mesavine

router.post(
  '/',
  body('sifra').isString().trim().notEmpty(),
  body('naziv').isString().trim().notEmpty(),
  body('opis').optional().isString(),
  body('fotografija').optional().isString(),
  body('sastojci').isArray({ min: 1 }),
  body('sastojci.*.id').isInt(),
  body('sastojci.*.udeo').isFloat({ min: 0 }),
  body('kategorije').optional().isArray(),
  body('kategorije.*').isInt(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const { sifra, naziv, opis, fotografija, sastojci, kategorije } = req.body;

      const [result]: any = await db.execute(
        'INSERT INTO mesavine (sifra, naziv, opis, fotografija) VALUES (?, ?, ?, ?)',
        [sifra, naziv, opis, fotografija]
      );
      const mesavinaId = result.insertId;

      for (const s of sastojci) {
        await db.execute(
          'INSERT INTO mesavina_sastojci (mesavina_id, sastojak_id, udeo) VALUES (?, ?, ?)',
          [mesavinaId, s.id, s.udeo]
        );
      }

      for (const katId of kategorije || []) {
        await db.execute(
          'INSERT INTO mesavina_kategorije (mesavina_id, kategorija_id) VALUES (?, ?)',
          [mesavinaId, katId]
        );
      }

      res.json({ success: true, id: mesavinaId });
    } catch (err) {
      console.error('Greška prilikom dodavanja mešavine:', err);
      res.status(500).json({ error: 'Greška na serveru' });
    }
  }
);


export default router;
