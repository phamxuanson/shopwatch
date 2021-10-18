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
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) NOT NULL,
  `buy_price` varchar(255) NOT NULL,
  `product_code` varchar(255) NOT NULL,
  `product_description` varchar(255) DEFAULT NULL,
  `product_image` varchar(255) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_vendor` varchar(255) NOT NULL,
  `quantity_in_stock` varchar(255) NOT NULL,
  `product_line_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `buy_price`, `product_code`, `product_description`, `product_image`, `product_name`, `product_vendor`, `quantity_in_stock`, `product_line_id`) VALUES
(1, '7254800', '3654', 'Loại máy đồng hồ	PinĐối tượng sử dụng	NamModel	GW-9400-1DRNguồn năng lượng dự trữ	PinMàu sắc	Đen', 'http://localhost/shop24h/product_image/dong-ho-casio-GW-9400-1DR.jpg\r\n\r\n', 'Casio GW-9400-1DR', 'Casio', '2654', 1),
(2, '1001700', '3649', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nữ\r\nModel	LTP-1335D-7AVDF\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Trắng', 'http://localhost/shop24h/product_image/dong-ho-casio-ltp-1335d-7avdf-nu.jpg', 'Casio LTP-1335D-7AVDF', 'Casio', '1546', 2),
(3, '1778000', '2654', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	SUNE5005B0\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Bạc', 'http://localhost/shop24h/product_image/dong-ho-orient-sune5005bo.jpg', 'Orient SUNE5005B0', 'Orient', '2649', 1),
(4, '4641000', '9482', 'Loại máy đồng hồ	Automatic\r\nĐối tượng sử dụng	Nam\r\nModel	RA-AC0H01L10B\r\nNguồn năng lượng dự trữ	Automatic\r\nMàu sắc	Xanh', 'http://localhost/shop24h/product_image/dong-ho-orient-ra-ac0h01l10b.jpg', 'Orient RA-AC0H01L10B', 'Orient', '4611', 1),
(5, '791000', '8163', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	DK12109-2\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Bạc', 'http://localhost/shop24h/product_image/dong-ho-daniel-klein-dk12109-2.jpg', 'Daniel Klein DK12109-2', 'Daniel Klein', '1697', 1),
(6, '2905000', '2136', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	F20005/4\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Đen', 'http://localhost/shop24h/product_image/dong-ho-festina-f200054.jpg', 'Festina-F20005/4', 'Festina', '7451', 1),
(7, '612600', '3214', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nữ\r\nModel	LTP-V004D-1B2UDF\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Trắng', 'http://localhost/shop24h/product_image/dong-ho-casio_LTP-V004D-1B.jpg', 'Casio LTP-V004D-1B2UDF ', 'Casio', '0224', 2),
(8, '1001700', '2879', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	AW-80D-7AVDF\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Trắng', 'http://localhost/shop24h/product_image/dong-ho-casio-AW-80D-7AV.jpg', 'CasioAW-80D-7AVDF', 'Casio', '3201', 1),
(9, '2038400', '0482', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nữ\r\nModel	BGD-570-4DR\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Hồng', 'http://localhost/shop24h/product_image/dong-ho-casio-bdg-570-4dr-nu.jpg', 'CasioBGD-570-4DR', 'Casio', '3657', 2),
(10, '2539600', '7513', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nữ\r\nModel	BGA-150FL-1ADR\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Đen', 'http://localhost/shop24h/product_image/dong-ho-casio-BGA-150FL-1ADF.jpg', 'Casio BGA-150FL-1ADR', 'Casio', '0364', 2),
(11, '3040100', '9872', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	BGA-195-1ADR\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Đen', 'http://localhost/shop24h/product_image/dong-ho-casio-BGA-195-1A.jpg', 'CasioBGA-195-1ADR', 'Casio', '1023', 1),
(12, '3040100', '4513', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nữ\r\nModel	BGA-230PC-9BDR\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Tím+Vàng', 'http://localhost/shop24h/product_image/dong-ho-casio-bga-230pc-9bdr-nu.jpg', 'Casio BGA-230PC-9BDR', 'Casio', '1112', 2),
(13, '2038400', '0324', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nữ\r\nModel	BGD-570-1DR\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Đen', 'http://localhost/shop24h/product_image/dong-ho-casio-BGD-570-1DR.jpg', 'Casio BGD-570-1DR', 'Casio', '0010', 2),
(14, '2500400', '6985', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	GMA-S140-1ADR\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Đen', 'http://localhost/shop24h/product_image/dong-ho-casio-GMA-S140-1ADR.jpg', 'Casio GMA-S140-1ADR', 'Casio', '3789', 1),
(15, '570500', '3647', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nữ\r\nModel	LTP-V006L-7B2UDF\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Trắng', 'http://localhost/shop24h/product_image/dong-ho-casio-ltp-v006l-7b2udf-nu.jpg', 'Casio LTP-V006L-7B2UDF', 'Casio', '3655', 2),
(16, '690900', '0021', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	MTP-1130A-1ARDF\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Trắng', 'http://localhost/shop24h/product_image/dong-ho-casio-MTP-1130A-1A.jpg', 'CasioMTP-1130A-1ARDF', 'Casio', '9982', 1),
(17, '898100', '3325', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	MTP-1302D-7A1VDF\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Trắng', 'http://localhost/shop24h/product_image/dong-ho-casio-MTP-1302D-7A1VDF.jpg', 'Casio MTP-1302D-7A1VDF', 'Casio', '3366', 1),
(18, '1071000', '9952', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nữ\r\nModel	MTP-V300L-2AUDF\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Đen', 'http://localhost/shop24h/product_image/dong-ho-casio-mtp-v300l-2audf-nu.jpg', 'Casio MTP-V300L-2AUDF', 'Casio', '3012', 2),
(19, '1019200', '3801', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	MTP-VD01G-9EVUDF\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Vàng', 'http://localhost/shop24h/product_image/dong-ho-casio-MTP-VD01G-9EV.jpg', 'CasioMTP-VD01G-9EVUDF', 'Casio', '3312', 1),
(20, '882000', '0364', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	DK11820-3\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Bạc', 'http://localhost/shop24h/product_image/dong-ho-daniel-klein-dk11820-3.jpg', 'Daniel Klein DK11820-3', 'Daniel Klein', '5563', 1),
(21, '672000', '8862', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	DK12121-5\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Xanh', 'http://localhost/shop24h/product_image/dong-ho-daniel-klein-dk12121-5.jpg', 'Daniel Klein DK12121-5', 'Daniel Klein', '0123', 1),
(22, '672000', '0356', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	DK12121-6\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Xanh', 'http://localhost/shop24h/product_image/dong-ho-daniel-klein-dk12121-6.jpg', 'Daniel Klein DK12121-6', 'Daniel Klein', '4425', 1),
(23, '868000', '9871', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nữ\r\nModel	DK.1.12364.5\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Vàng', 'http://localhost/shop24h/product_image/dong-ho-daniel-klein-dk112364-5-nu.jpg', 'Daniel Klein DK.1.12364-5', 'Daniel Klein', '1023', 2),
(24, '931000', '6621', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nữ\r\nModel	DK.1.12372.6\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Vàng hồng', 'http://localhost/shop24h/product_image/dong-ho-daniel-klein-dk112372-6-nu.jpg', 'Daniel Klein DK.1.12372-6', 'Daniel Klein', '1152', 2),
(25, '721000', '0326', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nữ\r\nModel	DK.1.12375.6\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Vàng hồng', 'http://localhost/shop24h/product_image/dong-ho-daniel-klein-dk112375-6-nu.jpg', 'Daniel Klein DK.1.12375-6', 'Daniel Klein', '6965', 2),
(26, '2905000', '0365', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	F20005/3\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Xanh', 'http://localhost/shop24h/product_image/dong-ho-festina-f200053.jpg', 'Festina F20005/3', 'Festina', '1203', 1),
(27, '2905000', '2258', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nữ\r\nModel	F20006/3\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Xanh', 'http://localhost/shop24h/product_image/dong-ho-festina-f200063-nu.jpg', 'Festina F20006/3', 'Festina', '0369', 2),
(28, '2905000', '3100', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nữ\r\nModel	F20006/4\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Đen', 'http://localhost/shop24h/product_image/dong-ho-festina-f200064-nu.jpg', 'Festina F20006/4', 'Festina', '7741', 2),
(29, '2674000', '0649', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	F20007/3\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Xanh', 'http://localhost/shop24h/product_image/dong-ho-festina-f200073.jpg', 'Festina F20007/3', 'Festina', '1203', 1),
(30, '1652000', '0333', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	FUNG2001B0\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Bạc', 'http://localhost/shop24h/product_image/dong-ho-orient-fung2001b0.jpg', 'Orient FUNG2001B0', 'Orient', '4410', 1),
(31, '1652000', '8852', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	FUNG2001D0\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Bạc', 'http://localhost/shop24h/product_image/dong-ho-orient-fung2001d0.jpg', 'Orient FUNG2001D0', 'Orient', '0100', 1),
(32, '1652000', '0311', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	FUNG2002W0\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Bạc', 'http://localhost/shop24h/product_image/dong-ho-orient-fung2002w0.jpg', 'Orient FUNG2002W0', 'Orient', '6652', 1),
(33, '2667000', '0005', 'Loại máy đồng hồ	Automatic\r\nĐối tượng sử dụng	Nam\r\nModel	RA-AB0F08E19B\r\nNguồn năng lượng dự trữ	Automatic\r\nMàu sắc	Xanh', 'http://localhost/shop24h/product_image/dong-ho-orient-ra-ab0f08e19b.jpg', 'Orient RA-AB0F08E19B', 'Orient', '2252', 1),
(34, '2667000', '7741', 'Loại máy đồng hồ	Automatic\r\nĐối tượng sử dụng	Nam\r\nModel	RA-AB0F12S19B\r\nNguồn năng lượng dự trữ	Automatic\r\nMàu sắc	Đen', 'http://localhost/shop24h/product_image/dong-ho-orient-ra-ab0f12s19b.jpg', 'Orient RA-AB0F12S19B', 'Orient', '5520', 1),
(35, '2989000', '0091', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nữ\r\nModel	RA-QC1701L10B\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Xanh', 'http://localhost/shop24h/product_image/dong-ho-orient-ra-qc1701l10b-nu.jpg', 'Orient RA-QC1701L10B', 'Orient', '7521', 2),
(36, '2989000', '1239', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nữ\r\nModel	RA-QC1702S10B\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Trắng', 'http://localhost/shop24h/product_image/dong-ho-orient-ra-qc1702s10b-nu.jpg', 'Orient RA-QC1702S10B', 'Orient', '3367', 2),
(37, '2226000', '2251', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	RF-QD0002B10B\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Đen', 'http://localhost/shop24h/product_image/dong-ho-orient-rf-qa0002b10b.jpg', 'Orient RF-QD0002B10B', 'Orient', '3302', 1),
(38, '2226000', '9992', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	RF-QD0007B10B\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Đen', 'http://localhost/shop24h/product_image/dong-ho-orient-rf-qa0007b10b.jpg', 'Orient RF-QD0007B10B', 'Orient', '3698', 1),
(39, '1715000', '5548', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nữ\r\nModel	SSZ3W004W0\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Bạc', 'http://localhost/shop24h/product_image/dong-ho-orient-ssz3w004w0-nu.jpg', 'Orient SSZ3W004W0', 'Orient', '1597', 2),
(40, '1778000', '3578', 'Loại máy đồng hồ	Pin\r\nĐối tượng sử dụng	Nam\r\nModel	SUND6003W0\r\nNguồn năng lượng dự trữ	Pin\r\nMàu sắc	Bạc', 'http://localhost/shop24h/product_image/dong-ho-orient-sund6003w0.jpg', 'Orient SUND6003W0', 'Orient', '7521', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_922x4t23nx64422orei4meb2y` (`product_code`),
  ADD KEY `FK1eicg1yvaxh1gqdp2lsda7vlv` (`product_line_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `FK1eicg1yvaxh1gqdp2lsda7vlv` FOREIGN KEY (`product_line_id`) REFERENCES `product_lines` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
