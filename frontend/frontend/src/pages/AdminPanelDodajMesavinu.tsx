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

export function AdminPanelDodajMesavinu() {
  const navigate = useNavigate();

  const [sifra, setSifra] = useState('');
  const [naziv, setNaziv] = useState('');
  const [opis, setOpis] = useState('');
  const [fotografija, setFotografija] = useState('');
  const [sastojci, setSastojci] = useState<{ id: number; udeo: number }[]>([]);
  const [kategorijaId, setKategorijaId] = useState<number | null>(null);

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

    if (kategorijaId === null) {
      alert('Molimo odaberite kategoriju.');
      return;
    }

    const totalUdeo = sastojci.reduce((sum, s) => sum + s.udeo, 0);
    if (totalUdeo !== 100) {
      alert(`Ukupan udeo sastojaka mora biti 100%. Trenutno: ${totalUdeo}%`);
      return;
    }

    if (sastojci.some((s) => s.id === 0)) {
      alert('Molimo odaberite validne sastojke.');
      return;
    }

    const res = await fetch('/api/mesavine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sifra,
        naziv,
        opis,
        sastojci,
        kategorije: [kategorijaId],
        fotografija: fotografija.trim() !== '' ? fotografija.trim() : null,
      }),
    });

    let data;
    try {
      const contentType = res.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        alert(`Neočekivan odgovor servera:\n${text}`);
        return;
      }
    } catch{
      alert('Greška prilikom obrade odgovora sa servera.');
      return;
    }

    if (res.ok) {
      alert('Mešavina uspešno dodata');
      window.open('/', '_blank');
      navigate('/admin');
    } else {
      alert(data?.error || 'Greška prilikom dodavanja');
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
            <textarea value={opis} onChange={(e) => setOpis(e.target.value)} placeholder="Opis" className="border p-3 rounded-lg w-full col-span-2" />
            <input
              value={fotografija}
              onChange={(e) => setFotografija(e.target.value)}
              placeholder="URL fotografije (opciono)"
              className="border p-3 rounded-lg w-full col-span-2"
            />
            {fotografija.trim() && (
              <img
                src={fotografija}
                alt="Pregled slike"
                className="w-40 h-40 object-cover rounded-lg border"
              />
            )}
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
  <h3 className="font-semibold mb-2">Kategorija:</h3>
  {sveKategorije.length === 0 ? (
    <p className="text-gray-500">Učitavanje kategorija...</p>
  ) : (
    <select
      value={kategorijaId ?? ''}
      onChange={(e) => {
        const selected = e.target.value;
        setKategorijaId(selected ? Number(selected) : null);
      }}
      className="border p-3 rounded-lg w-full"
      required
    >
      <option value="">Odaberi kategoriju</option>
      {sveKategorije.map((k) => (
        <option key={k.id} value={k.id}>
          {k.naziv}
        </option>
      ))}
    </select>
  )}
</div>


          <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
            Sačuvaj mešavinu
          </button>
        </form>
      </div>
    </div>
  );
}
