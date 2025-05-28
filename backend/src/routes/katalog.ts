// src/routes/katalog.ts
import { Router } from 'express';
import db from '../db';

const router = Router();

interface Kategorija {
  id: number;
  naziv: string;
  mesavine: Mesavina[];
}

interface Mesavina {
  id: number;
  naziv: string;
  opis: string;
  fotografija: string;
  cena: number;
  kategorijaId: number;
  sastojci: Sastojak[];
}

interface Sastojak {
  id: number;
  naziv: string;
  fotografija: string;
  udeo: number;
  mesavinaId: number;
}

router.get('/', async (req, res) => {
  try {
    const [kategorijeRows] = await db.execute('SELECT id, naziv FROM kategorija');
    const kategorije = kategorijeRows as { id: number; naziv: string }[];

    // Dohvati mešavine sa pripadajućim kategorijama
    const [mesavineRows] = await db.execute(`
      SELECT m.id, m.naziv, m.opis, m.fotografija, m.cena, km.kategorijaId
      FROM mesavina m
      JOIN kategorija_mesavina km ON m.id = km.mesavinaId
      WHERE m.prikazana = 1
    `);
    const mesavine = mesavineRows as Mesavina[];

    // Dohvati sastojke i njihove udele za mešavine
    const [sastojciRows] = await db.execute(`
      SELECT s.id, s.naziv, s.fotografija, ms.udeo, ms.mesavinaId
      FROM sastojak s
      JOIN mesavina_sastojak ms ON s.id = ms.sastojakId
    `);
    const sastojci = sastojciRows as Sastojak[];

    // Grupisanje mešavina po kategorijama
    const kategorijeMap: Kategorija[] = kategorije.map(k => {
      const mesavineUKategoriji = mesavine
        .filter(m => m.kategorijaId === k.id)
        .map(m => ({
          ...m,
          sastojci: sastojci.filter(s => s.mesavinaId === m.id),
        }));

      return {
        id: k.id,
        naziv: k.naziv,
        mesavine: mesavineUKategoriji,
      };
    });

    res.json(kategorijeMap);
  } catch (err) {
    console.error('Greška u katalog ruti:', err);
    res.status(500).json({ error: 'Greška pri učitavanju kataloga' });
  }
});

export default router;
