import { Router } from 'express';
import db from '../db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [mesavine] = await db.execute(
      `SELECT id, naziv, opis, fotografija, cena FROM mesavina WHERE prikazana = 1`
    );

    const [sastojci] = await db.execute(
      `SELECT s.id, s.naziv, s.fotografija, ms.udeo, ms.mesavinaId
       FROM sastojak s
       JOIN mesavina_sastojak ms ON s.id = ms.sastojakId`
    );

    const [kategorije] = await db.execute(
      `SELECT km.mesavinaId, k.naziv
       FROM kategorija k
       JOIN kategorija_mesavina km ON k.id = km.kategorijaId`
    );

    const sastojciMap = (sastojci as any[]).reduce((acc, s) => {
      if (!acc[s.mesavinaId]) acc[s.mesavinaId] = [];
      acc[s.mesavinaId].push(s);
      return acc;
    }, {} as Record<number, any[]>);

    const kategorijeMap = (kategorije as any[]).reduce((acc, k) => {
      if (!acc[k.mesavinaId]) acc[k.mesavinaId] = [];
      acc[k.mesavinaId].push(k.naziv);
      return acc;
    }, {} as Record<number, string[]>);

    const rezultat = (mesavine as any[]).map(m => ({
      ...m,
      sastojci: sastojciMap[m.id] || [],
      kategorije: kategorijeMap[m.id] || []
    }));

    res.json(rezultat);
  } catch (err) {
    console.error('Greška prilikom dohvatanja mešavina:', err);
    res.status(500).json({ error: 'Greška prilikom učitavanja mešavina' });
  }
});

export default router;
