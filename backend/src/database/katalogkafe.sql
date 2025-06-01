-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 31, 2025 at 08:09 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `katalogkafe`
--

-- --------------------------------------------------------

--
-- Table structure for table `administratori`
--

CREATE TABLE `administratori` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `administratori`
--

INSERT INTO `administratori` (`id`, `username`, `password_hash`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2b$10$EixZaYVK1fsbw1ZfbX3OXe.Pj1duHc5UuDoqK96X7RGP5/b9hNf2a', '2025-05-28 12:07:36', '2025-05-28 12:07:36');

-- --------------------------------------------------------

--
-- Table structure for table `kategorije`
--

CREATE TABLE `kategorije` (
  `id` int(11) NOT NULL,
  `naziv` varchar(100) NOT NULL,
  `opis` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kategorije`
--

INSERT INTO `kategorije` (`id`, `naziv`, `opis`, `created_at`, `updated_at`) VALUES
(1, 'Espresso', 'Kafe namenjene za pripremu espresa', '2025-05-28 12:07:36', '2025-05-28 12:07:36'),
(2, 'Filter Kafe', 'Kafe za filter aparate', '2025-05-28 12:07:36', '2025-05-28 12:07:36'),
(3, 'Aromatizovane Kafe', 'Kafe sa dodatim aromama', '2025-05-28 12:07:36', '2025-05-28 12:07:36');

-- --------------------------------------------------------

--
-- Table structure for table `mesavina_kategorije`
--

CREATE TABLE `mesavina_kategorije` (
  `id` int(11) NOT NULL,
  `mesavina_id` int(11) DEFAULT NULL,
  `kategorija_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mesavina_kategorije`
--

INSERT INTO `mesavina_kategorije` (`id`, `mesavina_id`, `kategorija_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-05-28 12:07:36', '2025-05-28 12:07:36'),
(2, 1, 3, '2025-05-28 12:07:36', '2025-05-28 12:07:36'),
(7, 1, 1, '2025-05-30 12:45:44', '2025-05-30 12:45:44'),
(8, 2, 1, '2025-05-30 12:45:44', '2025-05-30 12:45:44'),
(12, 12, 1, '2025-05-30 15:57:49', '2025-05-30 15:57:49'),
(13, 13, 1, '2025-05-30 15:57:49', '2025-05-30 15:57:49'),
(14, 14, 3, '2025-05-30 15:57:49', '2025-05-30 15:57:49'),
(16, 29, 3, '2025-05-30 21:45:30', '2025-05-30 21:45:30');

-- --------------------------------------------------------

--
-- Table structure for table `mesavina_sastojci`
--

CREATE TABLE `mesavina_sastojci` (
  `id` int(11) NOT NULL,
  `mesavina_id` int(11) DEFAULT NULL,
  `sastojak_id` int(11) DEFAULT NULL,
  `udeo` decimal(5,2) DEFAULT NULL CHECK (`udeo` > 0 and `udeo` <= 100),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mesavina_sastojci`
--

INSERT INTO `mesavina_sastojci` (`id`, `mesavina_id`, `sastojak_id`, `udeo`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 60.00, '2025-05-28 12:07:36', '2025-05-28 12:07:36'),
(2, 1, 2, 30.00, '2025-05-28 12:07:36', '2025-05-28 12:07:36'),
(3, 1, 4, 5.00, '2025-05-28 12:07:36', '2025-05-28 12:07:36'),
(4, 1, 3, 3.00, '2025-05-28 12:07:36', '2025-05-28 12:07:36'),
(5, 1, 6, 2.00, '2025-05-28 12:07:36', '2025-05-28 12:07:36'),
(35, 10, 5, 40.00, '2025-05-30 15:23:42', '2025-05-30 15:23:42'),
(36, 10, 2, 50.00, '2025-05-30 15:23:42', '2025-05-30 15:23:42'),
(37, 10, 4, 10.00, '2025-05-30 15:23:42', '2025-05-30 15:23:42'),
(45, 12, 1, 100.00, '2025-05-30 15:57:49', '2025-05-30 15:57:49'),
(46, 13, 1, 60.00, '2025-05-30 15:57:49', '2025-05-30 15:57:49'),
(47, 13, 2, 40.00, '2025-05-30 15:57:49', '2025-05-30 15:57:49'),
(48, 14, 1, 50.00, '2025-05-30 15:57:49', '2025-05-30 15:57:49'),
(49, 14, 4, 20.00, '2025-05-30 15:57:49', '2025-05-30 15:57:49'),
(50, 14, 5, 20.00, '2025-05-30 15:57:49', '2025-05-30 15:57:49'),
(51, 14, 6, 10.00, '2025-05-30 15:57:49', '2025-05-30 15:57:49'),
(52, 2, 1, 30.00, '2025-05-30 16:03:45', '2025-05-30 16:03:45'),
(53, 2, 2, 70.00, '2025-05-30 16:03:45', '2025-05-30 16:03:45'),
(70, 28, 2, 30.00, '2025-05-30 21:31:19', '2025-05-30 21:31:19'),
(71, 28, 7, 30.00, '2025-05-30 21:31:19', '2025-05-30 21:31:19'),
(72, 28, 10, 40.00, '2025-05-30 21:31:19', '2025-05-30 21:31:19'),
(73, 29, 8, 70.00, '2025-05-30 21:45:30', '2025-05-30 21:45:30'),
(74, 29, 1, 20.00, '2025-05-30 21:45:30', '2025-05-30 21:45:30'),
(75, 29, 5, 10.00, '2025-05-30 21:45:30', '2025-05-30 21:45:30');

-- --------------------------------------------------------

--
-- Table structure for table `mesavine`
--

CREATE TABLE `mesavine` (
  `id` int(11) NOT NULL,
  `sifra` varchar(20) NOT NULL,
  `naziv` varchar(100) NOT NULL,
  `opis` text DEFAULT NULL,
  `fotografija` varchar(255) DEFAULT NULL,
  `ukupna_cena` decimal(10,2) DEFAULT 0.00,
  `sakriven` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mesavine`
--

INSERT INTO `mesavine` (`id`, `sifra`, `naziv`, `opis`, `fotografija`, `ukupna_cena`, `sakriven`, `created_at`, `updated_at`) VALUES
(1, 'KAF001', 'Classic Mix', 'Klasična kafa sa balansiranom aromom', 'classic.jpg', 1485.00, 0, '2025-05-28 12:07:36', '2025-05-30 14:59:46'),
(2, 'ESP003', 'Toscana Intenso', 'Italijanska tamna mešavina za prave ljubitelje espresa', 'toscana_intenso.jpg', 1150.00, 0, '2025-05-30 12:41:39', '2025-05-30 16:05:52'),
(10, '9', 'Robusta Extra', '', '', 1750.00, 0, '2025-05-30 15:23:42', '2025-05-30 16:05:58'),
(12, 'ESP100', 'Arabica Gold', '100% arabika sa južnoameričkih plantaža', 'arabica_gold.jpg', 1300.00, 0, '2025-05-30 15:57:49', '2025-05-30 16:06:12'),
(13, 'ESP200', 'Strong Blend', 'Mešavina za jaku, punu kafu', 'strong_blend.jpg', 2300.00, 0, '2025-05-30 15:57:49', '2025-05-30 16:06:21'),
(14, 'ARO300', 'Sweet Hazelnut', 'Blaga kafa sa mlekom i aromom lešnika', 'sweet_hazelnut.jpg', 1450.00, 0, '2025-05-30 15:57:49', '2025-05-30 16:06:30'),
(28, '55', 'Robusta Tropic', '', NULL, 1280.00, 0, '2025-05-30 21:31:19', '2025-05-30 21:31:19'),
(29, '01', 'Gold spice', '', NULL, 1880.00, 0, '2025-05-30 21:45:30', '2025-05-30 21:45:30');

-- --------------------------------------------------------

--
-- Table structure for table `sastojci`
--

CREATE TABLE `sastojci` (
  `id` int(11) NOT NULL,
  `naziv` varchar(100) NOT NULL,
  `opis` text DEFAULT NULL,
  `poreklo` varchar(100) DEFAULT NULL,
  `fotografija` varchar(255) DEFAULT NULL,
  `cena_po_kg` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sastojci`
--

INSERT INTO `sastojci` (`id`, `naziv`, `opis`, `poreklo`, `fotografija`, `cena_po_kg`, `created_at`, `updated_at`) VALUES
(1, 'Arabica', 'Najpopularnija vrsta kafe', 'Brazil', 'arabica.jpg', 1200.00, '2025-05-28 12:07:36', '2025-05-30 21:29:47'),
(2, 'Robusta', 'Intenzivniji ukus, manje kiselosti', 'Vijetnam', 'robusta.jpg', 800.00, '2025-05-28 12:07:36', '2025-05-30 21:29:47'),
(3, 'Lešnik aroma', 'Aroma lešnika', 'Italija', 'lesnik.jpg', 1600.00, '2025-05-28 12:07:36', '2025-05-30 21:29:47'),
(4, 'Mleko u prahu', 'Prah za kafu', 'Holandija', 'mleko.jpg', 400.00, '2025-05-28 12:07:36', '2025-05-30 21:29:47'),
(5, 'Cimet', 'Dodaje se za toplu aromu', 'Indonezija', 'cimet.jpg', 2400.00, '2025-05-28 12:07:36', '2025-05-30 21:29:47'),
(6, 'Šećer', 'Sredstvo za zaslađivanje', 'Brazil', 'secer.jpg', 160.00, '2025-05-28 12:07:36', '2025-05-30 21:29:47'),
(7, 'Vanila aroma', 'Aroma vanile', 'Madagaskar', 'vanila.jpg', 1440.00, '2025-05-30 12:43:12', '2025-05-30 21:29:47'),
(8, 'Karamel sirup', 'Slatki karamel sirup', 'Francuska', 'karamel.jpg', 2000.00, '2025-05-30 12:43:12', '2025-05-30 21:29:47'),
(9, 'Čokolada u prahu', 'Gorka čokolada u prahu', 'Belgija', 'cokolada.jpg', 1760.00, '2025-05-30 12:43:12', '2025-05-30 21:29:47'),
(10, 'Kokos aroma', 'Aroma kokosa u prahu', 'Šri Lanka', 'kokos.jpg', 1520.00, '2025-05-30 12:43:12', '2025-05-30 21:29:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `administratori`
--
ALTER TABLE `administratori`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `kategorije`
--
ALTER TABLE `kategorije`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `naziv` (`naziv`),
  ADD KEY `idx_kategorije_naziv` (`naziv`);

--
-- Indexes for table `mesavina_kategorije`
--
ALTER TABLE `mesavina_kategorije`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mesavina_id` (`mesavina_id`),
  ADD KEY `kategorija_id` (`kategorija_id`);

--
-- Indexes for table `mesavina_sastojci`
--
ALTER TABLE `mesavina_sastojci`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mesavina_id` (`mesavina_id`),
  ADD KEY `sastojak_id` (`sastojak_id`);

--
-- Indexes for table `mesavine`
--
ALTER TABLE `mesavine`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sifra` (`sifra`),
  ADD UNIQUE KEY `naziv` (`naziv`),
  ADD KEY `idx_mesavina_naziv` (`naziv`);

--
-- Indexes for table `sastojci`
--
ALTER TABLE `sastojci`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `naziv` (`naziv`),
  ADD KEY `idx_sastojci_naziv` (`naziv`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `administratori`
--
ALTER TABLE `administratori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `kategorije`
--
ALTER TABLE `kategorije`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mesavina_kategorije`
--
ALTER TABLE `mesavina_kategorije`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `mesavina_sastojci`
--
ALTER TABLE `mesavina_sastojci`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `mesavine`
--
ALTER TABLE `mesavine`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `sastojci`
--
ALTER TABLE `sastojci`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `mesavina_kategorije`
--
ALTER TABLE `mesavina_kategorije`
  ADD CONSTRAINT `mesavina_kategorije_ibfk_1` FOREIGN KEY (`mesavina_id`) REFERENCES `mesavine` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `mesavina_kategorije_ibfk_2` FOREIGN KEY (`kategorija_id`) REFERENCES `kategorije` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mesavina_sastojci`
--
ALTER TABLE `mesavina_sastojci`
  ADD CONSTRAINT `mesavina_sastojci_ibfk_1` FOREIGN KEY (`mesavina_id`) REFERENCES `mesavine` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `mesavina_sastojci_ibfk_2` FOREIGN KEY (`sastojak_id`) REFERENCES `sastojci` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
