import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/katalog.css';

type Sastojak = {
  id: number;
  naziv: string;
  fotografija: string;
  udeo: number;
  mesavinaId: number;
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

type Kategorija = {
  id: number;
  naziv: string;
  mesavine: Mesavina[];
};

const Katalog = () => {
  const [kategorije, setKategorije] = useState<Kategorija[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedMesavina, setSelectedMesavina] = useState<Mesavina | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKatalog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/katalog');
        if (!res.ok) throw new Error('Greška pri učitavanju podataka');
        const data = await res.json();
        setKategorije(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Nešto je pošlo po zlu');
      } finally {
        setLoading(false);
      }
    };
    fetchKatalog();
  }, []);

  const filtriraneKategorije = kategorije
    .map(k => ({
      ...k,
      mesavine: k.mesavine.filter(m =>
        filter === '' || m.sastojci.some(s => s.naziv.toLowerCase().includes(filter.toLowerCase()))
      )
    }))
    .filter(k => k.mesavine.length > 0);

  return (
    <div className="katalog-wrapper">
      <div className="nav-bar">
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/admin/mesavine/novi')}>Dodaj mešavinu</button>
        <button onClick={() => navigate('/admin/mesavine/lista')}>Lista mešavina</button>
      </div>

      <h1>Katalog Kafe</h1>

      <input
        type="text"
        placeholder="Filtriraj po sastojku..."
        className="filter-input"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      {loading && <p>Učitavanje...</p>}
      {error && <p>{error}</p>}

      <div className="grid-container">
        <div>
          {filtriraneKategorije.length === 0 && !loading && (
            <p>Nema mešavina za prikaz.</p>
          )}
          {filtriraneKategorije.map(kategorija => (
            <div key={kategorija.id}>
              <h2>{kategorija.naziv}</h2>
              <div>
                {kategorija.mesavine.map(m => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMesavina(m)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={m.fotografija} alt={m.naziv} />
                    <h3>{m.naziv}</h3>
                    <p>{m.opis}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          {selectedMesavina ? (
            <div>
              <h2>{selectedMesavina.naziv}</h2>
              <img src={selectedMesavina.fotografija} alt={selectedMesavina.naziv} />
              <p>{selectedMesavina.opis}</p>
              <h3>Sastojci:</h3>
              <ul>
                {selectedMesavina.sastojci.map(sastojak => (
                  <li key={sastojak.id}>
                    <img src={sastojak.fotografija} alt={sastojak.naziv} />
                    <div>
                      <div>{sastojak.naziv}</div>
                      <div>{sastojak.udeo}%</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>Kliknite na mešavinu da vidite detalje</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Katalog;
