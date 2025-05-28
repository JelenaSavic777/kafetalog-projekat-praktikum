import express, { Request, Response, NextFunction } from 'express';
import pool from '../db';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.post(
  '/',
  [
    body('sifra').isString().notEmpty(),
    body('naziv').isString().notEmpty(),
    body('opis').optional().isString(),
    body('fotografija').optional().isString(),
    body('sastojci').isArray({ min: 1 }),
    body('sastojci.*.id').isInt(),
    body('sastojci.*.udeo').isNumeric(),
    body('kategorije').isArray(),
    body('kategorije.*').isInt()
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { sifra, naziv, opis, fotografija, sastojci, kategorije } = req.body;

    const total = sastojci.reduce((sum: number, s: any) => sum + s.udeo, 0);
    if (total !== 100) {
      res.status(400).json({ error: 'Ukupan udeo sastojaka mora biti tačno 100%' });
      return;
    }

    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      const [mesavinaResult]: any = await conn.execute(
        `INSERT INTO mesavine (sifra, naziv, opis, fotografija) VALUES (?, ?, ?, ?)`,
        [sifra, naziv, opis, fotografija]
      );
      const mesavina_id = mesavinaResult.insertId;

      for (const katId of kategorije) {
        await conn.execute(
          `INSERT INTO mesavina_kategorije (mesavina_id, kategorija_id) VALUES (?, ?)`,
          [mesavina_id, katId]
        );
      }

      let ukupnaCena = 0;
      for (const s of sastojci) {
        const [rows]: any = await conn.execute(
          'SELECT cena_po_kg FROM sastojci WHERE id = ?',
          [s.id]
        );
        const cena = rows[0]?.cena_po_kg || 0;
        ukupnaCena += (cena * s.udeo) / 100;

        await conn.execute(
          `INSERT INTO mesavina_sastojci (mesavina_id, sastojak_id, udeo) VALUES (?, ?, ?)`,
          [mesavina_id, s.id, s.udeo]
        );
      }

      await conn.execute(
        `UPDATE mesavine SET ukupna_cena = ? WHERE id = ?`,
        [ukupnaCena, mesavina_id]
      );

      await conn.commit();
      res.status(201).json({ poruka: 'Mešavina uspešno dodata' });
    } catch (err) {
      await conn.rollback();
      console.error(err);
      res.status(500).json({ error: 'Greška prilikom dodavanja mešavine' });
    } finally {
      conn.release();
    }
  }
);

export default router;
