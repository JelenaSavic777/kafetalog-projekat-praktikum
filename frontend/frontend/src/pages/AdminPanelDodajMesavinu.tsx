import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Sastojak {
  id: number;
  naziv: string;
}

interface Kategorija {
  id: number;
  naziv: string;
}

export function AdminPanel() {
  const navigate = useNavigate();

  const [sifra, setSifra] = useState('');
  const [naziv, setNaziv] = useState('');
  const [opis, setOpis] = useState('');
  const [fotografija, setFotografija] = useState('');
  const [sastojci, setSastojci] = useState<{ id: number; udeo: number }[]>([]);
  const [kategorije, setKategorije] = useState<number[]>([]);

  const [sviSastojci, setSviSastojci] = useState<Sastojak[]>([]);
  const [sveKategorije, setSveKategorije] = useState<Kategorija[]>([]);

  useEffect(() => {
    fetch('/api/sastojci')
      .then((res) => res.json())
      .then(setSviSastojci);
    fetch('/api/kategorije')
      .then((res) => res.json())
      .then(setSveKategorije);
  }, []);

  const dodajSastojak = () => {
    setSastojci([...sastojci, { id: 0, udeo: 0 }]);
  };

  const izmeniSastojak = (index: number, key: 'id' | 'udeo', value: number) => {
    const novi = [...sastojci];
    novi[index][key] = value;
    setSastojci(novi);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const res = await fetch('/api/mesavine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sifra, naziv, opis, fotografija, sastojci, kategorije }),
  });
  const data = await res.json();
  if (res.ok) {
    alert('Mešavina uspešno dodata');
    
    // Otvori katalog u novom tabu
    window.open('/', '_blank');

    // Preusmeri na admin dashboard
    navigate('/admin');
  } else {
    alert(data.error || 'Greška prilikom dodavanja');
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Dodavanje nove mešavine</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input value={sifra} onChange={(e) => setSifra(e.target.value)} required placeholder="Šifra" className="border p-3 rounded-lg w-full" />
            <input value={naziv} onChange={(e) => setNaziv(e.target.value)} required placeholder="Naziv" className="border p-3 rounded-lg w-full" />
            <input value={fotografija} onChange={(e) => setFotografija(e.target.value)} placeholder="Fotografija (URL)" className="border p-3 rounded-lg w-full" />
            <textarea value={opis} onChange={(e) => setOpis(e.target.value)} placeholder="Opis" className="border p-3 rounded-lg w-full col-span-2" />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Sastojci:</h3>
            {sastojci.map((s, i) => (
              <div key={i} className="flex gap-4 mb-2">
                <select
                  value={s.id}
                  onChange={(e) => izmeniSastojak(i, 'id', Number(e.target.value))}
                  className="border p-2 rounded w-1/2"
                >
                  <option value={0}>Odaberi sastojak</option>
                  {sviSastojci.map((s) => (
                    <option key={s.id} value={s.id}>{s.naziv}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={s.udeo}
                  onChange={(e) => izmeniSastojak(i, 'udeo', Number(e.target.value))}
                  placeholder="Udeo %"
                  className="border p-2 rounded w-1/2"
                />
              </div>
            ))}
            <button type="button" onClick={dodajSastojak} className="text-blue-600 hover:underline">+ Dodaj sastojak</button>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Kategorije:</h3>
            <div className="flex flex-wrap gap-4">
              {sveKategorije.map((k) => (
                <label key={k.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={k.id}
                    checked={kategorije.includes(k.id)}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setKategorije((prev) =>
                        prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]
                      );
                    }}
                  />
                  {k.naziv}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
            Sačuvaj mešavinu
          </button>
        </form>
      </div>
    </div>
  );
}
