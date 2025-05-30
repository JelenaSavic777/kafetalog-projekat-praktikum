import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/dashboardStyle.css';

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

// Tip za sirove podatke sa API-ja
type RawMesavina = {
  id: number;
  naziv: string;
  opis: string;
  fotografija: string;
  cena?: number;
  ukupna_cena?: number;
  kategorije?: string[];
  sastojci?: Sastojak[];
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [mesavine, setMesavine] = useState<Mesavina[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLista, setShowLista] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Funkcija za učitavanje mešavina
  const fetchMesavine = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/mesavine');
      if (!res.ok) throw new Error('Greška pri učitavanju mešavina');
      const data = await res.json();

      const mesavineSaCenom = (data as RawMesavina[]).map(m => ({
        id: m.id,
        naziv: m.naziv,
        opis: m.opis,
        fotografija: m.fotografija,
        cena: m.cena ?? m.ukupna_cena ?? 0,
        kategorije: m.kategorije ?? [],
        sastojci: m.sastojci ?? [],
      }));

      setMesavine(mesavineSaCenom);
      setShowLista(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Nešto je pošlo po zlu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dobrodošli, admin!</h1>

      <div className="dashboard-buttons">
        <button
          onClick={() => navigate('/admin/mesavine/novi')}
          className="btn-primary"
        >
          Nova mešavina
        </button>
        <button
          onClick={fetchMesavine}
          className="btn-secondary"
        >
          Lista mešavina
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/');
          }}
          className="btn-logout"
        >
          Log out
        </button>
      </div>

      {showLista && (
        <>
          <h2 className="dashboard-subtitle">Trenutne mešavine</h2>

          {loading && <p>Učitavanje...</p>}
          {error && <p className="text-red-600">{error}</p>}

          <div className="mesavine-grid">
            {mesavine.map((m) => (
              <div key={m.id} className="mesavina-card">
                <img src={m.fotografija} alt={m.naziv} />
                <h3>{m.naziv}</h3>
                <p>{m.opis}</p>
                <p className="font-semibold mb-2">Cena: {m.cena} RSD</p>
                <div>
                  <h4 className="font-medium">Sastojci:</h4>
                  <ul>
                    {m.sastojci.map((s) => (
                      <li key={s.id}>
                        {s.naziv} – {s.udeo}%
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="categories">
                  Kategorije: {m.kategorije.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
