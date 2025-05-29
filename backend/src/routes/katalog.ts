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
    // Uzmi sve kategorije
    const [kategorijeRows] = await db.execute('SELECT id, naziv FROM kategorije');
    const kategorije = kategorijeRows as { id: number; naziv: string }[];

    // Uzmi sve mešavine koje nisu sakrivene sa njihovim kategorijama
    const [mesavineRows] = await db.execute(`
      SELECT m.id, m.naziv, m.opis, m.fotografija, m.ukupna_cena AS cena, mk.kategorija_id AS kategorijaId
      FROM mesavine m
      JOIN mesavina_kategorije mk ON m.id = mk.mesavina_id
      WHERE m.sakriven = 0
    `);
    const mesavine = mesavineRows as Mesavina[];

    // Uzmi sastojke za mešavine i njihove udele
    const [sastojciRows] = await db.execute(`
      SELECT s.id, s.naziv, s.fotografija, ms.udeo, ms.mesavina_id AS mesavinaId
      FROM sastojci s
      JOIN mesavina_sastojci ms ON s.id = ms.sastojak_id
    `);
    const sastojci = sastojciRows as Sastojak[];

    // Grupisanje mešavina po kategorijama, i dodavanje sastojaka svakoj mešavini
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
