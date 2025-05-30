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
  kategorijaId: number | null;
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

    // Dodaj "Nekategorizovane" kao specijalnu kategoriju
    const kategorijeMap: Kategorija[] = [
      ...kategorije.map(k => ({ id: k.id, naziv: k.naziv, mesavine: [] })),
      { id: -1, naziv: 'Nekategorizovane', mesavine: [] }, // fallback
    ];

    // Mešavine (left join da obuhvati i one bez kategorije)
    const [mesavineRows] = await db.execute(`
      SELECT m.id, m.naziv, m.opis, m.fotografija, m.ukupna_cena AS cena, mk.kategorija_id AS kategorijaId
      FROM mesavine m
      LEFT JOIN mesavina_kategorije mk ON m.id = mk.mesavina_id
      WHERE m.sakriven = 0
    `);
    const mesavine = mesavineRows as Mesavina[];

    // Sastojci
    const [sastojciRows] = await db.execute(`
      SELECT s.id, s.naziv, s.fotografija, ms.udeo, ms.mesavina_id AS mesavinaId
      FROM sastojci s
      JOIN mesavina_sastojci ms ON s.id = ms.sastojak_id
    `);
    const sastojci = sastojciRows as Sastojak[];

    // Grupisanje mešavina u kategorije
    for (const mesavina of mesavine) {
      mesavina.sastojci = sastojci.filter(s => s.mesavinaId === mesavina.id);
      const kategorija = kategorijeMap.find(k => k.id === (mesavina.kategorijaId ?? -1));
      if (kategorija) {
        kategorija.mesavine.push(mesavina);
      }
    }

    // Filtriraj samo kategorije koje imaju bar jednu mešavinu
    const rezultat = kategorijeMap.filter(k => k.mesavine.length > 0);

    res.json(rezultat);
  } catch (err) {
    console.error('Greška u katalog ruti:', err);
    res.status(500).json({ error: 'Greška pri učitavanju kataloga' });
  }
});

export default router;
