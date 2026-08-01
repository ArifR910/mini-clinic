-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 01, 2026 at 05:18 PM
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
-- Database: `mini_clinic_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `polyclinic_id` int(11) NOT NULL,
  `specialization` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `user_id`, `polyclinic_id`, `specialization`) VALUES
(1, 1, 1, 'Dokter Umum'),
(2, 1, 2, 'Dokter Gigi');

-- --------------------------------------------------------

--
-- Table structure for table `medical_records`
--

CREATE TABLE `medical_records` (
  `id` int(11) NOT NULL,
  `registration_id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `subjective` text NOT NULL,
  `systolic` int(11) DEFAULT NULL,
  `diastolic` int(11) DEFAULT NULL,
  `body_temperature` decimal(4,1) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `assessment` text NOT NULL,
  `plan` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medical_records`
--

INSERT INTO `medical_records` (`id`, `registration_id`, `patient_id`, `doctor_id`, `subjective`, `systolic`, `diastolic`, `body_temperature`, `weight`, `height`, `assessment`, `plan`, `created_at`) VALUES
(2, 1, 1, 1, 'Pasien mengeluh pusing dan demam sejak kemarin.', 120, 80, 38.5, 65.00, 170.00, 'Febris / Demam Dengue', 'Paracetamol 500mg 3x1, istirahat cukup, minum air putih 2L per hari.', '2026-07-31 07:54:29'),
(3, 5, 2, 1, 'oke emang stress', 111, 55, 45.0, 45.00, 167.00, 'stress aja dia', 'jangan stress', '2026-08-01 09:42:34'),
(10, 6, 5, 1, 'gigi', 123, 77, 40.0, 57.00, 155.00, 'gigi', 'gigi', '2026-08-01 11:21:01'),
(14, 7, 1, 1, 'iya dia emang pusing', 123, 67, 39.0, 67.00, 167.00, 'wahh ini mah beneran pusing', 'jauhi pusing', '2026-08-01 12:23:27'),
(15, 8, 6, 1, 'perut sakit katanya', 122, 80, 33.0, 33.00, 165.00, 'sakit perut', 'BAB secara berkala', '2026-08-01 14:09:06');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` int(11) NOT NULL,
  `mr_number` varchar(20) NOT NULL,
  `nik` varchar(16) NOT NULL,
  `name` varchar(100) NOT NULL,
  `gender` enum('L','P') NOT NULL,
  `birth_date` date NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `mr_number`, `nik`, `name`, `gender`, `birth_date`, `phone`, `address`, `created_at`) VALUES
(1, 'RM-2026-0001', '3201123456780001', 'Budi Santoso, S.Kom', 'L', '1990-05-15', '081234567899', 'Jl. Merdeka No. 123, Bandung (Alamat Baru)', '2026-07-31 07:48:22'),
(2, 'RM-2026-0002', '367676767676767', 'Arif O YEAY', 'L', '1967-07-06', '0867676767', 'dimana aja boleh yang penting happy', '2026-07-31 12:53:27'),
(4, 'RM-2026-0004', '123434311213213', 'suryandini', 'P', '1900-12-15', '089872836213', 'luar pulau jawa', '2026-07-31 13:08:19'),
(5, 'RM-2026-0005', '21313123143143', 'Lengkap', 'L', '1911-11-11', '088888888', 'alamat juga lengkap', '2026-08-01 07:54:44'),
(6, 'RM-2026-0006', '1010101010101', 'tono', 'L', '1921-02-13', '0825252525', 'disana', '2026-08-01 12:38:55'),
(7, 'RM-2026-0007', '077729319921', 'boni', 'L', '2001-04-21', '231453454352', 'disitu', '2026-08-01 12:39:41'),
(8, 'RM-2026-0008', '6666883812368', 'doni', 'L', '2002-02-11', '0867676767231', 'di sebelah sana deket situ', '2026-08-01 12:42:43');

-- --------------------------------------------------------

--
-- Table structure for table `polyclinics`
--

CREATE TABLE `polyclinics` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `polyclinics`
--

INSERT INTO `polyclinics` (`id`, `name`) VALUES
(1, 'Poli Umum'),
(2, 'Poli Gigi'),
(3, 'Poli Anak');

-- --------------------------------------------------------

--
-- Table structure for table `prescriptions`
--

