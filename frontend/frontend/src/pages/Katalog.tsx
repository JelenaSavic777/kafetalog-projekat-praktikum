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
    : selectedCategoryId === null
      ? sveMesavine
      : kategorije.find(k => k.id === selectedCategoryId)?.mesavine
          ?.filter((mesavina, index, self) =>
            index === self.findIndex(m => m.id === mesavina.id)
          ) ?? [];

  return (
    <div className="katalog-wrapper" style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
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

      {loading && <p className="loading-text">Učitavanje...</p>}
      {error && <p className="error-text">{error}</p>}

      {/* Glavni grid sa 3 kolone */}
      <div className="grid-container" style={{flex: 1, display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', gap: '1rem', padding: '1rem'}}>
        {!filterMode && (
          <div className="kategorije-lista" style={{borderRight: '1px solid #ccc', paddingRight: '1rem'}}>
            <h3>Kategorije</h3>
            <div
              key={0}
              className={`kategorija-item ${selectedCategoryId === null ? 'aktivna' : ''}`}
              onClick={() => {
                setSelectedCategoryId(null);
                setFilter('');
                setFilterMode(false);
                setSelectedMesavina(null);
              }}
              style={{cursor: 'pointer', padding: '0.5rem 0'}}
            >
              Sve kategorije
            </div>

            {kategorije.map(k => (
              <div
                key={k.id}
                className={`kategorija-item ${selectedCategoryId === k.id ? 'aktivna' : ''}`}
                onClick={() => {
                  setSelectedCategoryId(k.id);
                  setFilter('');
                  setFilterMode(false);
                  setSelectedMesavina(null);
                }}
                style={{cursor: 'pointer', padding: '0.5rem 0'}}
              >
                <div className="kategorija-naziv">{k.naziv}</div>
                <div className="kategorija-opis">{k.opis}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mesavine-lista" style={{overflowY: 'auto'}}>
          {filterMode && (
            <>
              {filtriraneKategorije.length > 0 && (
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
                        style={{cursor: 'pointer'}}
                      >
                        {k.naziv}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {filtriraneMesavine.length === 0 && !loading && (
                <p className="nema-mešavina-tekst">Nema mešavina koje odgovaraju filteru.</p>
              )}
              {filtriraneMesavine.map(m => (
                <div
                  key={m.id}
                  className={`mesavina-kartica ${selectedMesavina?.id === m.id ? 'aktivna' : ''}`}
                  onClick={() => setSelectedMesavina(m)}
                  style={{cursor: 'pointer', border: '1px solid #ddd', marginBottom: '0.5rem', padding: '0.5rem', display: 'flex', gap: '1rem'}}
                >
                  <img src={m.fotografija} alt={m.naziv} className="mesavina-slika" style={{width: '280px', height: '280px', objectFit: 'cover'}} />
                  <div>
                    <h3 className="mesavina-naziv">{m.naziv}</h3>
                    <p className="mesavina-opis">{m.opis}</p>
                    <p className="mesavina-cena">
                      Cena: {typeof m.cena === 'number' ? m.cena.toFixed(2) : 'N/A'} RSD
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}

          {!filterMode && (
            <>
              {mesavineZaPrikaz.length === 0 && !loading && (
                <p className="nema-mešavina-tekst">Nema mešavina za prikaz.</p>
              )}
              {mesavineZaPrikaz.map(m => (
                <div
                  key={m.id}
                  className={`mesavina-kartica ${selectedMesavina?.id === m.id ? 'aktivna' : ''}`}
                  onClick={() => setSelectedMesavina(m)}
                  style={{cursor: 'pointer', border: '1px solid #ddd', marginBottom: '0.5rem', padding: '0.5rem', display: 'flex', gap: '1rem'}}
                >
                  <img src={m.fotografija} alt={m.naziv} className="mesavina-slika" style={{width: '80px', height: '80px', objectFit: 'cover'}} />
                  <div>
                    <h3 className="mesavina-naziv">{m.naziv}</h3>
                    <p className="mesavina-opis">{m.opis}</p>
                    <p className="mesavina-cena">
                      Cena: {typeof m.cena === 'number' ? m.cena.toFixed(2) : 'N/A'} RSD
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="detalji-mesavine" style={{borderLeft: '1px solid #ccc', paddingLeft: '1rem', overflowY: 'auto'}}>
          {!selectedMesavina && <p>Izaberite mešavinu za detalje</p>}
          {selectedMesavina && (
            <>
              <h2 className="detalji-naziv">{selectedMesavina.naziv}</h2>
              <img
                src={selectedMesavina.fotografija}
                alt={selectedMesavina.naziv}
                className="detalji-slika"
                style={{width: '100%', maxHeight: '200px', objectFit: 'cover'}}
              />
              <p className="detalji-opis">{selectedMesavina.opis}</p>
              <p className="detalji-cena">
                <strong>Cena:</strong> {typeof selectedMesavina.cena === 'number' ? selectedMesavina.cena.toFixed(2) : 'N/A'} RSD
              </p>

              <h3>Sastojci</h3>
              <ul className="sastojci-lista" style={{listStyle: 'none', paddingLeft: 0}}>
                {selectedMesavina.sastojci.map((s, index) => {
                  const udeoNum = Number(s.udeo);
                  const cenaNum = Number(s.cenaPoKg);

                  return (
                    <li key={`${s.id}-${index}`} className="sastojak-item" style={{marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem'}}>
                      <div className="sastojak-naslov">
                        <strong>{s.naziv}</strong> ({!isNaN(udeoNum) ? udeoNum.toFixed(1) : 'N/A'}%) - {!isNaN(cenaNum) ? cenaNum.toFixed(2) : 'N/A'} RSD/kg
                      </div>
                      <div className="sastojak-opis">{s.opis}</div>
                      <div className="sastojak-poreklo">Poreklo: {s.poreklo}</div>
                      <img src={s.fotografija} alt={s.naziv} className="sastojak-slika" style={{width: '100px', height: '100px', objectFit: 'cover', marginTop: '0.5rem'}} />
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Footer na dnu */}
      <footer className="footer-bar" style={{background: '#f5f5f5', padding: '1rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #ddd'}}>
        <div>
          <p><strong>Kafetalog d.o.o.</strong></p>
          <p>Adresa: Ulica Španskih Boraca 18, Beograd</p>
          <p>Telefon: +381 11 123 4567</p>
          <p>Email: kontakt@kafetalog.rs</p>
        </div>
        <div>
          <button onClick={() => navigate('/kontakt')} style={{cursor: 'pointer', padding: '0.5rem 1rem'}}>
            Kontakt stranica
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Katalog;
