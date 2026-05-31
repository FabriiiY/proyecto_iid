-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 31, 2026 at 04:39 AM
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
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `foto_perfil` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `estado` enum('ACTIVO','INACTIVO','GRADUADO','RETIRADO') NOT NULL DEFAULT 'ACTIVO',
  `fecha_ingreso` date DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ultima_conexion` datetime DEFAULT NULL,
  `id_rol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `primer_nombre`, `segundo_nombre`, `primer_apellido`, `segundo_apellido`, `fecha_nacimiento`, `sexo`, `correo_personal`, `correo_institucional`, `telefono_movil`, `telefono_fijo`, `direccion`, `dui`, `carnet`, `carnet_minoridad`, `foto_perfil`, `password_hash`, `estado`, `fecha_ingreso`, `fecha_creacion`, `fecha_actualizacion`, `ultima_conexion`, `id_rol`) VALUES
(1, 'FABRICIO', 'DANIEL', 'VANEGAS', 'AVILES', '2006-05-03', 'MASCULINO', 'fabriciovanegas05@gmail.com', 'fabricio.vanegas25@itca.edu.sv', '73641707', '22334455', 'Av. Peralta Col. Don Bosco psj 6 casa 5', '074389230', '210225', NULL, NULL, 'scrypt:32768:8:1$2HMjFPNtujm3xBM1$f0d66d3883a9d1a05b76548bea6a39447dfbe007220de073f71e19390a2e5f553b46409e39606164a3554f736ea9975d140c417292fb4e944daaf0a798b7b2a7', 'ACTIVO', '2026-05-30', '2026-05-30 18:17:57', '2026-05-30 19:48:36', NULL, 1),
(2, 'CARLOS', 'JOSUE', 'SANCHEZ', 'MENDEZ', '2006-04-10', 'MASCULINO', 'carlos10@gmail.com', 'cjosue.sanchez25@itca.edu.sv', '12345678', '22113344', 'Av. Olímpica, 345', '009128746', '062825', NULL, NULL, 'scrypt:32768:8:1$2HMjFPNtujm3xBM1$f0d66d3883a9d1a05b76548bea6a39447dfbe007220de073f71e19390a2e5f553b46409e39606164a3554f736ea9975d140c417292fb4e944daaf0a798b7b2a7', 'ACTIVO', '2026-05-30', '2026-05-30 19:35:10', '2026-05-30 19:48:58', NULL, 1),
(3, 'JEFFERSON', 'JESUS', 'GOMEZ', 'TOLENTINO', '2005-09-12', 'MASCULINO', 'jeffesor12@gmail.com', 'jefferson.tolentino25@itca.edu.sv', '78981234', '22309822', 'Alameda Roosevelt, 2102', '987654321', '160725', NULL, NULL, 'scrypt:32768:8:1$2HMjFPNtujm3xBM1$f0d66d3883a9d1a05b76548bea6a39447dfbe007220de073f71e19390a2e5f553b46409e39606164a3554f736ea9975d140c417292fb4e944daaf0a798b7b2a7', 'ACTIVO', '2026-05-30', '2026-05-30 19:40:11', '2026-05-30 19:54:06', NULL, 3),
(4, 'ANDRES', 'FERNANDO', 'MONTES', 'LOPEZ', '2006-02-05', 'MASCULINO', 'andres43@gmail.com', 'andres.montes25@itca.edu.sv', '89323456', '22223333', 'Paseo General Escalón, 3700', '123475689', '109525', NULL, NULL, 'scrypt:32768:8:1$2HMjFPNtujm3xBM1$f0d66d3883a9d1a05b76548bea6a39447dfbe007220de073f71e19390a2e5f553b46409e39606164a3554f736ea9975d140c417292fb4e944daaf0a798b7b2a7', 'ACTIVO', '2026-05-30', '2026-05-30 19:45:51', '2026-05-30 19:54:19', NULL, 2);

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
  MODIFY `id_materia` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
