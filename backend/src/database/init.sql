-- Kreiraj bazu
DROP DATABASE IF EXISTS KatalogKafe;
CREATE DATABASE KatalogKafe;
USE KatalogKafe;

-- Tabela: kategorije
CREATE TABLE kategorije (
  id INT AUTO_INCREMENT PRIMARY KEY,
  naziv VARCHAR(100) NOT NULL UNIQUE,
  opis TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela: sastojci
CREATE TABLE sastojci (
  id INT AUTO_INCREMENT PRIMARY KEY,
  naziv VARCHAR(100) NOT NULL UNIQUE,
  opis TEXT,
  poreklo VARCHAR(100),
  fotografija VARCHAR(255),
  cena_po_kg DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela: mesavine
CREATE TABLE mesavine (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sifra VARCHAR(20) NOT NULL UNIQUE,
  naziv VARCHAR(100) NOT NULL UNIQUE,
  opis TEXT,
  fotografija VARCHAR(255),
  ukupna_cena DECIMAL(10,2) DEFAULT 0.00,
  sakriven BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela: mesavina_sastojci
CREATE TABLE mesavina_sastojci (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mesavina_id INT,
  sastojak_id INT,
  udeo DECIMAL(5,2) CHECK (udeo > 0 AND udeo <= 100),
  FOREIGN KEY (mesavina_id) REFERENCES mesavine(id) ON DELETE CASCADE,
  FOREIGN KEY (sastojak_id) REFERENCES sastojci(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela: mesavina_kategorije
CREATE TABLE mesavina_kategorije (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mesavina_id INT,
  kategorija_id INT,
  FOREIGN KEY (mesavina_id) REFERENCES mesavine(id) ON DELETE CASCADE,
  FOREIGN KEY (kategorija_id) REFERENCES kategorije(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela: administratori
CREATE TABLE administratori (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexi
CREATE INDEX idx_mesavina_naziv ON mesavine (naziv);
CREATE INDEX idx_sastojci_naziv ON sastojci (naziv);
CREATE INDEX idx_kategorije_naziv ON kategorije (naziv);

-- INSERT: kategorije
INSERT INTO kategorije (naziv, opis) VALUES
('Espresso', 'Kafe namenjene za pripremu espresa'),
('Filter Kafe', 'Kafe za filter aparate'),
('Aromatizovane Kafe', 'Kafe sa dodatim aromama');

-- INSERT: sastojci
INSERT INTO sastojci (naziv, opis, poreklo, fotografija, cena_po_kg) VALUES
('Arabica', 'Najpopularnija vrsta kafe', 'Brazil', 'arabica.jpg', 15.00),
('Robusta', 'Intenzivniji ukus, manje kiselosti', 'Vijetnam', 'robusta.jpg', 10.00),
('Liberica', 'Specifična aroma i retkost', 'Filipini', 'liberica.jpg', 18.00),
('Lešnik aroma', 'Aroma lešnika', 'Italija', 'lesnik.jpg', 20.00),
('Mleko u prahu', 'Prah za kafu', 'Holandija', 'mleko.jpg', 5.00),
('Zaslađivač', 'Zamena za šećer', 'Kina', 'zasladjivac.jpg', 8.00);

-- INSERT: mesavine
INSERT INTO mesavine (sifra, naziv, opis, fotografija) VALUES
('ESP001', 'Espresso Premium', 'Mešavina arabike i robuste za jak espreso', 'esp_premium.jpg'),
('ARO002', 'Aroma Lešnik Mix', 'Blaga kafa sa lešnikom i mlekom', 'aroma_lesnik.jpg');

-- INSERT: mesavina_sastojci
-- Mešavina 1: Espresso Premium (id=1)
INSERT INTO mesavina_sastojci (mesavina_id, sastojak_id, udeo) VALUES
(1, 1, 60.00), -- Arabica
(1, 2, 30.00), -- Robusta
(1, 3, 10.00); -- Liberica

-- Mešavina 2: Aroma Lešnik Mix (id=2)
INSERT INTO mesavina_sastojci (mesavina_id, sastojak_id, udeo) VALUES
(2, 1, 50.00), -- Arabica
(2, 4, 20.00), -- Lešnik aroma
(2, 5, 20.00), -- Mleko u prahu
(2, 6, 10.00); -- Zaslađivač

-- INSERT: mesavina_kategorije
INSERT INTO mesavina_kategorije (mesavina_id, kategorija_id) VALUES
(1, 1), -- Espresso
(2, 3); -- Aromatizovane kafe

-- INSERT: administrator (korisničko ime: admin, lozinka: admin123)
INSERT INTO administratori (username, password_hash)
VALUES ('admin', '$2b$10$E6zUPBssP6W4vhgPZ1YwQew4a4dyIEg7zKqWf.z4v5sU1PyYtKP7e');
