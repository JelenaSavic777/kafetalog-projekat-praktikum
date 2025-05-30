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

type FormState = {
  naziv: string;
  opis: string;
  fotografija: string;
  kategorije: string[];
  sastojci: Sastojak[];
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [mesavine, setMesavine] = useState<Mesavina[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLista, setShowLista] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formState, setFormState] = useState<FormState>({
    naziv: '',
    opis: '',
    fotografija: '',
    kategorije: [],
    sastojci: [],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchMesavine();
    }
  }, [navigate]);

  const fetchMesavine = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/mesavine');
      if (!res.ok) throw new Error('Greška pri učitavanju mešavina');
      const data = await res.json();

      setMesavine(data);
      setShowLista(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Nešto je pošlo po zlu');
    } finally {
      setLoading(false);
    }
  };

  const obrisiMesavinu = async (id: number) => {
    const potvrda = confirm('Da li želiš da obrišeš ovu mešavinu?');
    if (!potvrda) return;

    try {
      const res = await fetch(`/api/mesavine/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Greška prilikom brisanja');
      setMesavine(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      alert('Brisanje nije uspelo.');
      console.error(err);
    }
  };

  const zapocniIzmenu = (m: Mesavina) => {
    setEditingId(m.id);
    setFormState({
      naziv: m.naziv,
      opis: m.opis,
      fotografija: m.fotografija,
      kategorije: m.kategorije,
      sastojci: m.sastojci,
    });
  };

  const izmeniUdeo = (index: number, noviUdeo: number) => {
    if (isNaN(noviUdeo)) noviUdeo = 0;

    setFormState(prev => {
      const noviSastojci = [...prev.sastojci];
      noviSastojci[index] = { ...noviSastojci[index], udeo: noviUdeo };
      return { ...prev, sastojci: noviSastojci };
    });
  };

  const sacuvajIzmenu = async (id: number) => {
    const totalUdeo = formState.sastojci.reduce((sum, s) => sum + s.udeo, 0);
    if (Math.abs(totalUdeo - 100) > 0.01) {
      alert('Ukupan udeo sastojaka mora biti tačno 100%!');
      return;
    }

    try {
      const res = await fetch(`/api/mesavine/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          naziv: formState.naziv,
          opis: formState.opis,
          fotografija: formState.fotografija,
          kategorije: formState.kategorije,
          sastojci: formState.sastojci.map(s => ({
            id: s.id,
            udeo: s.udeo,
          })),
        }),
      });

      if (!res.ok) throw new Error('Greška pri izmeni');

      const updated = await res.json();
      setMesavine(prev =>
        prev.map(m =>
          m.id === id
            ? {
                ...m,
                naziv: formState.naziv,
                opis: formState.opis,
                fotografija: formState.fotografija,
                kategorije: formState.kategorije,
                sastojci: formState.sastojci,
                cena: updated.cena,
              }
            : m
        )
      );
      setEditingId(null);
    } catch (err) {
      alert('Izmena nije uspela');
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dobrodošli, admin!</h1>

      <div className="dashboard-buttons">
        <button onClick={() => navigate('/admin/mesavine/novi')} className="btn-primary">
          Nova mešavina
        </button>
        <button onClick={fetchMesavine} className="btn-secondary">
          Lista mešavina
        </button>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="btn-logout">
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

                {editingId === m.id ? (
                  <>
                    <input
                      value={formState.naziv}
                      onChange={e => setFormState({ ...formState, naziv: e.target.value })}
                      className="edit-input"
                    />
                    <textarea
                      value={formState.opis}
                      onChange={e => setFormState({ ...formState, opis: e.target.value })}
                      className="edit-input"
                    />
                    <input
                      value={formState.fotografija}
                      onChange={e => setFormState({ ...formState, fotografija: e.target.value })}
                      placeholder="URL fotografije"
                      className="edit-input"
                    />
                    <h4 className="font-medium">Sastojci:</h4>
                    <ul>
                      {formState.sastojci.map((s, index) => (
                        <li key={s.id}>
                          {s.naziv} – 
                          <input
                            type="number"
                            value={s.udeo}
                            onChange={(e) => izmeniUdeo(index, Number(e.target.value))}
                            className="udeo-input"
                          />%
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm mt-2">
                      Ukupan udeo: {formState.sastojci.reduce((sum, s) => sum + s.udeo, 0)}%
                    </p>
                    <button onClick={() => sacuvajIzmenu(m.id)} className="btn-save">💾 Sačuvaj</button>
                  </>
                ) : (
                  <>
                    <h3>{m.naziv}</h3>
                    <p>{m.opis}</p>
                  </>
                )}

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
                <div className="card-actions">
                  <button onClick={() => zapocniIzmenu(m)} title="Izmeni" className="action-button">✏️</button>
                  <button onClick={() => obrisiMesavinu(m.id)} title="Obriši" className="action-button">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
