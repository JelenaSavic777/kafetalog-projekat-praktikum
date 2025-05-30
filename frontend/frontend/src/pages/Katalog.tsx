import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/katalog.css';

type Sastojak = {
  id: number;
  naziv: string;
  opis: string;
  poreklo: string;
  fotografija: string;
  cenaPoKg: number;
  udeo: number;
  mesavinaId: number;
};

type Mesavina = {
  id: number;
  naziv: string;
  opis: string;
  fotografija: string;
  cena: number;
  sastojci: Sastojak[];
  kategorije: string[];
};

type Kategorija = {
  id: number;
  naziv: string;
  mesavine: Mesavina[];
  opis: string;
};

const Katalog = () => {
  const [kategorije, setKategorije] = useState<Kategorija[]>([]);
  const [filter, setFilter] = useState('');
  const [filterMode, setFilterMode] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedMesavina, setSelectedMesavina] = useState<Mesavina | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKatalog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:4000/api/katalog');
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

  const sveMesavine = kategorije.flatMap(k => k.mesavine)
    .filter((mesavina, index, self) =>
      index === self.findIndex(m => m.id === mesavina.id)
    );

  const filtriraneMesavine = sveMesavine.filter(mesavina => {
    const f = filter.toLowerCase().trim();
    if (f === '') return true;
    return (
      mesavina.naziv.toLowerCase().includes(f) ||
      mesavina.opis?.toLowerCase().includes(f) ||
      mesavina.kategorije?.some(k => k.toLowerCase().includes(f)) ||
      mesavina.sastojci.some(s =>
        s.naziv.toLowerCase().includes(f) || s.opis?.toLowerCase().includes(f)
      )
    );
  });

  const filtriraneKategorije = kategorije.filter(k =>
    filter.trim() !== '' && (
      k.naziv.toLowerCase().includes(filter.toLowerCase()) ||
      k.opis?.toLowerCase().includes(filter.toLowerCase())
    )
  );

  const mesavineZaPrikaz = filterMode
    ? filtriraneMesavine
    : selectedCategoryId === null
    ? sveMesavine
    : kategorije.find(k => k.id === selectedCategoryId)?.mesavine ?? [];

  return (
    <div className="katalog-wrapper">
      <div className="nav-bar">
        <button onClick={() => navigate('/login')}>Login</button>
      </div>

      <h1 className="naslov">Katalog Kafe</h1>

      <div className="filter-wrapper">
        <input
          type="text"
          placeholder="Filtriraj po nazivu, opisu, sastojcima ili kategoriji..."
          className="filter-input"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              setFilterMode(true);
              setSelectedMesavina(null);
            }
          }}
        />
        <button
          className="filter-button"
          onClick={() => {
            if (filter.trim() !== '') {
              setFilterMode(true);
              setSelectedMesavina(null);
            }
          }}
        >
          🔍
        </button>

        {filterMode && filter.trim() !== '' && (
          <div className="filter-info">
            <p>
              Pronađeno: {filtriraneMesavine.length} mešavina i {filtriraneKategorije.length} kategorija za "{filter}"
            </p>
            <button
              onClick={() => {
                setFilter('');
                setFilterMode(false);
                setSelectedMesavina(null);
              }}
            >
              Očisti filter
            </button>
          </div>
        )}
      </div>

      {loading && <p className="loading-text">Učitavanje...</p>}
      {error && <p className="error-text">{error}</p>}

<div className="flex gap-6 px-6">
  <div className="mesavine-lista w-1/2 space-y-4">
    {filterMode && filtriraneKategorije.length > 0 && (
      <div className="filtrirane-kategorije">
        <h3>Filtrirane kategorije:</h3>
        <ul>
          {filtriraneKategorije.map(k => (
            <li
              key={k.id}
              onClick={() => {
                setSelectedCategoryId(k.id);
                setFilter('');
                setFilterMode(false);
                setSelectedMesavina(null);
              }}
              className="cursor-pointer underline hover:text-blue-600"
            >
              {k.naziv}
            </li>
          ))}
        </ul>
      </div>
    )}

    {mesavineZaPrikaz.length === 0 && !loading && (
      <p className="text-gray-600">Nema mešavina za prikaz.</p>
    )}

    {mesavineZaPrikaz.map(m => (
      <div
        key={m.id}
        className={`mesavina-kartica cursor-pointer p-4 border rounded-lg shadow hover:bg-gray-50 transition ${
          selectedMesavina?.id === m.id ? 'border-blue-500' : ''
        }`}
        onClick={() => setSelectedMesavina(m)}
      >
        <img src={m.fotografija} alt={m.naziv} className="w-full h-40 object-cover rounded" />
        <div className="mt-2">
          <h3 className="text-lg font-semibold">{m.naziv}</h3>
          <p className="text-sm text-gray-600">{m.opis}</p>
          <p className="font-medium mt-1">
            Cena: {typeof m.cena === 'number' ? m.cena.toFixed(2) : 'N/A'} RSD
          </p>
        </div>
      </div>
    ))}
  </div>

  <div className="detalji-mesavine w-1/2 bg-white rounded-xl shadow p-6">
    {!selectedMesavina ? (
      <p className="text-gray-500">Izaberite mešavinu za detalje</p>
    ) : (
      <>
        <h2 className="text-2xl font-bold mb-2">{selectedMesavina.naziv}</h2>
        <img
          src={selectedMesavina.fotografija}
          alt={selectedMesavina.naziv}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <p className="mb-2">{selectedMesavina.opis}</p>
        <p className="text-lg font-semibold text-green-700 mb-4">
          Cena: {typeof selectedMesavina.cena === 'number'
            ? selectedMesavina.cena.toFixed(2)
            : Number(selectedMesavina.cena || 0).toFixed(2)} RSD
        </p>

        <h3 className="font-semibold text-xl mb-2">Sastojci</h3>
        <ul className="space-y-3">
          {selectedMesavina.sastojci.map((s, index) => (
            <li key={`${s.id}-${index}`} className="border rounded p-3">
              <p><strong>Udeo:</strong> {s.udeo !== undefined ? Number(s.udeo).toFixed(2) : '0.00'}%</p>
              <p className="text-sm">{s.opis}</p>
              <p className="text-sm text-gray-600">Poreklo: {s.poreklo}</p>
              <img src={s.fotografija} alt={s.naziv} className="w-full h-32 object-cover rounded mt-2" />
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
</div>


      <footer className="footer-bar">
        <div>
          <p><strong>Kafetalog d.o.o.</strong></p>
          <p>Adresa: Ulica Španskih Boraca 18, Beograd</p>
          <p>Telefon: +381 11 123 4567</p>
          <p>Email: kontakt@kafetalog.rs</p>
        </div>
        <div>
          <button onClick={() => navigate('/kontakt')}>
            Kontakt stranica
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Katalog;
