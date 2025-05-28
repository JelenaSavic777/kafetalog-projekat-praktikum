
import { useEffect, useState } from 'react';
import '../styles/stylePages.css';



type Sastojak = {
  id: number;
  naziv: string;
  fotografija: string;
  udeo: number;
};

type Mesavina = {
  id: number;
  naziv: string;
  opis: string;
  fotografija: string;
  cena: number;
  kategorije: string[];
  sastojci: Sastojak[];
};

const ListaMesavina = () => {
  const [mesavine, setMesavine] = useState<Mesavina[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMesavine = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/mesavine');
        if (!res.ok) throw new Error('Greška pri učitavanju mešavina');
        const data = await res.json();
        setMesavine(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Nešto je pošlo po zlu');
      } finally {
        setLoading(false);
      }
    };
    fetchMesavine();
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Lista Mešavina</h1>
      {loading && <p className="text-center">Učitavanje...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mesavine.map(m => (
          <div key={m.id} className="bg-neutral-100 p-4 rounded shadow">
            <img src={m.fotografija} alt={m.naziv} className="w-full h-40 object-cover rounded mb-3" />
            <h2 className="font-bold text-lg">{m.naziv}</h2>
            <p className="text-sm text-neutral-600 mb-2">{m.opis}</p>
            <p className="font-semibold mb-2">Cena: {m.cena} RSD</p>
            <div>
              <h3 className="font-medium">Sastojci:</h3>
              <ul className="text-sm">
                {m.sastojci.map(s => (
                  <li key={s.id}>
                    {s.naziv} – {s.udeo}%
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-2 text-sm text-neutral-500">
              Kategorije: {m.kategorije.join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaMesavina;
