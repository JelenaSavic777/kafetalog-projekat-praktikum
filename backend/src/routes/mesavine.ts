import { Router, Request, Response, RequestHandler } from 'express';
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
      fotografija: m.fotografija || null, // osigurano da nije ""
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

// POST /api/mesavine - dodavanje nove mešavine
router.post(
  '/',
  body('sifra').isString().notEmpty(),
  body('naziv').isString().notEmpty(),
  body('sastojci').isArray({ min: 1 }),
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const { sifra, naziv, opis, fotografija, sastojci, kategorije } = req.body;

      const foto = fotografija && fotografija.trim() !== '' ? fotografija.trim() : null;

      const ukupno = sastojci.reduce((sum: number, s: any) => sum + s.udeo, 0);
      if (ukupno !== 100) {
        res.status(400).json({ error: 'Ukupan udeo mora biti tačno 100%' });
        return;
      }

      let ukupnaCena = 0;
      for (const s of sastojci) {
        const [rez]: any = await db.execute('SELECT cena_po_kg FROM sastojci WHERE id = ?', [s.id]);
        if (!rez.length) {
          res.status(400).json({ error: `Sastojak sa ID ${s.id} ne postoji` });
          return;
        }
        const cena = rez[0].cena_po_kg;
        ukupnaCena += (cena * s.udeo) / 100;
      }

      const [result]: any = await db.execute(
        'INSERT INTO mesavine (sifra, naziv, opis, fotografija, ukupna_cena, sakriven) VALUES (?, ?, ?, ?, ?, ?)',
        [sifra, naziv, opis || '', foto, ukupnaCena, 0]
      );

      const mesavinaId = result.insertId;

      for (const s of sastojci) {
        await db.execute(
          'INSERT INTO mesavina_sastojci (mesavina_id, sastojak_id, udeo) VALUES (?, ?, ?)',
          [mesavinaId, s.id, s.udeo]
        );
      }

      if (Array.isArray(kategorije)) {
        for (const kat of kategorije) {
          await db.execute(
            'INSERT INTO mesavina_kategorije (mesavina_id, kategorija_id) VALUES (?, ?)',
            [mesavinaId, kat]
          );
        }
      }

      res.json({ success: true, id: mesavinaId, cena: ukupnaCena });
    } catch (err) {
      console.error('Greška prilikom dodavanja mešavine:', err);
      res.status(500).json({ error: 'Greška na serveru' });
    }
  }
);

// PUT /api/mesavine/:id
router.put(
  '/:id',
  (async (req: Request, res: Response) => {
    try {
      const mesavinaId = req.params.id;
      const { naziv, opis, sastojci } = req.body;

      if (!Array.isArray(sastojci) || sastojci.length === 0) {
        return res.status(400).json({ error: 'Sastojci su obavezni' });
      }

      const ukupno = sastojci.reduce((sum: number, s: any) => sum + s.udeo, 0);
      if (ukupno !== 100) {
        return res.status(400).json({ error: 'Ukupan udeo mora biti tačno 100%' });
      }

      let ukupnaCena = 0;
      for (const s of sastojci) {
        const [rez]: any = await db.execute('SELECT cena_po_kg FROM sastojci WHERE id = ?', [s.id]);
        if (!rez.length) {
          return res.status(400).json({ error: `Sastojak sa ID ${s.id} ne postoji` });
        }
        ukupnaCena += (rez[0].cena_po_kg * s.udeo) / 100;
      }

      await db.execute(
        'UPDATE mesavine SET naziv = ?, opis = ?, ukupna_cena = ? WHERE id = ?',
        [naziv, opis, ukupnaCena, mesavinaId]
      );

      await db.execute('DELETE FROM mesavina_sastojci WHERE mesavina_id = ?', [mesavinaId]);

      for (const s of sastojci) {
        await db.execute(
          'INSERT INTO mesavina_sastojci (mesavina_id, sastojak_id, udeo) VALUES (?, ?, ?)',
          [mesavinaId, s.id, s.udeo]
        );
      }

      res.json({ success: true, id: mesavinaId, cena: ukupnaCena });
    } catch (err) {
      console.error('Greška prilikom izmene mešavine:', err);
      res.status(500).json({ error: 'Greška na serveru' });
    }
  }) as RequestHandler
);

// DELETE /api/mesavine/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const mesavinaId = req.params.id;
    await db.execute('DELETE FROM mesavina_sastojci WHERE mesavina_id = ?', [mesavinaId]);
    await db.execute('DELETE FROM mesavina_kategorije WHERE mesavina_id = ?', [mesavinaId]);
    await db.execute('DELETE FROM mesavine WHERE id = ?', [mesavinaId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Greška prilikom brisanja mešavine:', err);
    res.status(500).json({ error: 'Greška prilikom brisanja' });
  }
});

export default router;