CREATE TABLE `prescriptions` (
  `id` int(11) NOT NULL,
  `medical_record_id` int(11) NOT NULL,
  `medicine_name` varchar(255) NOT NULL,
  `dosage` varchar(100) NOT NULL,
  `instructions` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prescriptions`
--

INSERT INTO `prescriptions` (`id`, `medical_record_id`, `medicine_name`, `dosage`, `instructions`) VALUES
(1, 14, 'paracetamol', '3', '2x1'),
(2, 15, 'obat', '3', '1x1');

-- --------------------------------------------------------

--
-- Table structure for table `queues`
--

CREATE TABLE `queues` (
  `id` int(11) NOT NULL,
  `registration_id` int(11) NOT NULL,
  `queue_number` varchar(10) NOT NULL,
  `status` enum('Menunggu','Dipanggil','Selesai','Batal') DEFAULT 'Menunggu',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `queues`
--

INSERT INTO `queues` (`id`, `registration_id`, `queue_number`, `status`, `created_at`) VALUES
(1, 1, 'A001', 'Selesai', '2026-07-31 07:54:45'),
(2, 3, 'A002', 'Batal', '2026-07-31 14:31:24'),
(4, 5, 'A001', 'Selesai', '2026-08-01 07:40:45'),
(5, 6, 'A002', 'Selesai', '2026-08-01 10:13:51'),
(6, 7, 'A003', 'Selesai', '2026-08-01 11:56:20'),
(7, 8, 'A004', 'Selesai', '2026-08-01 14:07:40'),
(8, 9, 'A005', 'Dipanggil', '2026-08-01 14:32:11'),
(9, 10, 'A006', 'Menunggu', '2026-08-01 14:32:38');

-- --------------------------------------------------------

--
-- Table structure for table `registrations`
--

CREATE TABLE `registrations` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `polyclinic_id` int(11) NOT NULL,
  `visit_date` date NOT NULL,
  `payment_type` enum('BPJS','Umum','Asuransi') NOT NULL,
  `initial_complaint` text DEFAULT NULL,
  `status` enum('Menunggu','Check In','Pemeriksaan','Selesai') DEFAULT 'Menunggu',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registrations`
--

INSERT INTO `registrations` (`id`, `patient_id`, `doctor_id`, `polyclinic_id`, `visit_date`, `payment_type`, `initial_complaint`, `status`, `created_at`) VALUES
(1, 1, 1, 1, '2026-07-30', 'BPJS', 'Pusing pala ku dok.', 'Selesai', '2026-07-31 07:51:40'),
(3, 2, 1, 1, '2026-07-31', 'Umum', 'waduh', 'Selesai', '2026-07-31 14:31:24'),
(5, 2, 1, 1, '2026-08-01', 'BPJS', 'ketutup bpjs ga kalo stress dokter?', 'Menunggu', '2026-08-01 07:40:45'),
(6, 5, 2, 2, '2026-08-01', 'Asuransi', 'nyeuri huntu', 'Selesai', '2026-08-01 10:13:51'),
(7, 1, 1, 1, '2026-08-01', 'BPJS', 'pusing', 'Selesai', '2026-08-01 11:56:20'),
(8, 6, 1, 1, '2026-08-01', 'BPJS', 'sakit perut', 'Selesai', '2026-08-01 14:07:40'),
(9, 8, 2, 2, '2026-08-01', 'Asuransi', 'GIGI', '', '2026-08-01 14:32:11'),
(10, 7, 1, 1, '2026-08-01', 'BPJS', 'dompetku kosong', 'Menunggu', '2026-08-01 14:32:38');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'Admin'),
(2, 'Dokter'),
(3, 'Petugas Pendaftaran');

-- --------------------------------------------------------

--
-- Table structure for table `treatments`
--

CREATE TABLE `treatments` (
  `id` int(11) NOT NULL,
  `medical_record_id` int(11) NOT NULL,
  `treatment_name` varchar(255) NOT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `treatments`
--

INSERT INTO `treatments` (`id`, `medical_record_id`, `treatment_name`, `notes`) VALUES
(1, 14, 'olahraga', 'jauhi pusing'),
(2, 15, 'banyak minum', 'BAB secara berkala');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `password`, `role_id`, `created_at`) VALUES
(1, 'Admin Klinik', 'admin', '$2b$10$fA2X7rIzR0yMvNz05DpIxeSTCp/3eVePn3jhYnRWJDXBGfDmu8xr.', 1, '2026-07-31 07:47:25'),
(2, 'Dr. Udin', 'dokter', '$2b$10$PwSh0qrgZVUvdRltC39iZOu7BQZwIWndBhq9mep4II3R2d.TIcX/S', 2, '2026-08-01 07:03:47'),
(3, 'dadang', 'petugas', '$2b$10$JJ7GKq6p4RhqULWFw4eGuO04HsuysAO3JZJDlanZ4NQRZC0112MWi', 3, '2026-08-01 07:03:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `polyclinic_id` (`polyclinic_id`);

--
-- Indexes for table `medical_records`
--
ALTER TABLE `medical_records`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `registration_id` (`registration_id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mr_number` (`mr_number`),
  ADD UNIQUE KEY `nik` (`nik`);

--
-- Indexes for table `polyclinics`
--
ALTER TABLE `polyclinics`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `medical_record_id` (`medical_record_id`);

--
-- Indexes for table `queues`
--
ALTER TABLE `queues`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `registration_id` (`registration_id`);

--
-- Indexes for table `registrations`
--
ALTER TABLE `registrations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `polyclinic_id` (`polyclinic_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `treatments`
--
ALTER TABLE `treatments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `medical_record_id` (`medical_record_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `medical_records`
--
ALTER TABLE `medical_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `polyclinics`
--
ALTER TABLE `polyclinics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `queues`
--
ALTER TABLE `queues`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `registrations`
--
ALTER TABLE `registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `treatments`
--
ALTER TABLE `treatments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `doctors_ibfk_2` FOREIGN KEY (`polyclinic_id`) REFERENCES `polyclinics` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `medical_records`
--
ALTER TABLE `medical_records`
  ADD CONSTRAINT `medical_records_ibfk_1` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `medical_records_ibfk_2` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `medical_records_ibfk_3` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD CONSTRAINT `prescriptions_ibfk_1` FOREIGN KEY (`medical_record_id`) REFERENCES `medical_records` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `queues`
--
ALTER TABLE `queues`
  ADD CONSTRAINT `queues_ibfk_1` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `registrations`
--
ALTER TABLE `registrations`
  ADD CONSTRAINT `registrations_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_3` FOREIGN KEY (`polyclinic_id`) REFERENCES `polyclinics` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `treatments`
--
ALTER TABLE `treatments`
  ADD CONSTRAINT `treatments_ibfk_1` FOREIGN KEY (`medical_record_id`) REFERENCES `medical_records` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
