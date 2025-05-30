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

        if (data.length > 0) setSelectedCategoryId(data[0].id);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Nešto je pošlo po zlu');
      } finally {
        setLoading(false);
      }
    };
    fetchKatalog();
  }, []);

  const sveMesavine = kategorije.flatMap(k => k.mesavine);

  const filtriraneMesavine = sveMesavine.filter(mesavina => {
    if (filter.trim() === '') return true;

    const f = filter.toLowerCase();

    if (mesavina.naziv.toLowerCase().includes(f)) return true;
    if (mesavina.opis && mesavina.opis.toLowerCase().includes(f)) return true;
    if (mesavina.sastojci.some(s =>
      s.naziv.toLowerCase().includes(f) ||
      (s.opis && s.opis.toLowerCase().includes(f))
    )) return true;
    if (mesavina.kategorije?.some(kat => kat.toLowerCase().includes(f))) return true;

    return false;
  });

  const filtriraneKategorije = kategorije.filter(kat => {
    if (filter.trim() === '') return false;
    const f = filter.toLowerCase();
return kat.naziv.toLowerCase().includes(f) || (typeof kat.opis === 'string' && kat.opis.toLowerCase().includes(f));
  });

  const mesavineZaPrikaz = filterMode
    ? filtriraneMesavine
    : kategorije.find(k => k.id === selectedCategoryId)?.mesavine ?? [];

  return (
    <div className="katalog-wrapper">
      <div className="nav-bar">
        <button onClick={() => navigate('/login')}>Login</button>
      </div>

      <h1>Katalog Kafe</h1>

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
          title="Pretraži"
          aria-label="Pretraži"
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

      {loading && <p>Učitavanje...</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid-container">
        {/* LEVO: kategorije samo ako nije filterMode */}
        {!filterMode && (
          <div className="kategorije-lista">
            <h3>Kategorije</h3>
            {kategorije.map(k => (
              <div
                key={k.id}
                className={`kategorija-item ${selectedCategoryId === k.id ? 'aktivna' : ''}`}
                onClick={() => {
                  setSelectedCategoryId(k.id);
                  setSelectedMesavina(null);
                  setFilter('');
                  setFilterMode(false);
                }}
              >
                <div className="kategorija-naziv">{k.naziv}</div>
                <div className="kategorija-opis">{k.opis}</div>
              </div>
            ))}
          </div>
        )}

        
        <div className="mesavine-lista">
          {filterMode && (
            <>
              {/* Prikaži filtrirane kategorije */}
              {filtriraneKategorije.length > 0 && (
                <div className="filtrirane-kategorije">
                  <h3>Filtrirane kategorije:</h3>
                  <ul>
                    {filtriraneKategorije.map(k => (
                      <li
                        key={k.id}
                        style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: 6 }}
                        onClick={() => {
                          setSelectedCategoryId(k.id);
                          setFilter('');
                          setFilterMode(false);
                          setSelectedMesavina(null);
                        }}
                      >
                        {k.naziv}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prikaži filtrirane mešavine */}
              {filtriraneMesavine.length > 0 && (
                <div className="filtrirane-mesavine">
                  <h3>Filtrirane mešavine:</h3>
                  <div className="mesavine-lista-grid">
                    {filtriraneMesavine.map(m => (
                      <div
                        key={m.id}
                        className={`mesavina-kartica ${selectedMesavina?.id === m.id ? 'aktivna' : ''}`}
                        onClick={() => setSelectedMesavina(m)}
                      >
                        <img src={m.fotografija} alt={m.naziv} />
                        <h3>{m.naziv}</h3>
                        <p>{m.opis}</p>
                        <p>
                          <strong>Cena:</strong>{' '}
                          {typeof m.cena === 'number' ? m.cena.toFixed(2) : 'N/A'} RSD
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ako nema rezultata */}
              {filtriraneMesavine.length === 0 && filtriraneKategorije.length === 0 && (
                <p>Nema rezultata za "{filter}"</p>
              )}
            </>
          )}

          {!filterMode && (
            <>
              {mesavineZaPrikaz.length === 0 && !loading && (
                <p>Nema mešavina za prikaz.</p>
              )}
              {mesavineZaPrikaz.map((m, index) => (
                <div
                  key={`${m.id}-${index}`}
                  className={`mesavina-kartica ${selectedMesavina?.id === m.id ? 'aktivna' : ''}`}
                  onClick={() => setSelectedMesavina(m)}
                >
                  <img src={m.fotografija} alt={m.naziv} />
                  <h3>{m.naziv}</h3>
                  <p>{m.opis}</p>
                  <p>
                    <strong>Cena:</strong>{' '}
                    {typeof m.cena === 'number' ? m.cena.toFixed(2) : 'N/A'} RSD
                  </p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* DESNO: detalji selektovane mešavine */}
        <div className="mesavina-detalji">
          {selectedMesavina ? (
            <div>
              <h2>{selectedMesavina.naziv}</h2>
              <img src={selectedMesavina.fotografija} alt={selectedMesavina.naziv} />
              <p>{selectedMesavina.opis}</p>
              <h3>Sastojci:</h3>
              <ul>
                {selectedMesavina.sastojci.map(s => (
                  <li key={s.id} className="sastojak-item">
                    <img src={s.fotografija} alt={s.naziv} />
                    <div>
                      <div><strong>{s.naziv}</strong></div>
                      <div>{s.opis}</div>
                      <div><em>Poreklo:</em> {s.poreklo}</div>
                      <div>
                        <em>Cena/kg:</em>{' '}
                        {typeof s.cenaPoKg === 'number' ? s.cenaPoKg.toFixed(2) : 'N/A'} RSD
                      </div>
                      <div><em>Udeo u mešavini:</em> {s.udeo}%</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Kliknite na mešavinu da vidite detalje.</p>
          )}
        </div>
      </div>

      <footer className="footer-bar">
        <div>
          <p><strong>Kafetalog d.o.o.</strong></p>
          <p>Adresa: Ulica Španskih boraca 18, Beograd</p>
          <p>Telefon: +381 11 123 4567</p>
          <p>Email: kontakt@kafetalog.rs</p>
        </div>
        <button onClick={() => navigate('/kontakt')}>Kontakt stranica</button>
      </footer>
    </div>
  );
};

export default Katalog;
