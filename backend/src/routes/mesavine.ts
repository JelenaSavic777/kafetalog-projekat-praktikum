import { Router } from 'express';
import db from '../db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Dohvatanje mešavina koje nisu sakrivene
    const [mesavine] = await db.execute(
      `SELECT id, naziv, opis, fotografija, ukupna_cena FROM mesavine WHERE sakriven = 0`
    );

    // Dohvatanje sastojaka za mešavine
    const [sastojci] = await db.execute(
      `SELECT s.id, s.naziv, s.fotografija, ms.udeo, ms.mesavina_id
       FROM sastojci s
       JOIN mesavina_sastojci ms ON s.id = ms.sastojak_id`
    );

    // Dohvatanje kategorija za mešavine
    const [kategorije] = await db.execute(
      `SELECT mk.mesavina_id, k.naziv
       FROM kategorije k
       JOIN mesavina_kategorije mk ON k.id = mk.kategorija_id`
    );

    // Grupisanje sastojaka po mesavini
    const sastojciMap = (sastojci as any[]).reduce((acc, s) => {
      if (!acc[s.mesavina_id]) acc[s.mesavina_id] = [];
      acc[s.mesavina_id].push(s);
      return acc;
    }, {} as Record<number, any[]>);

    // Grupisanje kategorija po mesavini
    const kategorijeMap = (kategorije as any[]).reduce((acc, k) => {
      if (!acc[k.mesavina_id]) acc[k.mesavina_id] = [];
      acc[k.mesavina_id].push(k.naziv);
      return acc;
    }, {} as Record<number, string[]>);

    // Spajanje podataka
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

export default router;
