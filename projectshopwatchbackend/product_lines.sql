-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 10, 2021 at 05:55 AM
-- Server version: 10.4.18-MariaDB
-- PHP Version: 7.4.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shopwatch`
--

-- --------------------------------------------------------

--
-- Table structure for table `product_lines`
--

CREATE TABLE `product_lines` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `product_line` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_lines`
--

INSERT INTO `product_lines` (`id`, `description`, `product_line`) VALUES
(1, 'Dành cho nam giới từ trẻ trung cho đến lịch lãm', 'Nam'),
(2, 'Dành cho nam giới từ trẻ trung cho đến quý phái', 'Nữ');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `product_lines`
--
ALTER TABLE `product_lines`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_aelabbearyuf6fbd59cjpfkbu` (`product_line`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
