-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 03, 2026 at 08:33 AM
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
-- Database: `sami_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `asistencia`
--

CREATE TABLE `asistencia` (
  `id_asistencia` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` enum('PRESENTE','TARDE','AUSENTE','JUSTIFICADA') NOT NULL,
  `tipo_registro` enum('AUTOMATICO','MANUAL') NOT NULL,
  `equipo_registro` varchar(100) DEFAULT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_clase` int(11) NOT NULL,
  `id_horario` int(11) NOT NULL,
  `id_usuario_modificador` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `aula`
--

CREATE TABLE `aula` (
  `id_aula` int(11) NOT NULL,
  `codigo_aula` varchar(20) NOT NULL,
  `edificio` varchar(10) NOT NULL,
  `nivel` int(11) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `capacidad` int(11) NOT NULL,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carrera`
--

CREATE TABLE `carrera` (
  `id_carrera` int(11) NOT NULL,
  `codigo_carrera` varchar(10) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_tipo_programa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carrera`
--

INSERT INTO `carrera` (`id_carrera`, `codigo_carrera`, `nombre`, `descripcion`, `estado`, `fecha_actualizacion`, `id_tipo_programa`) VALUES
(1, 'IID', 'Tecnico en Ingenieria en Informatica Inteligente', NULL, 'ACTIVO', '2026-05-30 15:53:05', 1),
(2, 'MID', 'Tecnico en Ingenieria en Manufactura Inteligente', NULL, 'ACTIVO', '2026-05-30 15:53:05', 1);

-- --------------------------------------------------------

--
-- Table structure for table `carrera_materia`
--

CREATE TABLE `carrera_materia` (
  `id_carrera_materia` int(11) NOT NULL,
  `numero_correlativo` int(11) NOT NULL,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `id_carrera` int(11) NOT NULL,
  `id_materia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ciclo`
--

CREATE TABLE `ciclo` (
  `id_ciclo` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `numero_ciclo` int(11) DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_periodo` int(11) NOT NULL,
  `id_tipo_ciclo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ciclo`
--

INSERT INTO `ciclo` (`id_ciclo`, `nombre`, `numero_ciclo`, `fecha_inicio`, `fecha_fin`, `estado`, `fecha_actualizacion`, `id_periodo`, `id_tipo_ciclo`) VALUES
(1, 'Ciclo 1', 1, '2026-01-15', '2026-06-15', 'ACTIVO', '2026-05-30 16:20:52', 1, 1),
(2, 'Ciclo 2', 2, '2026-07-01', '2026-12-01', 'ACTIVO', '2026-05-30 16:20:52', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `clase`
--

CREATE TABLE `clase` (
  `id_clase` int(11) NOT NULL,
  `tipo_clase` enum('TEORIA','PRACTICA') NOT NULL,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_materia` int(11) NOT NULL,
  `id_docente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clase_grupo`
--

CREATE TABLE `clase_grupo` (
  `id_clase_grupo` int(11) NOT NULL,
  `id_clase` int(11) NOT NULL,
  `id_grupo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `grupo`
--

CREATE TABLE `grupo` (
  `id_grupo` int(11) NOT NULL,
  `nombre_grupo` varchar(10) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `limite_estudiantes` int(11) NOT NULL,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_ciclo` int(11) NOT NULL,
  `id_carrera` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `horario`
--

CREATE TABLE `horario` (
  `id_horario` int(11) NOT NULL,
  `dia_semana` enum('LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO') NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `minutos_anticipacion` int(11) NOT NULL DEFAULT 10,
  `minutos_tolerancia` int(11) NOT NULL DEFAULT 10,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_modalidad` int(11) NOT NULL,
  `id_aula` int(11) NOT NULL,
  `id_clase` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inscripcion`
--

CREATE TABLE `inscripcion` (
  `id_inscripcion` int(11) NOT NULL,
  `fecha_inscripcion` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` enum('ACTIVA','RETIRADA','FINALIZADA','GRADUADA') NOT NULL DEFAULT 'ACTIVA',
  `observacion` varchar(255) DEFAULT NULL,
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_usuario` int(11) NOT NULL,
  `id_grupo` int(11) NOT NULL,
  `id_usuario_registro` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `materia`
--

CREATE TABLE `materia` (
  `id_materia` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `horas_teoricas` int(11) NOT NULL,
  `horas_practicas` int(11) NOT NULL,
  `unidades_valorativas` int(11) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` enum('ACTIVA','INACTIVA') NOT NULL DEFAULT 'ACTIVA',
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `materia`
--

INSERT INTO `materia` (`id_materia`, `nombre`, `horas_teoricas`, `horas_practicas`, `unidades_valorativas`, `descripcion`, `estado`, `fecha_actualizacion`) VALUES
(1, 'Programacion para la industria 4.0', 20, 34, 4, 'Prueba de materia', 'ACTIVA', '2026-06-02 16:33:45'),
(2, 'MATEMATICAS I', 40, 25, 3, 'Materia transversal lunes', 'INACTIVA', '2026-06-02 20:50:18');

-- --------------------------------------------------------

--
-- Table structure for table `modalidad`
--

CREATE TABLE `modalidad` (
  `id_modalidad` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `modalidad`
--

INSERT INTO `modalidad` (`id_modalidad`, `nombre`, `descripcion`, `estado`, `fecha_actualizacion`) VALUES
(1, 'PRESENCIAL', NULL, 'ACTIVO', '2026-05-30 15:48:46'),
(2, 'VIRTUAL', NULL, 'ACTIVO', '2026-05-30 15:48:46'),
(3, 'SEMIPRESENCIAL', NULL, 'ACTIVO', '2026-05-30 15:48:46');

-- --------------------------------------------------------

--
-- Table structure for table `notificacion`
--

CREATE TABLE `notificacion` (
  `id_notificacion` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `mensaje` text NOT NULL,
  `tipo` enum('SISTEMA','ASISTENCIA','CUENTA','RECORDATORIO') NOT NULL,
  `fecha_envio` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_lectura` datetime DEFAULT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `periodo_lectivo`
--

CREATE TABLE `periodo_lectivo` (
  `id_periodo` int(11) NOT NULL,
  `anio` year(4) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `periodo_lectivo`
--

INSERT INTO `periodo_lectivo` (`id_periodo`, `anio`, `fecha_inicio`, `fecha_fin`, `estado`, `fecha_actualizacion`) VALUES
(1, '2026', '2026-01-01', '2026-12-31', 'ACTIVO', '2026-05-30 15:53:05');

-- --------------------------------------------------------

--
-- Table structure for table `reporte`
--

CREATE TABLE `reporte` (
  `id_reporte` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `tipo_reporte` enum('ASISTENCIA','ESTUDIANTES','DOCENTES','MATERIAS','HORARIOS') NOT NULL,
  `formato` enum('PDF','EXCEL','CSV') NOT NULL,
  `ruta_archivo` varchar(255) DEFAULT NULL,
  `fecha_generacion` datetime NOT NULL DEFAULT current_timestamp(),
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rol`
--

CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rol`
--

INSERT INTO `rol` (`id_rol`, `nombre`, `descripcion`, `estado`, `fecha_actualizacion`) VALUES
(1, 'ADMINISTRADOR', NULL, 'ACTIVO', '2026-05-30 15:48:15'),
(2, 'DOCENTE', NULL, 'ACTIVO', '2026-05-30 15:48:15'),
(3, 'ESTUDIANTE', NULL, 'ACTIVO', '2026-05-30 15:48:15');

-- --------------------------------------------------------

--
-- Table structure for table `tipo_ciclo`
--

CREATE TABLE `tipo_ciclo` (
  `id_tipo_ciclo` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tipo_ciclo`
--

INSERT INTO `tipo_ciclo` (`id_tipo_ciclo`, `nombre`, `descripcion`, `estado`, `fecha_actualizacion`) VALUES
(1, 'ORDINARIO', NULL, 'ACTIVO', '2026-05-30 15:48:46'),
(2, 'EXTRAORDINARIO', NULL, 'ACTIVO', '2026-05-30 15:48:46');

-- --------------------------------------------------------

--
-- Table structure for table `tipo_programa`
--

CREATE TABLE `tipo_programa` (
  `id_tipo_programa` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tipo_programa`
--

INSERT INTO `tipo_programa` (`id_tipo_programa`, `nombre`, `descripcion`, `estado`, `fecha_actualizacion`) VALUES
(1, 'TECNICO', NULL, 'ACTIVO', '2026-05-30 15:48:46'),
(2, 'INGENIERIA', NULL, 'ACTIVO', '2026-05-30 15:48:46'),
(3, 'DUAL', NULL, 'ACTIVO', '2026-05-30 15:48:46');

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `primer_nombre` varchar(50) NOT NULL,
  `segundo_nombre` varchar(50) DEFAULT NULL,
  `primer_apellido` varchar(50) NOT NULL,
  `segundo_apellido` varchar(50) DEFAULT NULL,
  `fecha_nacimiento` date NOT NULL,
  `sexo` enum('MASCULINO','FEMENINO') NOT NULL,
  `correo_personal` varchar(100) DEFAULT NULL,
  `correo_institucional` varchar(100) DEFAULT NULL,
  `telefono_movil` varchar(20) DEFAULT NULL,
  `telefono_fijo` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `dui` varchar(10) DEFAULT NULL,
  `carnet` varchar(30) NOT NULL,
  `carnet_minoridad` varchar(30) DEFAULT NULL,
  `foto_perfil` longtext DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `estado` enum('ACTIVO','INACTIVO','GRADUADO','RETIRADO') NOT NULL DEFAULT 'ACTIVO',
  `fecha_ingreso` date DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ultima_conexion` datetime DEFAULT NULL,
  `id_rol` int(11) NOT NULL,
  `dui_tipo` varchar(20) NOT NULL DEFAULT 'PERSONAL'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `primer_nombre`, `segundo_nombre`, `primer_apellido`, `segundo_apellido`, `fecha_nacimiento`, `sexo`, `correo_personal`, `correo_institucional`, `telefono_movil`, `telefono_fijo`, `direccion`, `dui`, `carnet`, `carnet_minoridad`, `foto_perfil`, `password_hash`, `estado`, `fecha_ingreso`, `fecha_creacion`, `fecha_actualizacion`, `ultima_conexion`, `id_rol`, `dui_tipo`) VALUES
(1, 'FABRICIO', 'DANIEL', 'VANEGAS', 'AVILES', '2006-05-03', 'MASCULINO', 'fabriciovanegas05@gmail.com', 'fabricio.vanegas25@itca.edu.sv', '73641707', '22334455', 'Av. Peralta Col. Don Bosco psj 6 casa 5', '074389230', '210225', NULL, NULL, 'scrypt:32768:8:1$2HMjFPNtujm3xBM1$f0d66d3883a9d1a05b76548bea6a39447dfbe007220de073f71e19390a2e5f553b46409e39606164a3554f736ea9975d140c417292fb4e944daaf0a798b7b2a7', 'ACTIVO', '2026-05-30', '2026-05-30 18:17:57', '2026-05-30 19:48:36', NULL, 1, 'PERSONAL'),
(2, 'CARLOS', 'JOSUE', 'SANCHEZ', 'MENDEZ', '2006-04-10', 'MASCULINO', 'carlos10@gmail.com', 'cjosue.sanchez25@itca.edu.sv', '12345678', '22113344', 'Av. Olímpica, 345', '009128746', '062825', NULL, NULL, 'scrypt:32768:8:1$2HMjFPNtujm3xBM1$f0d66d3883a9d1a05b76548bea6a39447dfbe007220de073f71e19390a2e5f553b46409e39606164a3554f736ea9975d140c417292fb4e944daaf0a798b7b2a7', 'ACTIVO', '2026-05-30', '2026-05-30 19:35:10', '2026-05-30 19:48:58', NULL, 1, 'PERSONAL'),
(3, 'JEFFERSON', 'JESUS', 'GOMEZ', 'TOLENTINO', '2005-09-12', 'MASCULINO', 'jeffesor12@gmail.com', 'jefferson.tolentino25@itca.edu.sv', '78981234', '22309822', 'Alameda Roosevelt, 2102', '987654321', '160725', NULL, NULL, 'scrypt:32768:8:1$2HMjFPNtujm3xBM1$f0d66d3883a9d1a05b76548bea6a39447dfbe007220de073f71e19390a2e5f553b46409e39606164a3554f736ea9975d140c417292fb4e944daaf0a798b7b2a7', 'ACTIVO', '2026-05-30', '2026-05-30 19:40:11', '2026-05-30 19:54:06', NULL, 3, 'PERSONAL'),
(4, 'ANDRES', 'FERNANDO', 'MONTES', 'LOPEZ', '2006-02-05', 'MASCULINO', 'andres43@gmail.com', 'andres.montes25@itca.edu.sv', '89323456', '22223333', 'Paseo General Escalón, 3700', '123475689', '109525', NULL, NULL, 'scrypt:32768:8:1$2HMjFPNtujm3xBM1$f0d66d3883a9d1a05b76548bea6a39447dfbe007220de073f71e19390a2e5f553b46409e39606164a3554f736ea9975d140c417292fb4e944daaf0a798b7b2a7', 'ACTIVO', '2026-05-30', '2026-05-30 19:45:51', '2026-05-30 19:54:19', NULL, 2, 'PERSONAL'),
(5, 'JUAN', 'CARLOS', 'PEREZ', 'LOPEZ', '2000-05-10', 'MASCULINO', 'juan@gmail.com', 'juan.perez@itca.edu.sv', '77778882', '22223333', 'San Salvador', '12345678-9', 'TEST0017', '', NULL, 'scrypt:32768:8:1$HipX9JKjCPqRWbhA$4a177b0df21df21461d883fd2d4f7538a8d9661fd3b77d660fb9cdb58fd1a1ccdf702abfc833fff1df16540028814454ed29dcc984c9e8aec27bdf290fe6318a', 'INACTIVO', '2026-06-01', '2026-06-01 20:21:02', '2026-06-02 18:02:29', NULL, 3, 'PERSONAL'),
(6, 'DAVID', 'JOSUE', 'GARCIA', 'FLAMENGO', '2026-06-08', 'FEMENINO', 'davidjaja@gmail.com', 'davidjaja@itca.edu.sv', '76554433', '33889922', 'Direccion de prueba 123', '891234567', '333333', '1233445556', NULL, 'scrypt:32768:8:1$bLebprEKY6cHkuTh$cfc884798c624fd566af162e7ea977a3f270aa3762f07ea65be2a98a7c3a345962d830bee188be53be20897a70ad515cdb4ed6bcd16c0588e597d9c44a7876c7', 'ACTIVO', '2026-06-01', '2026-06-01 20:43:51', '2026-06-03 00:17:35', NULL, 3, 'RESPONSABLE'),
(7, 'JOSUE', 'ALVARADO', 'GONZALES', 'LOPEZ', '2005-06-18', 'MASCULINO', 'gonzales3131@gmail.com', 'gonzales097@itca.edu.sv', '78782322', '22990033', 'Direccion aleatoria', '126753028', '210926', NULL, NULL, 'scrypt:32768:8:1$URtAp8HOY6YNhMlG$b7f44aa79e93103429584a5bd00e4d5fdd42198f6b3e67350c2755231cd02e4fe8594ac2200fb70a0001c7972adf267ae70544a261fc9d4f15b8009253dc2c06', 'ACTIVO', '2026-06-01', '2026-06-01 23:39:58', '2026-06-01 23:39:58', NULL, 2, 'PERSONAL'),
(8, 'BENITO', 'JOSE', 'LOPEZ', 'GOMEZ', '2026-06-11', 'MASCULINO', 'benito@gmail.com', 'benito@gmail.com', '78787878', '22222222', 'prueba', '231313222', '564433', NULL, NULL, 'scrypt:32768:8:1$3Eehh8KPElz1w3KR$0f0cc0cea76326e61076d1d13afa6640980f0227e4327e2ab6fac747358d539fbd4c16747af64153b5b0390dbca89085a7a6c3c1df0e9b966fdfaa4201fbb15d', 'ACTIVO', '2026-06-02', '2026-06-02 23:56:08', '2026-06-03 00:16:58', NULL, 2, 'PERSONAL'),
(9, 'JUANITO', 'CANCELO', 'JOTA', 'PEREIRA', '2026-06-06', 'MASCULINO', 'pruebadecorreo1234@gmail.com', 'juanito2121@itca.edu.sv', '66757575', '24242424', 'Prueba', '424234342', '258734', '113123', 'data:image/jpeg;base64,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', 'scrypt:32768:8:1$bUVaJxdZS6hwyai0$375e9b538bbb140a517263fe9c41b7ce018f476e707f4f141beeec6217e4b168cdd61a2770c7b27b98f4560c10a6619917a247d96993781c1f05dd6f4f6b0dcd', 'ACTIVO', '2026-06-03', '2026-06-03 00:07:47', '2026-06-03 00:14:39', NULL, 3, 'RESPONSABLE');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `asistencia`
--
ALTER TABLE `asistencia`
  ADD PRIMARY KEY (`id_asistencia`),
  ADD UNIQUE KEY `uk_asistencia_unica` (`id_usuario`,`id_horario`,`fecha`),
  ADD KEY `fk_asistencia_clase` (`id_clase`),
  ADD KEY `fk_asistencia_horario` (`id_horario`),
  ADD KEY `fk_asistencia_modificador` (`id_usuario_modificador`);

--
-- Indexes for table `aula`
--
ALTER TABLE `aula`
  ADD PRIMARY KEY (`id_aula`),
  ADD UNIQUE KEY `codigo_aula` (`codigo_aula`);

--
-- Indexes for table `carrera`
--
ALTER TABLE `carrera`
  ADD PRIMARY KEY (`id_carrera`),
  ADD UNIQUE KEY `codigo_carrera` (`codigo_carrera`),
  ADD KEY `fk_carrera_tipo_programa` (`id_tipo_programa`);

--
-- Indexes for table `carrera_materia`
--
ALTER TABLE `carrera_materia`
  ADD PRIMARY KEY (`id_carrera_materia`),
  ADD UNIQUE KEY `uk_carrera_materia` (`id_carrera`,`id_materia`),
  ADD KEY `fk_cm_materia` (`id_materia`);

--
-- Indexes for table `ciclo`
--
ALTER TABLE `ciclo`
  ADD PRIMARY KEY (`id_ciclo`),
  ADD KEY `fk_ciclo_periodo` (`id_periodo`),
  ADD KEY `fk_ciclo_tipo` (`id_tipo_ciclo`);

--
-- Indexes for table `clase`
--
ALTER TABLE `clase`
  ADD PRIMARY KEY (`id_clase`),
  ADD KEY `fk_clase_materia` (`id_materia`),
  ADD KEY `fk_clase_docente` (`id_docente`);

--
-- Indexes for table `clase_grupo`
--
ALTER TABLE `clase_grupo`
  ADD PRIMARY KEY (`id_clase_grupo`),
  ADD UNIQUE KEY `uk_clase_grupo` (`id_clase`,`id_grupo`),
  ADD KEY `fk_clase_grupo_grupo` (`id_grupo`);

--
-- Indexes for table `grupo`
--
ALTER TABLE `grupo`
  ADD PRIMARY KEY (`id_grupo`),
  ADD UNIQUE KEY `uk_grupo_unico` (`nombre_grupo`,`id_carrera`,`id_ciclo`),
  ADD KEY `fk_grupo_ciclo` (`id_ciclo`),
  ADD KEY `fk_grupo_carrera` (`id_carrera`);

--
-- Indexes for table `horario`
--
ALTER TABLE `horario`
  ADD PRIMARY KEY (`id_horario`),
  ADD KEY `fk_horario_modalidad` (`id_modalidad`),
  ADD KEY `fk_horario_aula` (`id_aula`),
  ADD KEY `fk_horario_clase` (`id_clase`);

--
-- Indexes for table `inscripcion`
--
ALTER TABLE `inscripcion`
  ADD PRIMARY KEY (`id_inscripcion`),
  ADD UNIQUE KEY `uk_inscripcion_unica` (`id_usuario`,`id_grupo`),
  ADD KEY `fk_inscripcion_grupo` (`id_grupo`),
  ADD KEY `fk_inscripcion_registro` (`id_usuario_registro`);

--
-- Indexes for table `materia`
--
ALTER TABLE `materia`
  ADD PRIMARY KEY (`id_materia`),
  ADD UNIQUE KEY `uk_materia_nombre` (`nombre`);

--
-- Indexes for table `modalidad`
--
ALTER TABLE `modalidad`
  ADD PRIMARY KEY (`id_modalidad`),
  ADD UNIQUE KEY `uk_modalidad_nombre` (`nombre`);

--
-- Indexes for table `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `fk_notificacion_usuario` (`id_usuario`);

--
-- Indexes for table `periodo_lectivo`
--
ALTER TABLE `periodo_lectivo`
  ADD PRIMARY KEY (`id_periodo`);

--
-- Indexes for table `reporte`
--
ALTER TABLE `reporte`
  ADD PRIMARY KEY (`id_reporte`),
  ADD KEY `fk_reporte_usuario` (`id_usuario`);

--
-- Indexes for table `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `uk_rol_nombre` (`nombre`);

--
-- Indexes for table `tipo_ciclo`
--
ALTER TABLE `tipo_ciclo`
  ADD PRIMARY KEY (`id_tipo_ciclo`),
  ADD UNIQUE KEY `uk_tipo_ciclo_nombre` (`nombre`);

--
-- Indexes for table `tipo_programa`
--
ALTER TABLE `tipo_programa`
  ADD PRIMARY KEY (`id_tipo_programa`),
  ADD UNIQUE KEY `uk_tipo_programa_nombre` (`nombre`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `carnet` (`carnet`),
  ADD UNIQUE KEY `dui` (`dui`),
  ADD UNIQUE KEY `carnet_minoridad` (`carnet_minoridad`),
  ADD KEY `fk_usuario_rol` (`id_rol`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `asistencia`
--
ALTER TABLE `asistencia`
  MODIFY `id_asistencia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `aula`
--
ALTER TABLE `aula`
  MODIFY `id_aula` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `carrera`
--
ALTER TABLE `carrera`
  MODIFY `id_carrera` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `carrera_materia`
--
ALTER TABLE `carrera_materia`
  MODIFY `id_carrera_materia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ciclo`
--
ALTER TABLE `ciclo`
  MODIFY `id_ciclo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `clase`
--
ALTER TABLE `clase`
  MODIFY `id_clase` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clase_grupo`
--
ALTER TABLE `clase_grupo`
  MODIFY `id_clase_grupo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grupo`
--
ALTER TABLE `grupo`
  MODIFY `id_grupo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `horario`
--
ALTER TABLE `horario`
  MODIFY `id_horario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inscripcion`
--
ALTER TABLE `inscripcion`
  MODIFY `id_inscripcion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `materia`
--
ALTER TABLE `materia`
  MODIFY `id_materia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `modalidad`
--
ALTER TABLE `modalidad`
  MODIFY `id_modalidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `periodo_lectivo`
--
ALTER TABLE `periodo_lectivo`
  MODIFY `id_periodo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reporte`
--
ALTER TABLE `reporte`
  MODIFY `id_reporte` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tipo_ciclo`
--
ALTER TABLE `tipo_ciclo`
  MODIFY `id_tipo_ciclo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tipo_programa`
--
ALTER TABLE `tipo_programa`
  MODIFY `id_tipo_programa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `asistencia`
--
ALTER TABLE `asistencia`
  ADD CONSTRAINT `fk_asistencia_clase` FOREIGN KEY (`id_clase`) REFERENCES `clase` (`id_clase`),
  ADD CONSTRAINT `fk_asistencia_horario` FOREIGN KEY (`id_horario`) REFERENCES `horario` (`id_horario`),
  ADD CONSTRAINT `fk_asistencia_modificador` FOREIGN KEY (`id_usuario_modificador`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `fk_asistencia_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `carrera`
--
ALTER TABLE `carrera`
  ADD CONSTRAINT `fk_carrera_tipo_programa` FOREIGN KEY (`id_tipo_programa`) REFERENCES `tipo_programa` (`id_tipo_programa`);

--
-- Constraints for table `carrera_materia`
--
ALTER TABLE `carrera_materia`
  ADD CONSTRAINT `fk_cm_carrera` FOREIGN KEY (`id_carrera`) REFERENCES `carrera` (`id_carrera`),
  ADD CONSTRAINT `fk_cm_materia` FOREIGN KEY (`id_materia`) REFERENCES `materia` (`id_materia`);

--
-- Constraints for table `ciclo`
--
ALTER TABLE `ciclo`
  ADD CONSTRAINT `fk_ciclo_periodo` FOREIGN KEY (`id_periodo`) REFERENCES `periodo_lectivo` (`id_periodo`),
  ADD CONSTRAINT `fk_ciclo_tipo` FOREIGN KEY (`id_tipo_ciclo`) REFERENCES `tipo_ciclo` (`id_tipo_ciclo`);

--
-- Constraints for table `clase`
--
ALTER TABLE `clase`
  ADD CONSTRAINT `fk_clase_docente` FOREIGN KEY (`id_docente`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `fk_clase_materia` FOREIGN KEY (`id_materia`) REFERENCES `materia` (`id_materia`);

--
-- Constraints for table `clase_grupo`
--
ALTER TABLE `clase_grupo`
  ADD CONSTRAINT `fk_clase_grupo_clase` FOREIGN KEY (`id_clase`) REFERENCES `clase` (`id_clase`),
  ADD CONSTRAINT `fk_clase_grupo_grupo` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`);

--
-- Constraints for table `grupo`
--
ALTER TABLE `grupo`
  ADD CONSTRAINT `fk_grupo_carrera` FOREIGN KEY (`id_carrera`) REFERENCES `carrera` (`id_carrera`),
  ADD CONSTRAINT `fk_grupo_ciclo` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclo` (`id_ciclo`);

--
-- Constraints for table `horario`
--
ALTER TABLE `horario`
  ADD CONSTRAINT `fk_horario_aula` FOREIGN KEY (`id_aula`) REFERENCES `aula` (`id_aula`),
  ADD CONSTRAINT `fk_horario_clase` FOREIGN KEY (`id_clase`) REFERENCES `clase` (`id_clase`),
  ADD CONSTRAINT `fk_horario_modalidad` FOREIGN KEY (`id_modalidad`) REFERENCES `modalidad` (`id_modalidad`);

--
-- Constraints for table `inscripcion`
--
ALTER TABLE `inscripcion`
  ADD CONSTRAINT `fk_inscripcion_grupo` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`),
  ADD CONSTRAINT `fk_inscripcion_registro` FOREIGN KEY (`id_usuario_registro`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `fk_inscripcion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `notificacion`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `fk_notificacion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `reporte`
--
ALTER TABLE `reporte`
  ADD CONSTRAINT `fk_reporte_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
