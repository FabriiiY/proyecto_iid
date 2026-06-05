-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 06, 2026 at 01:29 AM
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

--
-- Dumping data for table `aula`
--

INSERT INTO `aula` (`id_aula`, `codigo_aula`, `edificio`, `nivel`, `descripcion`, `capacidad`, `estado`, `fecha_actualizacion`) VALUES
(1, 'A-101', 'A', 1, 'Prueba de aula', 30, 'ACTIVO', '2026-06-05 16:16:37'),
(2, 'C-202', 'C', 3, 'Pruebaaa dos', 30, 'ACTIVO', '2026-06-04 22:51:08');

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
(1, 'IID', 'Tecnico en Ingenieria en Informatica Inteligente', 'Los mas god', 'ACTIVO', '2026-06-05 17:23:09', 3),
(2, 'MID', 'Tecnico en Ingenieria en Manufactura Inteligente', 'Unos randis', 'ACTIVO', '2026-06-05 17:24:57', 3),
(3, 'PRU-001', 'PRUEBA CARRERA UNO', 'Prueba de carrera', 'ACTIVO', '2026-06-05 17:23:41', 2);

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
(1, 'Ciclo 1', 1, '2026-01-15', '2026-06-15', 'ACTIVO', '2026-06-04 22:59:21', 1, 1),
(2, 'Ciclo 2', 2, '2026-07-01', '2026-12-01', 'ACTIVO', '2026-05-30 16:20:52', 1, 1),
(3, 'CICLO 2 - 2000 prueba', 2, '2000-01-02', '2000-12-02', 'ACTIVO', '2026-06-05 01:37:29', 2, 2);

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
(1, 'PRESENCIAL', 'Programa 100% presencial', 'ACTIVO', '2026-06-04 12:34:06'),
(2, 'VIRTUAL', 'Programa 100% virtual', 'ACTIVO', '2026-06-04 12:35:18'),
(3, 'SEMIPRESENCIAL', 'Programa virtual con practicas presenciales', 'ACTIVO', '2026-06-04 12:34:57'),
(4, 'MODALIDAD DE PRUEBA', 'Una modalidad de prueba', 'INACTIVO', '2026-06-04 12:40:53');

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
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `anio` year(4) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `periodo_lectivo`
--

INSERT INTO `periodo_lectivo` (`id_periodo`, `nombre`, `descripcion`, `anio`, `fecha_inicio`, `fecha_fin`, `estado`, `fecha_actualizacion`) VALUES
(1, 'PERIODO ORDINARIOO', 'Periodo ordinario 2026 prueba', '2026', '2026-01-01', '2026-12-31', 'ACTIVO', '2026-06-04 15:53:08'),
(2, 'AÑO lectivo 2000', 'año lectivo del año 2000', '2000', '2026-06-23', '2026-07-11', 'ACTIVO', '2026-06-04 18:28:34');

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
(1, 'ORDINARIO', 'hace referencia al período académico regular en el que se presentan los alumnos de manera presencial o semipresencial o por supuesto dual', 'ACTIVO', '2026-06-04 19:09:18'),
(2, 'EXTRAORDINARIO', 'periodo académico especial para cursar y aprobar asignaturas pendientes, nivelarte', 'ACTIVO', '2026-06-04 19:04:39'),
(3, 'CICLO DE PRUEBA', 'ciclo de prueba', 'INACTIVO', '2026-06-04 19:03:41');

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
(1, 'TECNICO', '2 años de carrera', 'ACTIVO', '2026-06-04 12:24:54'),
(2, 'INGENIERIA', '5 años de carrera', 'ACTIVO', '2026-06-04 12:25:10'),
(3, 'DUAL', '2 años y medio de carrera', 'ACTIVO', '2026-06-04 12:25:23'),
(5, 'PROGRAMA DE PRUEBA', 'Una prueba para añadir', 'INACTIVO', '2026-06-04 12:39:41');

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
(1, 'FABRICIO', 'DANIEL', 'VANEGAS', 'AVILES', '2006-05-03', 'MASCULINO', 'fabriciovanegas05@gmail.com', 'fabricio.vanegas25@itca.edu.sv', '73641707', '22334455', 'Av. Peralta Col. Don Bosco psj 6 casa 5', '074389230', '210225', NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAQDAwMDAgQDAwMEBAQFBgoGBgUFBgwICQcKDgwPDg4MDQ0PERYTDxAVEQ0NExoTFRcYGRkZDxIbHRsYHRYYGRj/2wBDAQQEBAYFBgsGBgsYEA0QGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBj/wAARCAGQAZADASIAAhEBAxEB/8QAHQAAAQUBAQEBAAAAAAAAAAAABQMEBgcIAgEACf/EAFoQAAECBAQDBAYFCAQKBwYHAAECAwAEBREGBxIhEzFBCCJRYRRxgZGhwRUjMrHRFjNCUmKCouEXJHKSJTRDc4OywtLw8QkYJ0Vjk6MmNURUs9M2N4SFlOLj/8QAGwEAAgMBAQEAAAAAAAAAAAAAAgMAAQQFBgf/xAA1EQACAgEDAgMGBAYDAQEAAAAAAQIRAwQSIQUxE0FRBiJxkbHwFDJhwSMzQoGh0SQ0UhXh/9oADAMBAAIRAxEAPwC3xPg8jHonkkcxAhLjQQLuCOkrbSr7YtHmbOhtHc5O8NIdTtY7wsxUUPNBfPaGB4S0EKUCCIHMPsys4pgud0m4iWVTJR6Yi1rR0mcQdhAoOskfnU++FEFBHdWD7YuykgqJlvqY9TMJ03vA/Ta11R4BvzgtxdBHjovCUw8hbCzfpDYBRH2rR8UXSReIpAs7kp1DjfPlzh6JkX2MR2V+pqDjJNgdxBUDbblBKSLoIJf6hVo7S7tz2gcDvYR2b28IuyqHq5hQOxhu9MpBuVn1Q0U4UbKVuYFVCb4bClJUd+UXuIkPJ2ptskl15KUgcjEabxlTWnXEpbWvfZXIfGBFTmx6Ip6YeOm1y2D98VzPYhlJQu63UNAnYr2+EMgiMs2tV5mZpq3GytDZQSm4tcjlEUpMrIh0TNTsQvvBLg2A9XWIP+UqpuXtLzF0Ag3533hWp4nmTTCA8XCkadCk9PAe4RoUQGyazVfoCnzKNM697HUdA9kRTFcw7TWG5mSmtKAm5I5D135xH5Ct0KbbvWXX5d2xG40hPgQevq2iJVXFNmnpJTzb7JBANt94Lw35k3UTOlZiz86/6LPTzyVAWQ4lVgr3bxbeDcS1dtxBmn1vyiEFX17mpQHK4vva5jKJqDEqQpLYJP2Dcm3jE7wrjt6jUqYe9J0qUnhgOJvcE3PP1W9UGsKA8Q1FO1+Vp4ZnHrlkqOk2sLc9/MH7xCJxTJT8wHZBxPLexEUvI5oytYlmpV13QvUGXmh9jTySseFidx4RJ53LWozFPbqlFBUZjvtKl3SA93So6LfpWSe6d9oCeH0DhP1LXlqtrSOKghI5KMO2p9DzhQhxKk/rDa0UUwxiqhhC5xyeZ1LKLuak3I52PUbxIKbVppx9KxNrLqBdQ1lWr2H5Ql42hqaZdTJSlCSV7333h1rSVDvRVMviOoN60h9CnAfsKTuB6oLyOYSG7/SEktSRYEsDvA/2SR98LfYvaWGVpO8M5uYbLiJcnnEYk8f4cmpgsibW2oG2lxBT/wAoKyy0Tc2qYS4lSCO6QecVuBcQ+1oS0E9IVBTbnA8KUgWvHaXTaLsEf7W2MegAczDLj2HOOw/cRGyDvu32Me2SBsYacYARyubbaQVrOwgdxTFn3Epb0BQ1HlvHUvLpbbBvcncmBcu8Jl8vq2HS8EUvJAuTBJljsJt1EehJI6Q1Dwv9qOw/+18Yloti+gx7pVyIhEO3P2o94h6qibiIVKSTeE3DoT59BCTkyG03K4Sa1OqK1K26CAcixZmXWV8Rzn0h1osd4TQs2FlR1xVAc4vcQ60kdI+KduUecRXM2j1TvdFrQVotECMom9ggR6ZTugAQdEgu1w2on1R76IoDdtW3lHOovcgF6MkCwTtHCqWytWpTYJg/6Lt9mOvR+7yiE3ICJpjRb0lAtHbVOQg90G3lBsS4A6GPvR7chF2yWCTJg7b3jz0H9pUGRLiPeBboIjsgHElYfbV7499GVyufXBcsdNhHvA33TEshG3qIHneJxXAvxBtHaaXMI39Met4XiRJYHOPVsEiw3i7ZAC1KTKe8XlH1x66pbYsVb+cHOCEpvAeoaO+NtuvhETZAXMOrH6YuefkIi2I6/J0qVUHHUOuuDS2EqvbzPhBKrzGiUdUtQbI+0pRsLRn7FWIG6li9ctJKKpRm7ZcTzUbWJA+6NWKG4pugriHFM1OtKl6chbjitgVC3tEAJfDDD7aZutvmYSLlSeKefO5PX+UN5mouyUuW2OK2FABIvY+2AkxUplxKk8Ra1Ad7+YjdHHwJcwxPCnybDrUqpCSpNkpSb28I8VWkTEqjjlJVpF9r3iDzU8sTOtbvWxAMPZacbDQWoBW1xfeGxhXcVKYUqs47PtobcS46gC1ztoAivKtLvtzy1N2SL7AE/OJS7W3GFluWeLernp2v7YDTiETSgbi9r7RpjFUK3AuVS4ClL5XdVreIHW0GvQ5p5xtHCc2TbhrGkj184N0KhyKKiHZyYbI4QsCLlII5/GPapiGXpHFTT0AvqUSSobcrePlBNksOUrD6BJttJW2y4E3K7lV79PDxiZYJzYrGC3V0t+bLkkHgsJUNWhaeSh6+UUZNVauVlYLs4QyOSBZKUw8pD7aHFycw8H9QunSbb+swuUb5DUjT8vnFQ8VVBMri6UJkXDo4iDYtq/RWm3Iixt67G8FPyUlFzT9QpLiJulualMzTaiVlVrkFPMkG5IA5DY9Iy83OKmJ0IbTw0JsAkG/tv5xM8OY1xVgSuNTHGeDJsA06btrSdwR425gj7oW6CUiw6jUZ2kVVMuS9NSbqQtKw2LjexCVHmBv4XFoMytdp7iQmfccPQLUgkAeB6i0QmYxVRMaTaVLeVT3QpSgkO6QlRA+xyHTkT6rwLqs9WcOz6Wn1iZlCkE9RpI2UD8f+UKniT5NEMvHJaJolLrssv0V5hMwE3G/2h0UL2gZLu4pwVMcWS4k5JJXqcaSSu3ibcwPH5xXlJxOXKgTKzAacQnUkKX9qw5Dz/CLHw7WE1tgXfQzPIuC1qPftzsD77RmnCh0XZbGEsUyWKKYJmXcSHEizjRPeQYkgSnxHviiWlT1JxZ9JyMsmWnEAceWSQEzKL+Hjz3H33i6aPOSVZpjU3LEkLSCR1T5GMspNAuA/0WN7x9oB5kR76Ekcrx4ZQAXuffC/EB2o+0gDnA6bvMPhhB2H2ofOSusaTf1wimnNoJUnUD1N4veTadIY4bYSnkI6sbfajkSpA2cWPImPjLuj/Kqi/FLo7OuPjrFzeOA08P8AKkx0WnCPtWiLISjrUrqTHi3yhBUpW0IKRMg3DhI8LQ1mZabfTYPWHhaC3koVQ4/MvBZB0Dl5w9Dq02A2hmw1NNoAWtJAHQQ4UXv0QDA70Shb0l0DYx16W5e8M1GaAuEJJj5tyZsQttIPkYveiUPhOrPOPvTFiGRccHJAvHC3ZhX5ttN/MxW8tIrKV7aVUKgJhqhOeP8AVHUn/Wgojtnp4Y4lOoKieml0fjGfJeg0xUs2XJNpRuATpHUw4reEaVJMSqkSDQU67bUE2sLGPdv2bx/+mef/APoS9DQKe2XTSoJcw5RHPFSXVAfFMKL7YWH9IU5hCjOb7hMxuPeiM2/kbSTTnZlcuAtKhaBLmHJAyT7qWUhSWwU2FoRP2egv6mMjrZPyNVM9r7B8wPrcC05J5f4wj/chCb7WWCFNqKMBsFQG+maSP9mMdS0hKv1JDLjVyRyEOKnR5SV+y0U6gSIzv2fxv+pjFrGa4w72osv56d4E5gufC1Gw0zSCn42idN57ZUm3pGGag2f2XW1fc5H5/wBOpbUzMrbKlWHgYkjWD5ZTailx0GwOyul94kfZ2P8ATIt61+Zu5ObuUzo1LoNXQP2Qk/c5DaYzpyNliEzQqssTyC2z/vRigYKl0tLUzMTQt+35RGqrSDJzbiEPPKsRstV4Gfs60vzL5FfjT9AGc38gpsBSK5ONDzaXt8DDpOZWQ7p0pxi42empCx/sx+c7Es4KK5OB1yyHNP2j4QK+lJlp0KQ8skHqbxkydG2+f+BkdVfkfpkMWZNzJ0sY/ZCjyCgf92BM1UcvpuqFuWxfLFsC6VkWBPnH5+0aoT78+p5t5yxFidXjEocqUxTZF2ZMyvURpQ3c8z4++Ofl0O19zbDI3yW5mxjOmuVmaolEn0zMmw2FTE2gWClkXCE+214puQdDTrbzlrk3AUL8+vnClYd9Gw1JSbatTjqy9MLtbUsjx62G3vgOzNqE2FkarEAE8jBwx7VRJyJRPPF9jiKVd1SdyRyAG1ojM04liUe0ouVC1z06wRU+pUlxdRU4rYi/xgNVDdhV+4nwvyh8RLZGZp7UC4QbFX/OOZao6SlrVcWhGcDqghAToTfYe7eBS7tL5kEGGpWLbsNvL1Ok7DqDDVcyppZSFG946lJhEzLhPJY29cN5htSXSVA2PWCBaCspVXiDpUQbWPqge48p6dKyq++0eyhCZR1X6QFgYbtqHE98QiPn51xCS2pRUeZKjcmG0tOLZm0uhfI3t4QjPr1LBRzO5MIaTsocjBFk3M6W5puZa7ocbJuDb/jwh89VH1tJTr4jBAPCdNxe3Tqk+qI5KOJm6MlpwrS4ySRYXuNr9R4QuxNNpfUwl0uII2UpNvhCGuRguZvgTbrSVrS0o93Ub7euCVNxHNyroafdW62n7OpV7DygRNFCkpcUL3Vz8ITA4jSCjcoPO0WS6JlMP02cbTPSyQzM9C33QSPEDbwgrRq8Uzza2nND7arg3+15RCJVBXLhaSQeRjlmYLbx1Eg+MKyRvgfCdcmtaDVpLFuHGm5sanUpuh5CjqRbod72/CDeD5l/DuLxTlOlxma7yUq/TJFyfI3+6KJyyxnUMNzQqkqht5thX1jKz3XAenwizJrOCTmmk8GgSzK0uJdbWObShYjT5XTyPPUodRbmZcTTHqVo0UzoeaDiTcHcGFCwIo1ntRsUuocSfwdKTCD3tnCkX62FtusSKX7YeDVEB/BMujx+tH+5Fw0eSfaLFzyxjw2Wf6OLcrRyqW2taIE12tcuXvz2EUJPk8n/AHYey/akyqe7q8OLRfweT/KCegyryfyf+gFniS4SlvOPfRiRuIjTXaSydcClOUibTbnpdQf9oR2O0jkg45o9CqG/hpH+3FPSTXl/hl+PFkgEr5R8ZWAbXaDyNWopLdRSrwVp/wDuQ8az2yTfXpbZqilcu62D/twC08vuyeNEemV25Rx6IOg3htOZ1ZKSjQXN/S7IUNQBZO4/vQEks+sk5uqlkVOrIbJsAZeI8MlyWsqJN6ISm3KOfQ1A8ocS2ZuS84BwazPg2v8AmXLj+GHicY5Ru2IxFOpB8WHP/twPhX5l+IgWZXoBHhlPIwZOIcrFC6MWuN/22V3/ANSOvpzLAp3xuyi/66CPlE8F+q+ZFkQB9DvyFo59DJG8SJFRy5cHdx7TvWrb7zHLk/l42O9mFR0+t1P+9FeDL7YXiIxt6DpCUDbvtnfpvB/GEglDlGbVbSqYtf8AdMdvUiYVPzKdFuCWioHpdW0P8x5CblZ3Dja06SuaCB6yLR9gnJWjyMV6kNxMyqm0F9bfIFG3rvA6nUpU3KPIO2iVLpPja8TLMCgzjOF5lx5opQHGkHyJVtBjDmBau5L1NKZJwaKaSTp5C5hOTlDoIzvKNBvG0uykagVaLeuDGI5Ja30MJTuCQYMYPwq5Vs96fRnQUn0uyjblZJV8otGs5aH6VQ6FpKQwX7kdOHqjPGDoNySM/UKWWcQuyyASQtIiw6bLHhMrWkgK1o5dRDbJ/DSsU55z9LaKfqkl038ApI+cWVU8EzEnhinTLS0ajiJdNPkSvSIZjXIMmR2QpDpmJllSCQkpTb1pvFcY2k1yWI5oKTYJUk/CNgSGVk65iqpMXSAidaaPn9VeKV7QGAZvDzdYqj7aeEibaY1J6Xbv84TkyxapBJeZRVOl1v5UVCY/STMG3uH4wAkqBMvNofeQpDajZJtur1RO8IS6DgerMFCltt6XFd3kLjc+HKG7bq5+YunWpLSefIJHl4COLq821cG3BjsZSdPTLFDUuAknmbRxU3RM19iTbWENM2U4VeN4KrfZlk8ZThWQjbbYGI9JM+lTExU3l3GvQPlHDm77nShHahXFlQR6RK05Dod4STqKeV4YUxRW8Em9ibX6CB1RBVVtHeBTsUnofCHSHEyrCRcC3MjrFRiBNhl6YaVMcBo6rnSFDrvzgfU1gWZJ/SIUB4w1bnnA63MGw0glIAsR+PKA/pji5khSid+vTeGbRDkKzpCiCm4A2iPTbg4rgtBifU624ps7hCyn23P4QKmmipWvTv1g1wXQ1k5pUvMJIJEH0zaJlhKFhNh16iIy6gJNgYfybunfnFtEoJgJDSkJG55QilooKlWOkJJvbblHpduNQtbmIfJaCpfUCNQH84ohG0kuOqChteFkNWOnp5xzbRMffD9KUOAWA1CLslCsmrhqFjzhWYY13dYsCDyhqAUEGHkrMJbd76dSVbG8LZaOmnAWjKzIU2scrjeE0OmXmdC9hePqq042UqbWSgG4F/uhvx0TTKdWzg2JPWIkXIkEooXCQBZQvfzjx9DannUEgq9VrwOp05qVwFnvpN03+6Cc21qbROt+GlVj1gJIuLCkrUgzTRLtpS0hJuo3upav1ifbYDp67mDchUvSEjiPX0iwBVuIjIYK6eXULFiAFb8vCEpJ5TU2m6iLnTCmjVB8E9DbT0ylDjYUL9eg8oltLoFPfKkqlGlC4A1IB6RDaaoLQg3uSQUm/WLRwe2Jxp02usuIIHK20dbpeVKTgzHq4XygNL4bpsyxMLVT5c8O+/DHn+EN2sNUtcwhK5JkhWn9ARO6TTyoTstpI1SvFA9SlCE00hLCmnFDZKmTv56Y9TCqo5UkyvJ7DFORNKa9CYASbEBAFtoh1Sw8wxiB6nCXH2QQPDl+MXviGiIZfqr6UkcE6uXL6u8V96CmcziWwsA3ufZoB+cVLa0UrsqGekRKVVTGgoAc02vEilKFLPNB0JUbi9wTCuNZZlqpzE6j7Iq62D4WBETql0dpGH1KUNKjMNte9wj5RjpXQdsrfEFDblWeIw46FJ53VcRGpVKy8LOLBJIBCotbHFLEphZU0RutRSn2ExV0ogFxF+VztFPGvQimyQUWmvTEqqaTPTaLL0XQ6REgblqoww3w6/VUXOwTMqAHh1jzCrCXsO6UnYzJuf79vuiTv0lRZbSFbpWUj2AH5xFig+6Kc5epD56pYtlpIuN4srBAF9KptfQ+uIbPYwxb6VaZr9Qety4rylffFk4gpbkvh2ZmFbpQg9PbFTYhQGZ5COd2kLv60g/OEZtPjfaKGQySruSKVxdjQSodbxJPC9yRxL7wSkce5godU0nEkxZRuoKSlW+3iPVEZpKw5Tn1Hk2jl6yIOSDTYnCrna/+tAQ0mJrmKLeWS8yev52JarFTddormib4WkBf2NB+cPsaZ407Fc3h5yXpEyx9HTSX3dagSsDoPdFqUfKXBlazIxFTX6S0WZZplTSBfuk84XzYyXwDhuo4O+iaQhj0+oJl5gBajrSR647Mo1KKvlnPVorDHWeVFxNheYpcnSJxh9yYZc1OWsEoNzyiy8I9qPLemS9RbqctVGHnZIsJ+pCtSrqIGx8xHGbuS+A6Bg1NRo9NLEx6Wy1fiKN0qVY7Xg1h7s65XVTC07UJylTC3Wg4ARMKG6RsecKypOLt8D4WUPhDNfCtFzyViudbmfQEvqcSUt3UBwlp5esiLIPaBy6maU4j0qbEx9GcEBUud3OFpt79rxXlPywwlN56fktONvinLecQUocssANlQ39YEWRPdmzAKMuW65KzE+w6unGaFnQU6uGVW3HKJuaj3L2pvkrTs4Y/wzhjP+oVvE9QRISUzKOIQ8tJI1FaSBt5AxcUzmnl3O4cEqrEcqjRjETyAQQSxrCuJy2HOMf0mhTNQxd9ESDRdmHXOE0gH7RvYCLCbyPx/OSinGqA8tCZv0JRStJs7+rz58oGMpXaLcLNs0XOjLh3EFUnfyupiW3asyEKW6EhSOCkFW/S994qvtJY6wjiXBddk6NXJCdUZ5laPR3kr12aSCRbmB4xQi8g8yHWi0MMz10ucEkjYK8IBVLAuJMMqmJGrUedl3JdQDnEaICP+cYc0HB7l6UMhG+GFcFVWXp2G6zTplOoTjSEIG36wJ9WwMDp6dlpNpaJKXBUd9AJIEM5QutSy3w0bJsCo9OkMFrl1vqXxFFV90kcvbeOHmcpvnsdTGlBHdSeWaekuKstQubdIZy0wmXw2sm50kqHmTsD77QpVHEeihsAgjcnoR645Q1LuYUS6jVe4Cr9Tcfj8Ix9xjmA1JU22l1VwVb3MetOmbqCGkpVptpHmfxh08fT0NJaU2LWSRewuNuvWHNMkUMTDbx3IuoFO/gIahTkCJtZamEtjYpHLzgMlZ4pNucHqo1eaUpYsoneAsw02SC0CLGCsAeJAmZNalK0qSpPePK++xhpMJF9O2obE+MdMulDKkjxBt48x844WoPHUm5V1AirGJA5xjVsOYhNCFtmxG0EFpSVXUi5t02MecMK5QVlMbtuECx5QSk5lSmy3e45QxcYP6u0cNOKZdG5seoiAsVeYs+T5wqwkhQJhd7S60FJ3hqh0oOlY384Gy0O+HqBMcEFIHWFW3Apu5BAO1zyhdtAN9Yvc8jFWWuRFx7iSvCVzSNoEpSOKR9kwYcl1oc1Ni48YRmJNLwKmrBQ3tERbGoC2nQ8nZaeYiSUufZcZVLvpSoOpAso8j5RHG1KU3oc3PS4hwy2dCFtE3Bva0RqylwHWnTLfVOKOjkRfmIdJly+C4kjW2QsW/SBMBFTyZiWCCjS4DcE8/VBGUm0tobWpQDidiP2el4XKPA5TpEyp1n5ZJbd0n9a24i+ckGqbUqhN0yqLDfCdbusHexJCj6hb4xmlqphh3iNpKWV3BA/QMWTgLGzWG8XprS2VvNuM8KYZRyXy+O0Hpp7MiZMnvRZqKiYVpDmYbEilay07h51az/4geUn8Ic4iwPIyeDalOsKUVMS8s4m/j3bxUVH7QmFKLjtmpVGl1YSiKa5JnhpSpetSysEAkDTv64MVntM4FncDT9PYkKsHpiXS2jW2m1x4kKj1Ucsm4tduPqciVW0yV4wwqEM4pWHCEiQD6duvDI+UU/RaGk9o+dk7mzMoh33tN/jEhxD2k8I1mWrCZSSqQVNUpUqjUyPzliBfvct4rql5v4Zp+dlTxbMMzyae9IssJQGxxApKWwbi/LuK+EVHLJRdlOiH45liMLVN/fuYkebv+6TFy1GhtSlMl1JVYOT8kbDoFuL/CKGxLjKlVnDNRkJQPByYrrlRbC0WHCUkgX8/KLMqmceD5ul09lmYmitt6SUsKZIA4Zuv3X2hUpvdaIkmO80qO7/AEfMzKE/VByYB8tLhEUbQ5GYqlYladKI1vvOcNCfEkHaLcxvmthOs5XztDk3n1VEzLpZSWiApC3tV79O7vaKlwhXJai48pFTm1ES8vNtuuaRchIVufdDoztcgtFm5V4cqVdprzck1rCZ1DO5/SUh1X3JMWCrDNU+nTTyxqcRMqbITvvwkq+6ILk9mJh3CahL1WcXLreqzMyQGyqzQZeQpW3m4kW84n8hm7g5nF87OzVSIQapx2zwlHU2WQi+w8Ryipz2p0i4pPuCseYcnpbKmtTa2bIYSUrI6G4G/vjN+KpZxmpS4eBSVybKx5goTaNK44zgwRUMncYUSWqYXPz72qVaLarrTrR5WGyTGccb1aRq1Wprsg5rQ1TZaXcNiLOIbAUN/O8KWTcHtrse0STfewtVZttBU1L8IOK6J1KsLwdpCA4Ht/spUbn+1AqgVeWk8A4kp7sylt6bMqWmiPzmhwk2PkDeCmHqhSmVVEzs2hpJYcDZUD3lFQsPvhsGkLaNs4PVwc8sSsb6lyjR38oSzxm71nAzWrdNTSfuh3hhCT2ja2dtLkkjb1WgHnwQnHeCmkq/+OB+IjY7eWHwQtJNOwjnksjLJpwHf01g/wAQiTYQn0/kBXVX2Q86D/cB+cRfPRNstZRPIKn5cG/hqgjhZ5AwfjBpJHcmFX9raYFq8b+/QNPkz2JhSO1LLaVWCplzcebJi+q6+trs900C6SaetFgegbO0UHNsBjtXU1oXAVNn4tmL4xw6hjJeUlQdJEs8kD1NqhE29qLS8zHGWS/+2ymODf8ArjZBP9oRtKkVFUhQ5om1lYtQefmn8IxJl86tjM2SfQRdD6T/ABRrCQrL7mG0o9HCyvErTxN/NO0MXKIi9pKeDkiCRuqfCrxTGcCHqpWMRSzQCkrfa1AC5JDYtFpyCph2Ql3BLkf1q5F/KKhxrMz7+JcUsSkutT3pCEJsRtdq3/HqjnzTZrVKjP1Fprc1gHE8wlIPCbb0q52uvf2xW62SlzdV06rxdeEwlPZ8xvMcA3My22lXMJAVuPuinp5SQtuybBaQrfwtHO1ENqGRaYlPaXqdtzCSefQQHYm/8GCSQFFaFKUq29x4QfkmuLNyzaUBwbqKCq2u29vlAqsyrNNnX3GUlGonSnY225cunxjn1yNY3kbNTiZltBdaQUqO1777gwTcfZlCyppJ0WUbab2ueURqVcmpZKXkLcbVqNigkHpEn4SZ+jF56ZWSTdL5UVWVvsfX5wSAYDrE/LufWIWAoi/hEdcmVFAP6PK4gnP0mZWhxxIDgQd9Nr2vsbQJLDolVJsfG8WFEWaC1J1Jvv5R24mzmsXG1xaCFGaS6zw1C/nEiRSGHGyEs3uIzzy7XRqx4HJcELEwFd1wX6XHOPFJUyNSFAjpaJY/hlKxpQFBR2EDZnDs5LoKktKUnw8YuOeL4CnpJxV0A0zalHS4kb7R2dJ2tqBj6ZklhdtCkkcwRDIOuMKAUNukOU0zHKLXcfNFV7HdJj52WLl1JVv0jxDzakgpNiYcJdSEWXbV64spDMPTcsNJKgD0h8xOBTSSVbjrC7DzJ+pfaC0nrztDxdBYcTxZd6wse6PGxt8YBuhsUesOtrUQTbyhpNtOsva2b6b7Q2SHW1JABvytD+XmFGyXU6gnxG8CmShv6LxWQ62Dq5kAbwolCG2g9xSCVfWNKBB9fK3xhd9LzdpiUCbdSB/OGnGbefOrur5EXhllMWnZMOSfpUn3kp+0E9LwLRMq4gJuFX9/rg7JOGnOLJJ0ODugb+8HpDOckWpp4uymhGo/YJAAP4RYHmEpImapq20/bA1ADe46/cIl+XFJcxNikUYzaJd51tameJyccQkqDfkVWsPMiK6pM49I1BDbw0lB9dosTAweRmTT3qe7wnDPtBshINtSunSBgkpIanxReUn2f6hN12myzU9JuCfklTza3UakaL2sRbnDjEfZzn6Pg+bq7szTVIl2ystJCgT6tucXfg9LicSULUNCmqe62pu+ySV3NvC+xI8bnrEgzLAOVlVSDuWTHosWb3oRj5/7MeSC5Zk2rdn2syAmm25+QCG6eZ4hsKA0eHLnFaTWWE+zm4MDLdYM06lopXc6DrQFDe1+RjbtYlXHDODRq1UDT8Iz/PyzrvbYlwk3LUqh0kjoiUv8o1Qm5J2Z5Qp2UBO4InpHBpxIsteienKp6bHvFaU6r28LRJabkziOovMMSxkluONsPgFwiyXgkp6ftC8TDE8jw+yRITtgS7iNZ382TFiZezCFZhSrCu8kUmmuDfwabhWR06RUUUHXsosQ0vDVYxA/6L6NSpr0SYs5dWvUE90W3FzziuVMFT1+VjGvsepL2RmaDiR3UV1Fva6mMlvJCWyrnDZQoGRaWXWVUji6Uo1TnKk/L+l1pFK0tpBsktlZUCevIRa1J7OlDqmIMRyCqjOEUmfblEEBN1pUm9ztziJ5XVEyWCsGFKjY4uCiPUykfONEYQqno2YWPdRG9Sl18/2IHdSf35lxjyZxzIyMouG8tK9ilidnFP06opkm0L06VAqSLna97HpFJ44w2zhquSckw+t4P0+WnFKWLWLrKXCkeQ1WjYGeFTS52dcSspAJmMTDr5g/KMw5xJCsa07TawotPFv/ANK3EyRVWvvsTsAKDhxFXw7WamXihVOYaeSi19ep1Ldr9La7+yJRh/LpNenHZJ2aUz9Up1KkpvqIttz84QwGytzB+LEpJI+jm1H2TDUXbhKhei16gKWP8clFq9Y0oP4QtLiyF50CXU32kZ+2wMkPbyiLZ9Ef0rYNaT0mgSP3hE4pK2/+sXMbbmSF4guey0/004SAFwl9Jt+8I6cVuzQ+AmqTQczzUHsuqeCm159i396PcO3aomOklNjxRt4fViFc63Gjg6itE/bqTH+tHNPKE03MJKV7Dhn/ANIfhFL+XX33RS4ZRlfYUz2r6C5seLNt/FNvnFsZjPFvDkvIHazUwQL/APhmIBi2UDfaawWu35yaaJ+ETvNEhWIpeTFr+jTCv4YzSVpDUZGwWC3jZDo5pcBAPrjUlCKjgRt6wJVWmFX8O8BGYcIp04smLW23+MaZwy4+ctUqUAW0T7C7+fEEHFcIkeTRmFGm5iiNF3mJpV/K0VZUmGXsY4wSxpuaq03cjkOD+MWXhSZcTQkdwFPHUb36RTXpkw7mPidttoqCqyna/wD4ZtGSuWaJeRV+HJW/ZPxwTtoqarkdd0fOKBq6eHMtJSSClpF79dr/ADEaTw4GWex5jxTjSuIaqvry7yLRmepuH01K3CdOlO/sEYNTHyDg6G7c89LTLLn6SUlI28d4f1aclKk2yti5U6vWEHfSSNx573tAqrAaEuJOkL723O0KYOcQ5PPMPLQnQOIeJ+kkA3A8xz9kcdqjT3Qbl8Lz1WoAmJOTWp1A3bSN9uZiNKm3afNLliCh1J0qbcT4GxBHSJnScaop08404lTM0ApOtBO6k8j8LEeEA6/iXDNXWX6pSyqcPJ5o2PtsRceEWhZHEzE87Mr9FLFyknh60puPK557coTW466kCZZYSQbFRJB9oH4QMn5uUUoeh2SkE90oI+9RhJEwCLFRB/ZixiRJZLgyUyLLSoGxB6RLJGfkxYFab25c4rFMw8gbKUoW6w/k8SVOT7rAVtysb294jNlx3yjdgzOHBbTczTtiHE6zvaOlTMq4lSQ2VW3J6D2xVa8RYhnxoU6og8go2A91oklGoldnuEZ6baZlBYlqWPeVfxI5+8xinj2q2zfjzb3SRIvoqRrepmXllKX1XpACfG8BqnlxMOKUlhO1u7tFv4XpskzTUssNBKTufEnzMSr6GaXK3CE29UZXqnB0mbHpIZF7yMg1DClXpj6gtlVhDEKWk8N8EHkI0ziakNFlYLSVb25RT9Yw0246sstlIBjoYdbu/McnUdP2fkIQlxSVCxNuhgtJVXglIXZSb7iE1UGdSbNMKVvY7Qzdpk4wTdlY9kafEjJcGJ45RfYkDypCcYUoEsrIuBz3hFLaNJDihrOwVz1QAbcmmba0KA8TBaWBmQEk6dtrxVhVfceyTqmXFtkXSoWtaBM6wEvlxpJSQb84OMyb7awt8HRb7VrgwjXKYWWkvtXKSm4UBf8A46QSmuxTx+hxSaoxMgyc4tKSE2RqTsfK/Q8oRfbelamVtDS2oXsByMAXQ+0UL4Sk23JsbGDVMm0zDQbeBuBytuPxhoihZhpt98FpCEOuC1lC+rfkPA7dIn+AadMHHVJl7hK1zTCe6bWUHB64r2oy3DQFshYKTuB4eMXF2eqc5XM06G2olaGnOKq9r9xKlj4gRce4Zs6iUxxjGUgpL6glyUW5053F4d5jsvpy3qCuIq2ixsOe8P5GUQ1iumKUo92TUn2x3mSxxssp9CFW2G/tEdvTxXiY/wC31ES8yMzKJlU8tKppdnKGnp0igJ+8n2vq68uYIUxRX3Au2+0jGkVSjqqtLlSNlUYIv5i0ZYzMmVU7tSV5QJTqpS2j56pS0bYK20IyLhH2L6a4z2MKK8py6VVrXpA2BKFCD+Xcu+vNmRaDgQV4ckXRt0DbYh3mDTyx2J5FJT+bqLbh9tx84bZfu8POWh3P28KSlvYlP4RMi/cCKFcbl2XyHzPl1PhQXWmyRpHPWiMpLReSWq9/GNSY7IXk9mKCdzVkKtfn307/AAjL6kn6Nc6xoyrmvvshUi1MAzQ/JnCEskHUnEqnDb/NtiNKYYGrMrGqE8lTEuq37kZRwBMqD2H2b3DdV4o9elI+UaywgCvNPF6SLEiWV/AYyyT2v4fug48ldZz/AP5KzzVrJcxIoeu0Z6zbVrxrJn9WlSSfdLIjQ+cILuVimrHScSrHwjPGarRRjZlB5pkZW/8A5CYZJe6LkEsrgk4fxShZ3cpDgA/sqQr5RoGmrT6bgVYGwlFpPn9Uk/KKFykaLlLr5I1f4LmQR/oyflF+UuVUpWX55haFAeY4P8oTPhffoXAtuUa0dpXna8nEFzzQP6dMLJ660n+KLEWhKe0ZLLSRcyhBivs8z/254WVtdJF/7wjq4Oc0PgKb4C+c6dVFwuyNy5VGRt5R43oakMxQgXslq1v7EeZthLlSwXK6vt1JuOyUNyOZYJ+yGhz66IuH5fv1RXcr7MtkN5/5fPoTYOPMn+JMSbMVF805SXVv/Unzf2QMzPl0HNjKx69uI813v3kRMcxaaj+nanspUDemPrI9kZG06XxGGOcJsqGNZ1KQLJCvdeNL4XW2MnZ4lQGiabJuegWmM+YMY15iVJFrghW1uXei/sKyky9lVWQhsKaS8kG3P7Qh9KkSJf8AhdH/ALNy60HZSiqKUorpXmViJKtya0D/AAqi78LtrZwtLICbBItGeaPOut5r10ISFa60DYnyVGRRtsfJgKmuKT2RMeJ4e4rCr+H2kRmKqrTcLJuCkG3sjTdLm0nsiZgtLastVXUq9/FSIyzU13seluXsjNnxqwNwo8C7TG1AfZHIw1L6pefE7wUpaSQlSUnTq2t/x64dSKkuU9HFX0ufGGM4orknULACFr0oF+QSP5j4xwc0NsjdjlaGtQmDMz66ghwha1FViOW8CGGnZl8NEfygjPMuMKDK1hxAUdKk77G0EMNyYmqqi6TyF/OM057VY/Fi3ySOadhNyovaFahcgHTElby1baIUZpxQP6NgDE3pNHaYAdCSFAdYeuFanuEwUpIG7i+SR4xyZ6ybdRO3i0UEveRC5bA0kghPCU5/aJgiMEyCEf4iwD0sATCtQr9Dk1rLtQVMuIvqS0nVb5QOlczKAlzQqnzKkfrFKdh6rxIyyz7WN24Ieg6/JOVSN2AD0NoLSMgJVAQNgNt4+ksR0erIBpsxo3sptxJAv4bwZS1xWb6d4z5JSX5jTjhCriSPDCLhKbchFjSUlxJNSrbDlFYYTdcTPqaO5B5Rb0gFpp425jcRzMk3ZrhDggeJpVtu4cSB1iv5mQZK9QQDfnFhYzUoslQFze0QtxlQl9QBO0aMM2xc4LzI7OS8vL7kpSkbmBb7dPfBC2luHoUo/GCCpOfq1UVKyLYedAuLnup/nFXzuJ8RJqTrDbol+GsoKEJFwQbdY6WCEp9jBqckMa5LFlaNJKID8m7pUSdRRDw4Vpb5BYUkqSb2FkkeyIrggY+xJVHJSUqRWG2eKOMoEGxt84kTGJpiTqaqNiWnmTnW1WQ+kWsfH2j2QWVTg6sViljyLsFlYWQqSQ042QnSbPITvfz8YilZorzEm+zYkovpUARtFxUFSZqUSm4cQrkbbQxxVh0mScdbRcFJF4zw1TUuQ5aaNcIynMzTqZhbBfXdJ089rQgl+YbeSriKte6d4fYip6pHEE2hYtpXtaAiHO/zPqj0MKlG0cDIqk0TthxU/QwpTllBXK3lGn+ylh9uYqc7UXEFL0q2OGRsSFbGMtYVcD7iWCU352VyjbnZjllNy1XdDm/DbSfDrGrS4t0wGy+25Fo1+VeUtYIaUCArnDbHUqhWBptAdXYgbavOHutKKw0VLH2YF40dSrCMzpcB5dfOOxhx1OLENncnINKrEhZ9wj0EJ3VzjGufiEyXagrbTSlbsNAqv4sJv98bFlCRUqe6FjaWCTvz2EYvz3fVMdqGs23OplO3+bQI04I++xU3wXLmfT+H2NZkalksvsKKb7D6xIiD4Eb42ceFW/SCkuYVYOx8EHb4RZOYTRf7KWJGTyZW2SD5ONxXWXkuf6csBpUdnMMJI8dkufhFy4FWJY+lnG8tMd3dWQJ9BtfY99POM0hV5JaOkaszKbQ3lRjmwO88ne/7aYyfqHDcTDsnf79Bb5Jtl7ZNVovK4qCT90bDws8hWcuKi2ndxmWNgP2Yx7l0b1ylNnl6ahUbSwZKNt52YlbUi5VJy7m/Tb+cJn+V/D90FArXM9vjYEkZbTqW9ipfwJEZyzcQW8xVpULESzAt/okiNU45lEu0TDht+cxatP8A6hjM2eEvws2ZhvbaWYAA/wA2IKbtURj/ACQRx5SuNEX1SEynz/xdz8I0FSlI0Zb2FiBp9pZMUBkAOLVanLDmuTfA/wD47o/CL5obpEvlitQsNaQfP6kiM01f3+jLiWc4ontDy6t92dNh6ohudssFZ1YWUT+kL++Jsy2lefMs4bX4NhEQzy0jODDKwbaVpuf3hHVw/wA6CXoxE+xzmbqOYOBJVZBPpgUPZaHT6b0zM9ZFrcPp+xAbGk23N58YHllrNkvarfdEnmks/RGaWhXLRv8AuQfaC+/NAp8kPzVYUnGuUcxci7zQ9ym4l+NWXH+0bTmwSf8ABTyrHyERnNh5DlXydWLA+kNEnx3biZYwUn/rMUgpIB+h39owrv8AMbRlDAcnxM4Zlg2GpRSf78auwDQmVZZYha+1pmPduIyzhB5UpnPOuJ3JUoWP9uNMYIxA/L4FxRLWTuSvkdtoflvbx+hcUXlJUpqXw6gJPIGMnYXYXMZn1taQm/00QL9dlfhGpaVUnnsKNvEA6kFUZdwK++rMisONpSu9aPM+S4w6dtOVj5rhEUlErZ7LeP2lp7oq1gf30xmCfcN9gPsmNTqWR2YMwmlJAJrG5HQlaYypPHc7dDvB5PeM74OpVYbkW9fNQ38oSqoJSFJNwq5SPP8A4EJouZBo9Rzh5NcL0ILW2skfZCTYeccbWw4s14JEeROOBfDUdQGw2vFi4BoUzPOGabYuWzfbqkxWrrRE2CU2CzYRs/BGCmqXhmScLdnHJZvULddIjzfUc3hwpeZ3On4t+Td6EXMnw5Igt2NvCKxxEuqTtSckJRxSGeSrd3VGkH8Olbazw7i24iITmGEiaUpMuPdHExZqds7soblwR/C2CsKzWA35IhtM/MsFtbjpBKFEHl4bxQlXw1XKHXXaZMUh5a0qslxDRWlY6EEcxGiV0Flhy4YWCP1TCKpeZJ0MSy7nkTG3FrdjbM+TQKbuyL4CwxKUvAM0mrMKXUp1fESyhvUW02sL22F+cHcPsTjDz0nOMPcMAlpbibbeHnB2QptRddSqYUUj9WJG1SkKaFxuOsZtRn3cmnDh8PhArDVN01Fx9Q2UQB5RatPllrltIF9ucRui09PpGlI2G8T6nsaJQgDe0cxttm1KkV9iKlcfiIQm6uZ9cQ6ao0y7S3WJZOh4jSFH9GLaqDA45KhAh6n6XCQAL9YbGW0XLkqKn0qdw6+Jlh6WCtwUls2PjuTEHxRlzK4jxC7VJGZTIuvHU62hJUhS+pHheL7qFGDgOpu/mBAhOFW1uXaJR6o6GPVOPMWZsmnhk/MiGYGoH5E0d1mnSBmJ18jjTbq91W5AC2w35Q3q+FJzEdRXN1dtvjKASFJO4A5DlFmSuG5hCgkuEgeMGGMOgJBIJ9kBk1Mm7bBhp4QVRRDsIUN+nSiJd5fEKNgq3MRLZumiakltqRcEGC8nQl6wEJt52gz9CuNN/WDbwjLbk7GOkqMN51YedouKuMGyhqYSN/OKqbbKnNrkRsHtK4YQ9l+1V0MkrlX0hRA5JVtv8IypLSdpwJIsI9T0/Luwq/I85robcrfqG8JMLTPBYSdKbEk8ucb07MTDasMVdxbYUorbTq8LJjJkth1imYdkX2k6lzMuXVEdD4cvKNadlqZbOCqoXClClPpOnkB3Y9VpdK4Q3y8zkzn71F3Kk5ZdQStSL2HjygdiWmSr1CcbCNiRtfzgpMTUq1NbvpvbxgPWZ+XNNJL6bXtzjVBc8AirdPZC5RSE2sgCMT5oMJmu1vU5ZJKtU4y2B491EbU+kpdMtLKQ6kjSLEG8Ylrcympdr+beuCDV0DVfbaw+UPww962LySpGkcYSMo52bcwEcMBbRcKbdClSD8op/BCUKznyvAX+doCkq3/z4t90WxX56XmMj8x5YvIv/WSEggnnFKYHmEpzTyneU4Eg0xSD5WeeT84DLCn9+gqyaZj0xoZNY8fKDqbmwUqJO3fSIx8g/b1dRG2M0EobyLxuoOJ7z19N+d1iMS3HGUSLXAg5O2Cyb5fLKcRU1Sek2jf2iNsYVXMjtCVQn/KUtokW52IjGWWjaFVyQWe8EzbZ+MbelJhpjP1+Zltg5R0D2g/8oqS91/BlxfJFsXyq3qBgpCUhJexa4b+J4q4y7n7LqZzqnW1EEoabSbHwBHyjVmJSXcP4BTff8pFui3T6xZjLOfqdOd1XSSSR1PrMV/8Av1JN8CfZ6cIxrMNJtdcu6Bf/ADSx84uSmTrho2XXeAQh1Av13QR84p3s3hDmbLDCz3VtPD/01RctNltWGsvnLXBnkIPxEA4WCm0Xewz/ANubCk3VZs3iG56t2zMoLngoHzO8WDR2kPZtrdJF2gUkxCs+WkflpRHU8w4B8Y14Jf8AIgv0Bn+UgWIH+J2jsJJBFki/wMTLUV0LM5XiUe3uRAQtM92ocPpWbpbRffpsYsOUQl6i5oNgg2ctf9yN2RVGvh9RUO5EMxn2353JzwDqL+9uJ/juWLXaZoxbdA1Ul4XirsdOH6RyhvyDyRb99uLMxu7btKUcqIP+CXgL+oxzpL3vmaEZnww3fOt9Pi6rf96L4w0wUUvFTQJuWVn3pMUphtATnk4AQApRsbftReOH0L42IAlwDUyoi48jBZXQeNWXbhxCkZeyy1DYywNvDuxmvK9xDmNKoALlVauD+6uNMU0uoywZUgDaTB2/sxkzKibf/pJn2m9N1VTVpUP2V/hGTD7zkOmNJ0kdmnMIgf8AfQF/30xlibJJN9+6Y1LNzJPZhx8haQNVbTc+eoRlubUCTyvY8ouXczS7ja/+DmrHqIduErlU8iASkjrDRZtTGzbkuCFOaM02UXKiVbeMYNXi3xdDcMqY2RT/AEifkEBP25ltHvUBH6GytIbZkmWEAANoCbeoWjHsnhtilVDgT6EqeYmJd1pR2/TFwfZ90bYb0KYS4k3ukGPDdSnuSPUdPi43aGHoLSG1JCQSYBzVFSp4nQD7IPzDhbJIHKEGnVLFldY4M3R28ZFpihsDfhgn1QMcpiEA6UD1AROnmErvflDJUkgKKtNxEU2NIsxSbkLULD1R08wlo2A2g+4nSk2HKAs2sFyw3inJsKMR/RGBw9ahuTEsYOlgW6xGqPqLQFjEmaacSykkEiCii5A6el9VldbwwcaJAChBqoam2b2IgMXXAQtadhsYJrzAFhJoda0qT0hmKSUuXRcC/SC8sApNwbiHOg2sBYxSk0QGMygG6hYwQalu8AoDTC6WgR3h8I4UVAaUnlEtsGh4wlpCgRaCCtDqALWPhANLpQvrDpt5SiLGGRfIjKiu896YiZySr+2yGQsexQMYn9B2lXWwbqaTc+d7RuzN5YVk5WmlDd1jR7yIyZRaAuoUt15pO0noU4D0ST+No73TJcbTi6+DateRMuC29hyRTbvegu3PmEq/CND9l5tC8s5pZbSCZk/cIoCQQDTGEEXSJVxII/sri/uzC62jLaYSV7+kE2ty2EfS4r+CvgjzKl7xdL0u36TcoBgbVJJl2TKOAkjqCILuvtB7e9/VDeYW2pGnfn4QmI5giYlECmoGgJCU7DwjEVIbEz2ry3tZVXO/tjdlSWyijOE3FkHp5RhbBKkzfaraWsXQqquH4mNGPzEZTRSpNpzJ3MZOgE3nLGw6JMZ2wpPLaxvlq5bUG21N+z0pd/gY0fKTcu7lzj+WSuxWZzax/UVGW8PvhvEOBHr/AGHHUkDpaYv84bngt/P3wAi/82uGMi8TlKQkLso28dQjFBP11uZ0xsfOSY/7Gq0wknvJBPvEY25OJPLu84yyjRUiyMt1H6QYGk/4yjf2xsdx1Upmy04Dsqljf2iMfZYtlc0ypIBImG79Y1zWg8jFspOKFryOg+qJGNtIpMG1OcWuiZdar3NZUojx76vxjNufrnGzxrarDukp2/tH8Y0tPspGHcuFC20+VH2kxmjPFKDnliIJOwJt/ehmSKV/3+pLsb9m8k55U5rns+P/AElxdkioowpgVJChpq+myeQs4oRSvZrIb7Q9LQrxmB/6K4uxtSW8KYUKrJ4OI1D2cdcJj9/5LL5wsr0jG07MjmVbGIdna0peI6U4oXAUdzE2wC2n6VmXF8yo7+2IvnWlHp0gq9iFkg+yNGP/ALKX6Az/AClLUF30jtQ05W+lLew8tMWdh6z8hmahI+0+R/AYqrBaTM9pljSbjhE3/di3MCIDxzGb03vNED+6Y35+Iv4L6oTjXJV2MXOJW8qWCR3Jkc+n1iIsrMF8M9oOiuqvY055O39kxWOMW9OYOWkuQQPSxsf86iLfzKkGms86GFkpvT5g+5EYZtbvn+xpSsz3QWgjPABI2uCb9d4vqi01SqhVbXCVMqO3qilKQ0DnfLBIA1iwv03vGjKXKPsJqLqLH+rq3t5GEayW2h+BWWhJyiGso2yCL+gA3/cjG2UdzmbN3tc1NR/gXGx2XVnJCXduN6cn/UjFGVMy4nOB9hsDUqorUB+4uMuitvJfqHk4o5nyR2ZMa3NtVcT94jMk0PrSOe3hGkp59R7MOL0qT/38AT7Yza+NyfFMOmuTLN0NnrCkIF/0htEoy9VK/lnSkTiQpkzrYcB5FJUAYi74tShub3EPaS4ptPHbVZaVggjneFSjuTiSEqaZqTF+D3JuuLckglt9JAsRspINwR6ouakPFVFlwsnUGwD67QCyiflMd5bSGIphgmbavLulX66difaLH2xKnJRMsjQlJSU7CPl+qxzxSlin3R7nDkhNKcfMaOXcXY8o9AQlVh0jh4lKTY7w2U6pO4VvHLkuToYx6VII35QmtSdNxyhsJlN+9tePi8kAgxQ9REZspSg23gQmXlFBS3HgFHci/KHc89ZohPhFbYnqtSkGyuWSpQOwKRe0WlbDLHlqtIShDYWkWO5vB1FeZ4WniJEZyp9eq6nFKmlcRJ8EaSPjvB1rEEwRYrJ25RoUSNF2KxDKuLCXdNhyJhQTVNmpZaNSNxawMUhUPpGryVlTMyygckMK0lXtG8OMI02uy83w0cZti+5eWVExJIBxouWmpHo+m4NtrwQS3p5726wIpSVIb0nfzgxrBTubRnYB4VgC5+MIKJJuOXUwstG19o50EpveCiUxJRB+1e0LsJukEHePOEdhtC7aAkbCGR7mefJC8z2HJ3BKpBsalPOoRp5X3iE4UwZTaRJYlafVrSqXcSVEd0DSSD77RaFdlfTg00pPdC9Sj4ADnEWzIU1hrLOaS2gCaqKCkpV+inr99o6eijPLlhjh3bMeocYQlKXoUdSJgFptgk/mVp36bKjRHZeOrLh5sgE+kHpGYKc7wKjJpUb3a997xpfsuurThCZRw1KHHJChyEfVk/4dHiovkv5xoX3TCDwSkCwBh4qYTqsWXPXaGkw80Dsy57ozqRoBmIpkJoEx3RcNqPLyjB2WLgX2npJZ+yqprv71RujFDyPoCZISoANK+6MG5TK19o+nKtcKqKjtuTuqNWF0mIzeRqLDrXFwRjVlA+25OW28QoRkqlPFqZwo6oEJamnUgj+2k/ONi4KUheH8SMhhxetyZBITtfvbRjRAUilUJ+xumoTCR4fZbNh/x1jTqJre18PoLS4s01nDLtryUrSw2LpYKr28IxIoBSk38I2xmtM8fI2rJbQs65Ukki21ucYmJ3b9UY5skuxaWViw2+Dzs+309ca3xZMASErMJFrM2vGQ8rVKM2E2uA+2fiY1bjJwjBiHgeSAPhDMauSFitRS3+TmXZCx3nQqw/484zDnDocz0xChRFwpVr+uNGzrqvyUwOq/2A2feBGZM018TPWvE8lPFNvYILIu/wDf6kXAnkZMCS7RlI1C39bcbPTcoWn5xcM3OqXgykLItw8RLPq+vVFI5fkyXaTkE2tprARbwu5b5xcM8lxOB21WNm8ROH/1zCIOuPh+4TRqPAoUt55w8iYiWdrauAy6f0DziW4FCkyXEF9/GI1nKku4ddUekNx/9hMuSuJRWUZ9K7Rtyb6ZdfwTFz5WNh2bzAQrkueUkX8gRFL5MAN5/uOq3CZZXxAi6cnrOjGrwJIXU3AP+PbHR1iqM69F9RWIqnMBIYzty8Y56Jwe7iIi1s3Xw3njQV6/+73xz8UxWeZ7aU9oLAaQLWmQSD/nBEwzwmi1m1QF3sVSjoB8dv5xztm6UP7/ALD7rgqyltK/pip7nTc3jTMoq2HZ1wbqMuv/AFTGeaakIzCkF2FyDvaNBU5p38m3+/e7Kh8IT1CLuI7ATORUVZCyZJ509It+7GKMoAX+0aGgbXm3T/CuNl0dbi+z/IrBBHoRA9lxGKco3XEdpRIQoBZmnf8AVVAaKP8AN+LCyeSH9WCh2WsWr2srEZ39sZncG5F/0Y0ZV5pY7L2JmFn7WIz7diflGdVkFagP1esXlXJlmN5s3o9vMQ5pf+Kk9LwhMj/BJ29sL0yxkb+Z5QEe4CZtDsxO1GXyMn5iTl1TCGZxxakpFykWG9osOXrCas066NlJWQoW5RHexZxzlvUkNBJR6Qo3MKMzjreduKqO7pCCpLraEjYeNvhHk/aDpqlOeog+yTaPS9M1dQjjkgjNO8Ibcz5QKdmSFE7A25w9qS9N4AvvoCe8bkx4aSPUYR2icNhqIPqjxycSlJJNrQNQre8B8Q1L0aRUonSAOcAaW6Cr1WacuhKrk7WgLONh4G6QU9QYi1FrCZt4qDmrSbG55RKlVGRYlgp99tO3K+8MUWi00wQqms3Nmhf1Qwbpzi6klISQm/O0FDiuiNTAChxEg72MEEYmwwiV9LAXe/5sJ3vDkmMSCtJp/DZCVI6XuRBuUYLTm8RmUx1SCbqOhHTe9oKS+JKbOpBZmW735ahASTFzRKmZltsXT05+UOW59DoGk3iIO1lhtskLSb+cc02qoW+kBQN+t+ULcRBOy8S1sRHba9aOcBGJlTgFh1gky9YefWBTojH6RsL8zDllNgSYZsuFSvEecPUKAQbw+PcyZGAanVpKn1dpmZWhNxqOo7AXikMy8eymNKpXGKY/xpKmSiG0rTyUsrOsjy5C/lArP6puO4+lpdt1QS2zbSknff8AlFe4SI+iMVI6qlkq/iEfQOhdGWLbqpu21wvSzzHUuob28MV27irzvAmaYsnnLoV7yY1H2WH0fkXPN6rkTRJHsEZRr5LS6Mq9gZFs/wASo0r2X3XUYeqBQ2V/XDkfIR6dqo0chO2af4ibmGjriCsWMNTMTRST6Kr3w31zdwfRVH2whKjQI4rCfyVnFEf5FW/htGDslUsq7S9H4h7hqKz8FRuPF8+63g2fQuXUk8FX3Rg7Jlah2haM4f8A58k/GH41aYjL3Rt3LRth2n1ttwDQqZfHvJjC1QIboFObbJHBrUyPelv8I21l+uZYlJ5Lcq4tKphw3uN7mMOVnW0mYaXdPBrLl0nx5fKHZo3kb+ALVJGq8ftszHZqnn0putdKCwR5tgxhRZshojw8I3DXptyZ7MSylsEKo+km/Th2jD5+y2o8hGdop8otLKFGuddP6rzRt4bmNQ4uv+QDgO9mvlGXsnjaozAAtu2o2/tGNQYsdSrLyY5Ahvr6o04u6FWJutKVg7C5030paHwjNGazIYz5qqTspTiSSB4oH4xqVSFHBeH0pHJLNx7P5xmLOlJZz+qWsb3bJ/8ALEFPm/vzIn5kbprop/aXUsnSGq4lW/8AngYuurrW3l9MqABSjEbqwP8ATGKKxlqp+f8AWltiym6iXQP3goRedWeCsqajex01xagR5vE/OMn9QaNUYQZLFNt7oimayVv4fmEg77CJphxFqU2bWugbRD8zgBQnyOYGr3Roxc5kyPsUNkm2FZ1zIPMS6vhF05KJvL4uQnkKq7FK5KrQnPKZVuAZZfsO0XRkU8hyXxZpIINTcN/bHT135J/BfUTifJXeagQntFYGSrYcUE3/AM5BztBFLGP8NPq5cJ1H3QHzabA7S+B0ndHGRcf6QQT7TUw2ziHD7o/RLn3CMOH88F8f2Gy5RFqWnXiiUft9lJN40DSLjCxcO4U0bW9UZ4oMyl2ek3CeaOcaFoVjgOWOsAqatAdTivdY/TsM4dmVKyElk8kIlVj4qjGOVf1fanQkdZp7c9O6qNcYfnEpyLeAVs2H2xtb7K1CMcZaTSh2oWnNgVTa0gc+YUIXpoV4nxDyPlBLELYHZcrz464mWnf1GM7J+0rV+r4xoXE7yk9lirt2tqxQ5c+xUZ7QCqYUdhZIhWTlmafCE5s/4GWNriFaVdVOG4AJ5QnNgfRDl7CFKSEimA35mF1yKN7dig8LLSqkm95k2iPYjqSKZ2nai8tQSlx1LajfooWgv2NQ6cuqklva8yd/YIrzOlb8hmxXJtSgHApJT7ALRm1GFZJSg/NV/g6WGbhGMvQtOsbhW28RxaVXuReO6HXm8RYNkKshQKnGgHLdFjZXxBhQLGrexj5LqcUsU3CXdOj3GnyKcVJeZymX1I584i+K6e87KKQhOoqFhExZcQlwA7CE55tD6fsg2jKpU+TWyhvyLrrE4tyRqT0uF9UAEH3ws3l/iRaS6a4Ss9FNX+cXYiSZUkApAjpUilN7AeuNKzsOKopF3BWKEN7zkuUjnZsi/wAYSRhTFS2g2lyWAv8Ab1m3ui3pyUc0EFfd8DEedLjbpSNwfCHLNY8isnlzW5pm8zWUC21mm7/Ex49lhU2V62qrMDe4Ow+UWTRuOGgEqBSd9zB5pla/t2IPjFSzFS7FL/kdixluyK84UjcNqRc+/aJVhqVqsm6hqdKlgq3WYspuSYIvYXHjHy6ezruEgGETz3wZpLkc05pXDBubWtaCjaQkG43gdLuhkBKuUOTM3TcWvC4u+wuT4CDTmhy0LzMyJeSdeVvoSVWHXygYh4FQMEJBxExUAl1pLrYB1JULgx0un6Z6nNHGvM5+ryrHByZk/OCeZqOOJeZZCwlTPeBG4Vfe/jEbwsQmnYsJFv6glQH76YmvaF0t5rtoSyGwWE209RcxBaI5wpOu8/rZAp9y0mPsOLGoRUV2o8Hke6bbFMagIRh0gHvUton3qjSPZXebFAqbZIvxEH4fyjNeOFEJw5ta1Mbtf+0qL47MbzgTUkNDVs2o/GLkgo9zW7IChfnCiU2VsBAuUmJsN/mx74celTI/QT74xSTs1IBY7SVYOqFx/kF/cYwTkvb/AKwFDAA3nvxjd2N5x4YQnwpobsLH8JjA2T7q2s/KIsDf08be0xpwLgRkN64ObSlE0EpAHpC9recYLxdKqOI8UtNjuy1VdWRbl9YoRt7Ds5UWXZkIYSAX1HvHnvGLcUViWkMd5hSE+lKXJ159De17OB8KG/qvDpLlsGcqo0BLodmeyah77QXS3EjryCh8oxGRaXSN+ZjamB6t6f2R2JbhpUpDEw0ST+0s/cYxWfzdgOSyITIC+C1sk2i9XppoD/JpP8X8403iBkry8myb7Mn7ozbkKL4wmwBuJe9v30j5xqiuyK/6Mai6rYol1qt7IPFKml+ourHqpEnL+huNmyuGyDtyuBGUM921NZ+TwXbUpDSv4BGyGJZTeAKQ45uChlXwEY/7RS0q7QM8pJFgyx/9MQW69335hVwQrNhv0fPytJue+ttftLaTFsOTBfySqE2RcGphem+++lXzir86dIzzmXU3Idl5dd/W2PwiwKaoq7PdQWRcCdbNyfFDZhKXJZt+jtlqmoB6JiB5oqH5KTSxfZtW8WRIsKTIcogGZMop3B06kJJOhR+EFhmnksZKLaZnjJlvVmtNKTzDC/XyP4RcnZ+uqg16Yv8AnZ5aviYqzIqVDmYtUmDchtsj3hUXL2eadbAFRmLEhU+6L+ox19fkSxzv0X1EYoPcitc43NPaNwZvuHEEf+YId9pxCnDRpm1kgub+oCHma1PbX2ssBMKSDrUk2tz75h12qpdEpgiQm9BJQ+tPq1Ijl48yuA5wbRVmFit9uTKCSQmNG0hSpbBkgFHZTQVv6rxmzKKdTU5uQlSUpUSd/VGg6msyWEkMelIK2GrFItcDlyia+alKKG4I0mQzLPF+IMRu46w9M6PQqetTkukC2gLKiR84ofLhWjtOyYUdN543PlvGlMjqKwaRjiuMq1GYf9HVty0I/wD7GMx4OX6P2l5VSLf+8FD4mHQmveS8q+hU0+CQYwbCeypOvg913E7xHhtqjPKSUzLif2RGh8ahY7GkopKu67iN9R257KjOzPemljl3QYxzdyEZHxyezgJpDhEd0kj6LSLD2R5NgCkuc+R5COaTtTWzaB8wEb27HCeHlZPL5EzSh8BFZdofUjM+r9NaEH+GLB7IjjiMrZwN/wDzSufqH4RXXaJW4jMeZedPdcUlAI8kiBavJZsv3EM8pauV0mZoSl7NXcSPWd/vicLeKHykchFOZdVenyuNKZLtIe9JmX3GnibcPQod0Dre8W5UzwZlV9rbR889ptKsWqcl/Vyen6Ln3YdvoPETF16U84c8U6CLxHGZw69Q2gxLvh0c48pJcnoIuwkwq9odobCk3MNWUgWVbaHzZRsOQgA1IYTVMQ+khSlC/gbQOcww0tPcK/I33iUhKFHSIU4QTZPIQyLGKZGZPDzrRumYWkeFoPy9OUlABWSfEw+aCCnewhylLepIJi5NgzmMRKKQCeYjh1uxuDBlQRoIB6QMmClCSCRChG4GufajhL9thDabmkJVpvaGfpXesDYw3GLnKiQyinHphuXZGpbiglKR1JiZS9ETTFhLi7vK3WfPygDgiWe9N9OCQSnZF97ecSeeE2Z67ik7+UfRPZnQRx4/xEu77fA8v1TUOUvDXZGS+0ogN5qSy07AsITceqK+ke5RaosDcyah/EmLH7TrSmcbyTiiLqbRbb1iKyYVpwvPuAC3D0Hfx/5R7ReR52fDHWYpCWcKFPWktm/tMXZ2XF2qNTbJ/wAi2r3ExQONpxU3S8KrBPdpqUe5ah+EXn2aXCxiicaJ3VJ3t6l/ziZOGXF8mwJV1JaA25Ry+sJUO9AWWnHQSBYQ1mqg+qxO9vCM2y2alwjzHLzf5CVJV+8mXWR7owXk9ZWfNCSQP8fB29ZjaGMZp9zBlSSo2Bl1i/sMYmylfU1nXRHkmyxPJvf+1GiEaETds3rJtcJbqtVrrJ2jA+ZbLas3MWazumdfUn16v5xuhT80ASQBfwjD+ZMvqzexUFqCSJh5fr6wU2trKkrLjyZmlv8AZym2D3g1NOo9V0p2+MZRmE6HXE202dO3tjV3Z2Z9KyQrrNtQRNE7i+5Qn8IyzVWi1WJ9v9SYWnfnsoxnbTBa4stvs9LAxtNhVrGWF/8AzURrHE0+yrK2rS7I76pZXe9kZFyBJOP3kjkZU3/vJjUVVVowRU0E3/q6vuhmKHvx+KFp0S5h16Yy8pyNJ7jDYAPPZIjHPaESpOec4lWx4LH/ANMRsiRdKcGyqCLkNI3tz2EY17Qrinc952+31DAH/lJi9tOX35hXZGM5UEZoSTxO71Nll3/dt8omtFfK8jas0VDSmYZV6iUJ/CIRnGoqxlQn7WC6PKqB/diS4Ue15K15pe5TMs28hb+UC1yDZ+m6aKlErovvESxZhszeFaggAX4KgL+qM6vdtjEmmzOX6HP2ta9/hAKo9sfGM5IPywwSwyHUkalKUbX9kYcWl1UJe818zbLJGiTdm2hGcxli/UEhMuEpO3W6oujIOkJl8p3Aq13Z18+5ZEZNyVzhrmEq1iSalqexMJn08V0OA3QRe1reswYwb2t8RYQwwihSWBkVBLbrivSCtQ1alE9B5x1Oo4NRkjPbVPbX9lz/AJM+PJGy3czaQlXbRy4a2IKNfuUs/KDvaqw23NZCVGfQkFUs4hweXet84zLiLtJYgrGd9Ax/M4UbZmKQ2W26eVq+tB1b3te/ePuh/mX2r8VY8y8nsMTOCWKZLTlkuP6lqIAIO1/VHKjp827G0+3f5jt6pjLs/wCD5WrYkl3p+XMw033lJUogJ5gcvONDZm0ulYMycfqcnKJacnHA1rvv48z5JjLuW+Op7C6Wp2QY4ikblBvpV64luamedbxflXI0CdobMk224Vh5sqJWQCLb+uOnqtLkeSE4/lXcCGVKLLu7JyfpfI3EE2tQUqYqb/Pp3ExlfDDBT2pJSWKtxU1gn1EmDmTHaKxFlbgSo4apWDW6y29MKmvSS6pPCKkhO4CTcd3yipmMb1OQzEOLmmEGdRMLmA0b6QpV9vjCIRnHJkk+z7fIt5E6Lpx1KBPYTokwFfnMQzO3tWPlGZWlWnXR+yIsGt5p1is5J07Lp6lNsyNOnHZwTgUSp5aySRysLaoruXIVOvE22AhVSt2Im7Q4fNqY6LdDHNONqS0fL1Qo+Cac54EGEKdf6NbF90w2MbYs3V2Qb/0S1Bwjb00pB9gPziFdpiSW2WptNjrmVn2cor/KjOfFuAcIuUWhYcYnpcvqfW85qvqIAtt6ob5g5n4mxnIj6YozMshBKgUIVsb+cG8b37jQsq2URTADyhmdQEnrPt/FUaVxRKFt1TgG0Zqy1YM3m7h9BNrTza/cq8a2xLIhTZsL2EeB9r/52P4P6npOgK8c/iVSuaLa+ewgnJVKwsFXgZWJNxlalISfVAZicU2oi9rG1o8hSkuD0SbRZ8rPpLIuRDsTidiFC3rithXVS4Cbkjxh2zidFrLVseUKeJ+QamWUxNJC7he8PDNBwWKvWAYrpnEzQF9Y98LtYpZuFKc0iLWJhbiwi4gI1A+8xwmpIKAde4iAu4ulybJdO28NzihrWRrHmYvw2U5lkmrNhsqJ36wHqNabS2fhvEFdxMpY0tEnpCPpjswoKcPsiLEA2GHqi44skKJPrgnS2HH3kKWbAG+8BJSX4hFhziZ0iUCdI0w1JITLksTCraJWlajYFRvBOdmELQFgi4jOGKs1MzKHiuepNCw/LvSEuvQ06plSirYXNwR1iMu505yIOkYbl1nmP6uv8Y+t9K0uzS4/gjxWszXmn8R/2rWFhygVIDuqUponzG4ilWpoN4VnGTzc0ED1E3gzmZjzH+LKFLSuK6M1KSrT/EacSypB1Wta5PK0RVVzRgL8xHVRz8jtj/EikjDmFHFbn0VwX9Tqvwi6+zY8tzHyytQCFyblj6lJjPlVmqpM0qmMzLFpWXSpEu5oI1AqKlb9dzE2y9xBiygzqZzC0uH53QpAQWyvum19vYIKSsCLo32lICjvzho8gHUL73jL7WbuehRvQGBbb/E1fjHj2bGeHEBVRWATzAkz+MB4f6mhZeDRGLWR+QNXd6olHFe5JjDeUpSrOOhKINjOpPxvFlVvM/O6ZoU4xN0dpEo4ytLqhKFNkFJB3vttFMYQnapTsSyk9R2y5Psua2E6dV1jlt1glwLlK2fogyEvJsneMQ5vNej5+4olz3QXFq382tXzifS2avaBZTolsPNOqUNiaeT9xilsbVbE1YxvUani2XTLVh5SfSG0t8O3dAHd9VoCavgkp8cGkuye429lpimVWQeG+2spI6FCv92Ms4rabaxxXG0bJTOO2Hh3zEwy5xrj/C8hUZXBCEL9LSn0kKY4uwJAPl9oxAKm9OPVeeeqCdM044tTwtayiTfbpvCVFrkjnaosrIuaTLY8eUVabyqgPemNPVCf4uHJ1F+cur7oxlgepTtPraJiRSovEabAcx1i8ZXE+KH6bMhUuoo4Cgr6s8rR0NNh3JO+xnlKmaRZcJwq0AQClpNvYIxpn07rzzn97fVS4v8A6JMS2VzOzddYDQw+CxYC4ZVe3je8VRmBVapWMfzk9V5cy86rhpcaIsU6UJA29QEDkglbTLjKxXNh4OT2FXSdzRZcEnyBg5hF++WWIGhudTKrW9Y+UV1iudqM65STUUEJalktsEi10DlEkw7OzbNBnpdgamnW0FzbwJt98ZauQy+D9PZenU9cmkJkZYJHQNj8IiGNpCly1CmSJGWGptW/DTttE4kP/d6fVEDzIUBQJpQVazatvZGfTrdko0N8FCZCplZWVx84WGl90oGpANhZW3KL47PtKpqsj6UoSUuVXcKiWwSTrPWM/wCSytGF8cPEHvBQ/hVGhuzy8j+henIB3GsfxmOh1LDswzkvWP0YnHLlIrjH0lTl9vLBTC5RgoDCCU6Ba/1ltomXadkpFvJCpsIk5cKcKNJDYuO+DttEFxq4V/8ASCYZFz9Wwj2dxZ+cWB2jf6zk9OlQuEqRy/tiOZHHc8P35mlPhlU5HYflJLKCuzTkq044oiy1pBNtJhnnuiW/oPozZYZb4QK7hIG9gPnEpyxBZyWqugbnTceyIB2j6kJfLejSACtTqAfZHSyadfiG/vsLcqxhDszz8ocpsUtONtKWhhO+kX5LHzjNdDQyrNMLfQlbfpDiiki45KIi7cgG3ZDKfENTUvS3MpcZF+RKE3/2oo6kOFOM1vp/XcVc9dlQbxJW0Iv1JjjCUkmeytgt9DKQ+/PTq1LA3ICgPlFNy5P0g8AT0i3scPFPZvwFLk3BXPLt/pQIqKXsak8fC3KMWVVMqx48CacpNrbHeE6Uk/R7V+vjCq03klC3QwnSLmQQAdvAwcWrKNy9k/DlPqGTE89MybTrnpyxqWgHbSIbdpCkUmiZesSbLTLb77uoBKQCQIlvZHaDeQS3CoBS5p1ZB6jYQDzoo7uJhVamptbzcowhiWQkarrVckgePKAjLdncX2VfQ0RXu8GbMlaa5MZ0UR0tktJfWrVba6UKMa3rjIWg28PCKnyeytreFJ+WrGI0CVfKXHWpM7rQFiwK/A2vtz8bRalSmCdQPvj517X5oz1UVB2kv3Z6noMHHFL9WV5VpJJUoKA9cQSrUlaVKca2PPaLSnWEquQbiI/OSQIIAuPAx5KE6Z6Jq0VM9MOIcKHQQRDN586bpUbxOatQEv6lJTY+XOIZPUiZl1/ZPPnG7HNSFSi0M0zU2FbLJhdNQm9NtRPthktL7ZsUmPEvOJO6TGlJUDyPvSJpat3LX6Q6ZU4ba3VEjzgcnirN9JEEJWXecI1CFtJBJBWUdGkEXiQ01lcw4kAH1wNptNUtaRoMT6jUkMoGod6M08iT4LUR3TZFKUJSU7iJbTJdKee8MpOVQne28GZQAKtCVLkklwTZmjyrlPaJl0FRSCbp8oRboMkJi5lG/wC6ILyLyBIsgkE6Bz9UOQUrV3QI+16aTWGC/RfQ+d5V78viZu7YNPkpfKKjqZaQhz07mBb9ExlFjS7SQCCbIjVfbHeUnL+iM37qppRt+7GVaYAql+AKd/dGqC7WZcvBatepUs52a8DOFlIdXNPJUu2/NX8ol/ZspLSMxaaX29aHW30JuOZ03+UCsRtBPZky+PP+sOKVc+KlxLsi3kSlUwxNgC6p51ok+BaUPvEaNRGsSaJjdmpJmhyQeP8AV2/cIYOUmRLt+A2D6ok0wtClatt4EOFJeVvyMczDOTXI9pEZxVR5FWCKu3wUjVKOjl+yYw5kHT0Tmf1CZeRqQmYWojxshX4RvTE6kpwnPkm/1CgPcYxZ2cJVLnaOpxI+wuYVbp+bXGlN7WxbXJuClUuUbmzw2Upty2jD/arpwY7Rk+llvSHpaXWAnr3LfKN5SaNMxcCMbdqiRKu0xRtIGqYkmB7eIpMZ1K5v4BzjwAOy02w5i2uSzwCryOrfyWn8YqvMmQTK5t15hsdwzKlpt5i/ziy+zKv0fNGqsmw1090W8bLQYiGaMrfN2ortspSb+fdt8o1Y42Jo+yPkGJnMxph9IKTLuHfxAuI0iaY2iRnm0oGngLv7oztkStJzdlAbDU26Of8A4ao0q6oITUUH/wCWXfrtYw2ON2iid4eo8hN4WlEmXRqU0i5t5CMZZ/yTUj2g65LtgJQlTJt/oUGNr4KdvhySUSPzSfujF/aHdDvaNxCsg2C2rexlESUeZL77lEVzNkWmsD4LnmwLuyq0EjyKY7wcgKw7Vrj/AOGB/ih1mGov5M4KVa5bD4PsUAPhCOAAV0KrgDf0M2/vCMzVchM/TuR0/R6QfCK8zLKE4fmzf/JmJzJzDX0ag8RNiPGK4zRmmk4Wn3C6kaWlEC8L0kH4tjp9ikcoUoby0xdMJ+ypbnL1G0Xx2fnR/RJIb7grH8RiicoXJdnJfEKlrSFOOuJsefLaLqyImZVnKmXQHmxpdcHP9ox2eordp8i/VfQRjl7xX2IXTNf9IjSwOTTSNvUwT84sDtDOqTk7UQDzKL+XeEVYibaf/wCkSQoOpKU90HmNpeLM7REywnKGf+tQVKKQAFC57wjkQjtniX33NSkqZF8s1g5PT6DspSk/dFQ9pyYdUcOydiAmV1nyuTFkZa1GXby0cYccSlTi0oAUrytFo4qyxwZmDQ5CRrKUBSEoSJlggOBI3sFeEbtTkUMrb++BfeBmrLdZluy1UXr2Kak4m9+hZ/lFGUhV624s7ApcP8Ko2DmzgHDGV2SMxQsNTcwqXmX+NpmXQtRVpINtox9SQPTnLkD6p03PL7Bi4TWTHuiJd2SjHziBkhgBgK34E0sjwu+R8oqiTJ+lX7eAizswCk5b4GaQsKKJB4kA7pJfVziGUjCddmJ96ZTIrbZXYJccskH1X5xg1LSlZcVYhoWuWUlIKiQQANyTDyiYfqipdttyReYHNSn0lAHvidU5LGHJJDIS2p613HQNyfI+AhvVKt6W3xG3CCL3tHPnqtvCDUCR0fHNVwcxKs4eqkzLmWTpuFbKvuduRBJMbMy9q9MxFl3TqxLTDU2t5sKfXo0lLtu8COhBj85ZicWtf2zzizcls3ZjAOJvRJ2YWukTagl9snZs8gsDxHxjj695ssPcfP1NulnHHL3ka/q7rZrDjqlgLWopF/IfyiNTxCr2+MC8Z4lal3qROSzoW24sv3SeaCAPuUYXceDzetCrpVuCI8/7V6GWmnim+zj9Dt+zesjnhkS7p/UFuqsojcQ2dShabWsbQ9cQFHxhBSABsI8jR6lAOaliF/Z9ogTN01uYbKXEXPiIlDrRULg+wwxdZAN7Q6LojRBJzD6QrupCoYnDylKFmyIsdMo28Nx7ISVSylWw2h0cjJSIKzhtwWJbUbQVk6IQQFAD1bxKW5FYIChtBBiTQ3vo3MVKbolDSmUtDZBCbX6xKJKTCUjbn1hvKSxNgRygu2kAAb28IzNlMVshAATuesOZcELBIhugJ52h02sXuIkXyKmS2jzDk7T9aEK+rWWzt1EPUrcl5hJUbQCwLVml4mnJHWClRtpPQhI/nEQzpy9nGku48w3i2pyE1K2dfkHH1LYeSDvpBPcNuXTyEfVMHWVghjxZl3in8zw8tK8kpyg+zZBu2K827gWhaftekq/1YynR1FcgU7geEXNmZiCr5h4Gk6S4Uvz8k4XErUoAuJta3heKjkaTVKU3wqlJPyxO4DibXHlHocOaM0qOVlRdVZmRMdmPBhSR9W+tB8iHFCC2VU6Zeg0acVq0MVZBJA5XUpPziv5zElPdyMolEM0hM1K1BZU1fvaSsm/q70GMvsSSMnhB2QfdShaJ5LouemoG/s3jqZY7oJAQ4N2OzLSpZCwobi8BpiZ0TmyvtRAZPNfBjss2wqvyxdCB3dceTuZuD2FoemKzLtpt+koRjx6SUeKG+IvUkOMZ0MYMqTi1d1MutR9xjJ/ZrQTnxKPqP+TfX721fjFw5gZq4QqGX9TlaZW5aYmHJdaUoQq5vaKMyQr1OwxmRLVSrTTctLpZdQVrNhcpsIbLC1GqK3G/KU6HHCb3jL3aglGv+sJguaFklbbKCo8rB8/jFk0vPLAUqopdrbRPTSbxRHaLzAo+KcX4bqNGeU4JRDmpRFuS0KH3GMa0s1kcq4oY8icaInkc96BndPNlQH9XmEeu2/yhnmc1rzScWnk5pIgJgyuy1KzLerDy+Ey4H9/DUlQH3iH2KqzLVjE0tPy69SQkJJ87xqwquRXkIZLqDGbkiSbX4o3/AM2qNIPOhT9RTYbsKHPyjLeXlRapWY8tPPq0NNuKCiegII+cXkjGdMdm5n+sg62yOR8I24cTn2ETlReGBXgcKyB6lhH3CMZ58K4vaFxG4Vf5dI5+DaRaLzw3nRhCkUiUlJ6rNNONNJSoG+xA8ozfmTWJbEWadbrMi8HpaZmVLbcF+8m2x+EK1ENjkwocof4oCX+z1QHAN25lxBP7yoH5fO6ZCrNm51SSgLf2hHM9VGH8lJej6zx2ZtThSRyTv+MMsEzSZSYmA4bJcYW3t4n/AJRzZvlIbtZLp7NrMdAEq1iObYDfdKEbWEBH8bYzq7no03U6hOFzukEqVeN9z2U+XFNWidl3aWhSnklaVcMpIKu9z9cHUZe5dtoCvTqYgeALQEeSn1vWZJW5M6S00F5GK6RlxmtL5WzuJZN5qWpLZJeZ4yC4fMIvfrEKw/iPHP0+3huUrc7S5Yq1OPJu2lCeZJvtG48XY5ygwNQpuliZl6nNqFwzLJC7HoCoCwjI+Nqx+WdQcmW3vRWBcIYYQEhI6es+cdPD1bVzSW5pCp4sS8iZsVjIujYiYrArWLJ2tJH1k2283qCrWO999okk5NZH4jpTj8zXcZTb5QVJlZh8WUegJuRGVKhhdLDqnGZ5alX5LFo4pFZnKVPJl5xxWgcjE/FZ/wD2wVCL8i36zOixlqSVScqk91rilZ8rnrDbD2PcRYfndPp7ymCRdGsgezwMRv6QEzLhTazyvDV9+6eYVpMF+Jy3u3OwXFFgY/xVhbE7zAM5iOWAFlGbmw+FE9QmwsIiMvhfDQdEzKVByeSNwlY0b+YiM1VBnaaQCQpPIxH5KqzVNmAniKCb9TF/i81VuYOxFkvP08zTSJinMHgjS2dAsgX6COZudWtvUHbjp0tEfZrTdQR9ZYLtYEGOHXHUJsFXBvCZZZS7stRS7ClSmOIyqxN7eMA25zhrLajv4Q/dSVpC99ukB6k3dzjp7pGxhbZdH0yDrKkC4hisqQTpJCr3hZmc1nQpXrjiZSiwU3eFko0YuvicwVhhRc1L+jW0qI8bWP3ROsHVU1DDrTayeI2NJvz2ihcLTK5zBNPufzKVtbdLLNr++FqLmFMYKzGm6bUFrcp0wpLyAOaNQ3I8r32jq+1/TZazpeLLj/Mq/wAoy+zOrWl12XFPs/8AZo7QU38THPX7NxA+m12n1umInqfMtvsuC4Uk/f4Q/adSVWj43KDi6Z9RjNSVo9UykjlaGzkujTa0EtI035x4pgrOybxEw7BAl1J5HeF2WHDsSLCHCmCg7C8dtI6FNt4KyztuT1J6bR8phKVBN7w8bZsnZRjrhDmRvAtgn0ukhAA22h1ax398cIsUCwjl53SNhAdyjsOG9r9Y6mp5iQkHpyYWENMoK1E+AENG3dTl4hOZlZCaEimNLN5paW1W8CoCNGk07z5o4l5tIz6jIseOU35Il2XM2p7ELVTUshxwqWpIO3eBMA+0JmgzLUX8mJKYCpiYUOLpN9KAb2PrIHuiCVnHbuBMPrqMugrfUOCyAdkrKTYnysDFBz9fnK3VXp+oPF151RWtR8TH1DrWhS1eNf0wil9T550zV1p5vzlJslTFSJmA4hfPqDEypdQS9RnGplSXATslwahsPOK1pYUopOx36xJWJjQwW0GyUjw8YmNtFNWWhgNOX9anG6NiLCVIU6pf1U5wgk6ibWV5ecX7S8icIBgacGSyULUCfqiLxjCnVPgVQi5BB5xblDzwzDw/TwxS8ROqbCbJbmkh9KfVq3ESc8t3GT+Ycdq7o0w/kvlZISXpE5gyiy6Ejd1xsJA9ZMN5TJ/KmstCYk8J0edZvYLaSHE+8GMlYkzWxzjh1LeJa69MsM3UhtKQhtKuX2U2HthTLbNnEGCMUOrpk8UodRw3GXO8lfgSPEdIb+Jzpfmd/EvbFvsa1nuz7lsuTWGcCUwLIsChqxERml9nnCyKm0mdwTKrlgd0uJuLW26xSdU7TXaEl5530FVCflQs6FplUg6elwV84kmVfaMzRxLmKijY/rlPoVLLDi/S0yjbWpaQLJC13TveMWXV6htPc+P1HRhAvJHZ3ytXu5ganJPTSFD7jAXEfZ5wdMzUsKdgyTLbaSDYfiYg+eeflfwDhynT+BcxKVW5p+YLb8upqXe4aNNwr6uxG+28UMrto54lRSKtSRvbaQT+MDPW55KnJhLHDyRqCQ7OWGE1JJmcEyPB3vqSD026x9PdnHDa5s+h4OlEt+VgPvjLDvbLz25/T1PQP2ae3CX/AFx8+FD/APEcmPVINfhCFqs0e02M8GL8jUEh2ZcNtVJK3sHyxb1XUCdvviRN9nvCDTh4OE5UApte52+MY5V2wc+VKuMVspvyCZBj/dhmrtd5+q3/AC0038JFj/chuLqOoxqozfzKeng/I2rJdm3LcNj03AtLcX1K0Xv8Yjla7L+GXqs85SsI05uWVYpSCEgbcrXjIi+1nn6bqGO3rHwk2P8Achs52qc/lGxx9PD1SzI/2ImTXZpqnIiwxXka8c7L1EXRPRjhWn8UquTq5j3xxTuy9S5Jwk4XpoFtrKBjHjnanz8sb5hVEW8Gmh/sQ1X2oM+3U2/pHq5H7IQD8Ewh58zae5l+HH0EpSnUGUn0uOVKffSEkFK1WBBESVuoSkpL/wCCG22trd0AEjziH1aRU0kqRvEfVPvyq+8pW3QmNyxxRn3tk3mKysTRDywpX7Q3j1uthvdTaCLbEc/dEORiBExZqaQkjz5x2twqHElXlFIF+GfkYO0gWS2ammJ1pK0lOq0RuoyqVi5TY8x5Q1YqC0G7qjcfrfOCfpaJyWUAO9aJdl15iVLn1BnhKJ1o2PnDlcwkslVyTAZSzLz10kbjePnZrSs89/ERLBDCJtJl1JtuREenVJdWoJ5+qHbEzrWUjqPVAaZc4NUNjtEbIctTbspMddN+vSJFTqmF33KunO8A5hnio1BO58IZNTLkm9uTp+6AssnmouN7Cw84ZTDV2yg2KSIbyNSS4wNKuUEL8RCha/qiyNESdHAmDpG4NrQ6amEvNd4XI6XhKrp4FQSrooWhrZaF8RN7CBJRaOX803+Ts1Kn7Tb+q3gCB+BiM5rNOMVinVJAslSFMqt5G4+8w4wNMhqrzKD3+M0Ba/UHb7zBbNKTL+DOME3LDqVk+AO3zEezxx/E9Ha80vo7PPSfg9RT9f3RFMHZg1fDU0FSc2Q0r7bKt0q9kX1hPOCh1hbbE48mTmiBss9wn1xklKVI5bQ4Ym1IUDchQj5xq+n4dTzJc+p7PTa7Lp/yvj0P0KkJ2XmWQtK0rSeRSbgw+S4ANow5hfM/EmF1ASM8tbN/zLh1I9xi4sN9o2nzGljEUiqXJ2LzG6R5kGPN5+i58fMPeO/p+rYclKXusvwrSQdvfHF7nYWiIUjMbB9aA9BxDJlRt3HF8M/xWiStTsq6App5tYPVKgY5ssM4OpJo6UcsZfldj4LKBuq4hw25q5wMU+hIJKthHrU7cbEAecKaGWFVKSlNwqB7z44m6rwxqNepshLKdnZ+XYSBfvuARW2IM5sKUwuJlZv06YA2Q1sm/mr/AJw3DpsmV1CNmfJnx41c5UWsudbbbK9hYXJ8IpHFuJZSq47lqdJPB9TKlOuKQbhFh4+NyIrDFWbeIsRlyXQ/6HKq2LLBIBHmeZj3Lhpx6Zn59ZJKEpaST1J3P3CPb+zHQpfjccsr5TuvgeT671r/AI044l5dySZpzaXsOSMsd9b2u3qTb/aispJkuKFyQnraJfmI8ZmpU+TQr822VK38Tb/ZiNtJTK2SE3VzA8I9X12Seskl5Uv8HmulxrTxb8w5LPJl2UoGygNz4QQkXS44STsdoBNd4gne598F5NQS4kAgmOZE3tDl1q75AFjewPWCrThTLAKVfa0R6Zm3PSgBy62hUTKktFRPMdYKwaHM3OoaJZQLqPnziNvVBcpWErBIJPj1jsukzinVE2G0A62sgpfQq5B5iKsIuCmVFM3SEhatVx08Y7TPKllLbS6oA808wfZEFw5W7SKUHY+ZgyudA799z5xfBXK7BWYqbDKgFSMmsb7Kl0W+6JHQ6nhx5lJmsLUV0C3eMsnVFbT1QCkhPUjYQao7uloEq5+MBLHGfdBRm0XxQKZl/WkoalaNSWZgjdhcugG/ltvB1eXVMVcMUilpHMXk0H5RQLU2onSlyyhuFA73iX4XzfxJhZ9tucDNWk0DSGZrUbDlsoEHkPGOBq+iZG92Cf8AZm7DrIriaLNqOApFrDs043TKe3MJYWUOJlkd1QSbHl4xh+bzIx16SpH0g0ixtZEkyn/Yj9E8E5t4AxmhqnTEjTJSfmPq/R5t1xlCydrBwahv525xJ0ZGZYpUSMmcJrUeavSgofFF/hC9Jo8uC1l5GzzRn+U/L97GWM5iTDhrEwCDZWhCU/cIEv1zFExcO1eoKv04qhH6yy+TGApZBLeTGDCk80pWFE+9q0O/6PMrmpcszuStMZHI8Oky7w9hRc/ARvqgLPyLYn667dh2ozi21iykqcJBB5iPFrqkiFIlJqYZSo3IaWUgn2R+tC8uMiG/z+VtOZt1VQHPvDccnA3Z5QNS8EYdT5KpBv7tEKcv0LPzrqL/ADuDubRHZyR4veSN4e1SYeDwWEgtk9OhjuXeStkFQ3t647LOd2IjN051u60325iEGJx+XVa5G8S6YDTidkW23gBOSaVOqKRbxgKoOPc9S+mbT3vtjreOWZp6WmdGrlsDfpA9BcYdtaw84dKPEb1fpcwYq6GCkxNOB8FW4PIwpMuFTAWlW1gYYqd1p0q3IhdC0rkdPhtEuwNvItIP6nRfxhjWFFE2FJvtHEo/w57TfrHtaNyFc7xTdF7Q3SXmpmTHEPe5GEalSkuJK0cxAmjPqSdIvEoaeumy90nxi1yB2Ii3MPyExpVe3hElkaqHkhQXe/SG1TpyJhJUhJ1W26wAZddkJsoV9nziDO4cr6i6wladyk3htKEOy3e9oEKuKQ/Ik6ri20MJF3huqb6XgVIjiSHDEwqVxbLjYayUD3fyiyq839I4NqUrbvql1KTbncC4t7oq2RWmXr0k+ALIeQd/C4i70U9JTcJBSob+d49v7OTWTTZMT9fqjy/Wl4eeGRfdMzS2UHZcdqlNQunrDqqU80+sTErb804pAv5EiGqFqQfHyMeGyQcJOL8j1EXuimhBTa0rtY84+IXsN4cJeSonUSD4K3EcrAvqHwgQ1wIpeeQsFCyk+uH8vXqzJrC5WpTTSvFDhEMiB5XjnSb8opxT4ZcXXYkyMxsbtt6E4kqIH+eMIzGPcYTSf6xiGfcHLd5X4wAKNvOPUNEWBSTClgxp2or5DHnnVbmOXqtUZk6npt5w/tLJjhIU4dRUbx2hkAdN4XDQCRp3hqSXYVKTfcarW43eyouDLqUVLYMYcX9uYKnibeJsPgBFRvjWUNoIK1KCQkc4veRl0yFMlpRIFmWktjw2H8o9T7L4d2aeR+S+pweuZKxxh6v6EDxjOoXip7QQVNpS2D6hf5wIl9bi7dLdYSnXFztempgX0reUoeq8OmQGmrX70cnXZPF1E5+rZu02Pw8UY+iCbaktthPl1heXmLOd0+s84Cqmv0U3B8bwsw4UJBtck7whDgsFlx835+fSG81McJBSFCOUvcNu+4POBbr/AKRNBI8YlkHZc4jd9t+hgVVCVy5bsNheDDQQLck7bmBs+hSkKGna194otCFEmuGsI5gecSxS1Klh16+qIRTXEtTNjzKuUSwTGmQVY7WvFpkaGS5kOzgQCdja5iWyTgalhddjzMQeS+snkm+1yTEp4pDaUAg3gkA0PzOKQ8CNhfmIdl4uNkq32hqw2jhgmwhOcc4DBsSDbcQyilwPaI8tqtBSFGyeUfojlWcH4pyvpEwmTpU5OtyyG5vUyhTiXAkX1bXueftj84KRNFKy5yJPMdImlKxVUKNNonqdUZiUfRul1l0oUPaIzZcakOxzo/R/8k8Pj8xT0yx/WlXFMH+AiOVYVkj9ifrDf9mpP/NcZxya7S8xUsTt4bxtPtPNujS1PFsJUhfQKsLEHxte8aoaeafZS8y4lxtQulSTcKHiDGSUKNadgQYUlQLfStbP/wC4O/70JrwZSnhaYmas8PBdSfI92uJFH10+MJcEGfi5KVNbwCHCkptD3jhDd0JKgfAxDuO63tciHkrVClQSs7eBjfGRlcQ87OcipJ5++G63mXQo6ikne3KPQ9LzDe+xPjDR6TKgeGoEDpFtgqNMQm0FSgU/CEmwQNNzyhNxTrR0kEWj1l3e6jzgGwxN0hCr25wsy8lTKkpAFuggfOuXe25COpRyzlweYsYpOiUcvXTOAo2sYc1IEgX8IbOr+uBvyMOZtes7+EU2QRpjgbfGo7RJ+MlTaSDvEQbGh7YwelpjuJsbjmIuMqKkgmh4IOlR98C6pKtPAuN2v5R29MBKd77wzdfUEne14tyIlQ3kZhaCqXXyhNz6icuesIhz+sAg233h1NN6mQ4OcAGOEzRIuDuLEW6RpChLRO0OTmQO660hZ8ri8ZhZVYc40NlrPIm8ByJVutoqZVbnsTb4Wj1Hs1mrJOHqvoee6/jvFGfo/qVbmVThIZgz7aQdC1B5P7wufjeIWE96xi1s65fhYokJsJ7r8sUXtzKVfgoRVSjZV44/Vsfh6vIv1v5nT6bk8TTQf6CekEx4UKvsTCpRdN4+SoEWPvjnG4QOvkTt6o+Tq1WIHvhXSLbHaPlJAHS8CWhMK080/GO0Og7FIPtjhQuBvsI+4R1Xi0ymhXWpQuBa3K0dlTik7k+qPW27J3MKBsFNzvFgj3CtPVU8cU5jTqQHQ4rwsnvfKLurrqZahTc0e7obJ229UQjKWkceuT1RKPq2Gg2CfFRvt7E/GJFmk+JLBZYQbKmXUoG/Qd4/cPfHs+jy/C6GeZ93b+XCPLdTvPrYYl5UVskoLetPXeEuORf5QMl5hbYKb39cKLeNyQRv0jyO6z0dDxLmt7V84fyq1OKOs6Qn7oBtFSl90mDLZ0Mi5H4QaZKF5uYSGbAi58IbyLet4qMNXFcSYtfa994JSg0IF+fjFlUOloBTe+/qgZMqu2b+EEHF3sNwIZTIsknytBMuIEZUET+/KDcxMlNMJKvLaABP9fAJtvzh1UZoJlkNg3BI6wClQckEqWbJLqr+QvB+Ud4joV7AYjslYSiE89hEkpzQCNQTcnxhiYpoJ8bQnXYX9cM6jNpMn3gL8jCky7LobJU4AB0MRadqXpU4hhlYIvvB7kRIPU54pbChYQxrNfcbPBbV3iLbQlMzqJWWIG1hEb43pE8Vq3CjCpOy0g9Sq/NyM+iZaWsupVqFjaxjUOUnamxRhqTRS8RNfSNMJGlQtxWd7HSTsR5H3xm2lyEmGw4vST4GC652UlUWRawHSB8NNchRyOz9MMO5iSuK6KiqUSpszLCuegDUg+ChzB9cFfpyo32eH90R+eOVmd0xl9XZqZbkDUZd1goVK8Xh6lDcG9jy36dYm8z25n2VFCMuAFD9apf/AOccjUYcsZe4+DfjmmuTKczKJ07C5gS40pKiAN4mhl2CbqBPstCDlNlnCbixPKOi40ZtyIo2860L7+Qh+zOqcUASQfXDidp0oygqW+sWGwCYE6GQolt838xaK3MoKKcS7dLwHLnDR9rhArQbi146lAXEaFEKB6gw2fcVLv6b6kW5GLstIYOr1q9XjHLCyHLXhwWW3bKaNjb7MNVNqaegbDO3l2UOW8PXSS2nbe0DHVXIttD4ElIN+kQGhNNyeUFJZRDe+20D02IuIdNq0IN4hR4+7c7HyEIqUSi5jhxQ1bbxyVd0g8oqyUIkni7eME0kqlwk23EDAd/OH0uoqZEEiMbAKbcIMXJlBUgqmzkgVbtuhwDfkoW+8RUU0nSpLm2+0S3LOcXL4wU0hekOMqIF+ZBBHzjq9GzeHqofrx8zm9VxeJpZr05+RN85mQvD1PnOampjR6gpJ/CKaXY7iL2zJZTO5azjgBUWtDw8rKF/vMUSmym/Z4Rp9ose3UqXqjP0Kd6fb6M+QQoEXhMo8zHV7R10jgHaQlqISN487xNheOr2O490ekgbjrECRzzEKA3SN945RYp3MdIIB3iiMUST1joOkXAAhMnzjxtC3n0MMgqW4oJSPEk2EHHvQD4L5yxkVSmAG5pdguddU7a29gdI+6/tiJZw1Hi1enUxBGlhpTqt/wBJRt9yfjFoSEqKZRZKnjlLtIbv6gBeKFxzUfpLMCou6roQ7wUeACdvvBj2HU1+G6fHEu7pfuzyvTZfiNdLJ5K/9AFB3hQm532hNCtuQj5SrqEeOR6qh3KglYt74fuvBWwVyFtoYyoIQVHnyEdOq3sBYw2wHG2KNHVMbqFoLsOhQtfkOkB5b7Ztc2h807pXckC432gkwR1xSFWN7Rw+kraBPhbwjxJBsdXPxj5SwbAi55euCspcEcmDaoXFrXjycPEfYTzudxC08kJmwR1hAkGcSbg2F4WN7kmpzaTpSbWIgnNT6ZCXKgq23KAcpN8FrUrw5QDrFTcmHChJ90EpULStn1RrcxNvqSknc9IKU6WEnJCae/PLTe3OwgVSafrWJl+wSncA9Ye1KeCUcNJO8CmxiihvPzinXdAVcX3hemsLLgUQBv1gZKtcRzUs7QaS4pDeltItaLXcqS4C7022yxpDhvblApU49MO6UqNuVo6akn5t4BatCR1MHWKTKyaEuOHVYXtDLF0OKFTFFIcWLHziL4plPQ624EjuqGoeV+cShOIWJdfBQkJP3wnUaR+UTCZlt9pkpvcu33HshORcBxlXcYvTRtqCrW8obGcJ/SMIDvpuReEFgC5iyJWfThL7Che5iNO6mnSDcQe4hGw5Q0n5QOtcVH2hzEKobEGtzKwdiR5woXS6ghW58YalBCrR0ly1rQIdWKIUpt3Tyjh1wqjxe4C44JFrGKLo+PeKRe+8Pm7hABhgL6028YfIPd3i7KZ3ew6QoXDp73KEykX57xySeRiwD0qF+ccn7MeBHUR4pRvaKoh4RuYcS6iLiENzvaOmiEvC5iItoeODiMFMPcIzfoeNac4o83gg+pXd+cMknwuIQ4votWYmwdPDcSsew3h+myPHljNeTQnLDfBxfmjRFVlvScMz8hYqLrC0pHmRGcmVkJsDyjTKlpW0l1JuCkKHhGbqtL+gYln5QDSG31pSB0F9o9R7S47jjyL4HB6E9rnjPNINjv7I+tuQNo5bN0i5hUNk2jyJ6KhBabeceBQA5Q6LN0WPOE1S5t8oqi7EwbDlHQIF7/GOigAWIhNSgEWMRFWeLcHIcok+XdLVWMxqcxpBbZUZhwnwQLj42iKWub3EW5knSwF1SuPJ+yEy7Rt495X+zHQ6Zg8bUwj+v0MfUMvhaecv0+pZVdfFMpUxPuEWZaU5v4gExmJxanplbzirrWoqJ8zF5Zs1hUpgcyjZGucdDZ8dI7x+4RRGrpe8df2kzXkjiXkr+ZzegafZjlk9X9BTXpTtHyFC4N+cIqUdWw9cKtDUve0eaR3h8lQQgJBtCanDq3MeBWwO0IqWb8vZBOVlD1skKBvbrzhYKIXp3teGTT29hv7IWS6dXM3iKRTQ8DxANjbaOVvp07qubbQ0W73iLCxhFTo021QVoDadTS9aknbaGgUPSOe1ocKAUjnyhiSeNzinIZQ/cmCmWNvC0DJZszE3dfUwq+slmwN4Vp6Qm6yQPOK3F0FXHQzL6QbWFgIBPO8aZJNyIdTi1uHSi5JhNlpqW77pBV0EXuLSFJZp3TqX3EDmYdrqLUsgIa3P6x5wLmaiVApSdvKGHEU4s84reE42GFVp9LhKFkdYP0ysLnpYy0ysgn7KvAxFGJRaxrWCE+MO0rEu4C2Tcb+EXuYDhZIJilvqmdSdXtiWUtD30QGw2SpO8Q6TxE42AFkEee8SWm4qlVBKXNKB4gQaaFODAobub6THXoaXLkqtCrr7DP2TcwyeqYBGkgAQNovk7dkmgLmwhm5wkAp1e+Gk1PPKF77QyXMLKe8bwDaDo5m5ccUrQBY+ED1IsTcwSS4QLEAg8xCLrI062zcHp4QI1DNtd9rbR46LDblHKzpVztHdgtFiYEsSaX9YAYfIVeBzQIeJgk1pIi6KZ2Cd94+5m4MfEeAMeAG+0WDR7ukeuODa8dq2HOOEk35bxCHu9uscpUQrYx0NyRyjwm0QjY6Q4T5R4+3xJdW24FxCSVbQ7ZUFJsoRaAL4wpM/SGDqc/e6jLov13AtFQZlSQkswnlBJSJhtDwB9Vj8QYsLLaeAoAlSQUtLUjfpc3+cR3OWSKKpS6ikd1xtTRI/ZNx/rfCPadS/j9Mjk9En+x5nQ/wtfKHrf+yumlm4EO0OkW9UMEHYQqFkC45R4o9RQ9KiXB4QpsOfhDVD1kbjcx4uYAHKIDR08oXOmGhWCm0cuvHVsY8FzziBpHWqwjRuAqWaTltIMkEOvpMyu/Ur3Hw0iM+0iQXVK/J09Nxx3ktkjoCdzGoXXW2ZUMoshttAAA5JAHKPUezOC8k8z8uDz3Xs1Rji9eSlc1qkqaxKxTgskSzWpQ6alb/cBEBCtjBDEE+aniidnyrUHXlFJ/Z5D4AQLv5xxepZ/H1M5/r9DraHF4OnhD9DtO/rhdsaUkkEwgn7YhZThAteMJqFAd+do4VyuLX845Cr7nmY+1aTEKOm1d7YWhTURvY+uEAd9rR0pwkWPwiEaPlL845BBNj43hO/esTCraO/6vKLRdC6rhjpvA293jfxh/MOaW7CBie8sneLkwonbqyAADC7ThDduXwho5+cEdKc+rgS6O1TJStR1Q0efcdNrx6n6xVgNocNy191Cw8YhQ1alVurgg2wyyAVbmFUKbQiwsITWQTe+14hdnzs2tSdINgPCGynietzHSgCru3EfIlnHT3E39Qi+SIT1q6m8OWQ+pQCL+QghJUVxwhT31aPEwZDchIoAbspdud4nJGeOMLeXsbQ1VSn+pg2peldwkEAc7Qgqc0iykX9cHtFARymzGqxSD6obOU51B5RInJtgosTpI38ISXMMrSElXvgGi7I4tpSdrH2xyEqB2Btygy8WrHYHfn1hgsoK/C0UWgXNy5SrUnlDdJ0iCr4SpGm4vAtyyL+UCMiJM3LpJ8YINjbVbaGEvZSofIOlNoIjFLnwPkI8Asd+Ud7XFzHJNzYbxATlRNrXjwHbpHy7X2jwG/KIQ6t1jkjc7x7fwjk+JirJR2kgEQ8YUm1rwxB5CFmT3h4wSBaLFy5mgmanZUn9VY9tx8oKZosKmMAtP2JMtMJVc+Ctj8oiODZjg4pQNX5xopt4kEfzixMVNJn8C1FgkE+jldvNPeH3R7XQL8R0yWP0TX7o81qv4OtjP4f6KGQruiFASBa20IIIEKBROxjxTR6cUClcrwmpVxYx6k3vaPCLG8UyzkC553hRJv5Rz1AjsWAuYpFE3ytkBM45E4pBKZNlTgt+sRpH3mLOxdUfQMI1Ca1WUGtAHiVd35/CAGUVPTL4Zm6ktBJmXtKSeqUC33lUM82amlEjK01ChqdcLqwOgHL4n4R7fQ/8Ppksj7tN/PhHktYnquoLH5Lj5csqg9PvjkE8uke6yL26i24vHyQnrHij1Z23cHl7Y9JN946uBcQmpQPlFFo9JOqPr94XMeAncm1o8V64hdHVx4x5r22ji+5EeDeKZDsG+9rw7aICSo/GGybFWwhZRs2N94sqhGZWSkk++GTRso+EOH9mjbfaGjRuIgSOnTdQMJrN7JEevGxBjhuxeB6RC6HzKWmUDULx45MDkBCKlKWrbfpCjUq46o2STEKE+KtXKF5eWmZheltJMLIZYY/OHUfAGCUi4oqCgkJR0g0gWz2WozaE6n1E+QhyualZM6WEAedoXU+NI2JB2vA2elyscVAMMqgE7EJiqOnYEgdLQxXOPqO6ifVCwlioWUN4VaktR8IU2MP/9k=', 'scrypt:32768:8:1$2HMjFPNtujm3xBM1$f0d66d3883a9d1a05b76548bea6a39447dfbe007220de073f71e19390a2e5f553b46409e39606164a3554f736ea9975d140c417292fb4e944daaf0a798b7b2a7', 'ACTIVO', '2026-05-30', '2026-05-30 18:17:57', '2026-06-04 19:30:54', NULL, 1, 'PERSONAL'),
(2, 'CARLOS', 'JOSUE', 'SANCHEZ', 'MENDEZ', '2006-04-10', 'MASCULINO', 'carlos10@gmail.com', 'cjosue.sanchez25@itca.edu.sv', '12345678', '22113344', 'Av. Olímpica, 345', '009128746', '062825', NULL, NULL, 'scrypt:32768:8:1$2HMjFPNtujm3xBM1$f0d66d3883a9d1a05b76548bea6a39447dfbe007220de073f71e19390a2e5f553b46409e39606164a3554f736ea9975d140c417292fb4e944daaf0a798b7b2a7', 'ACTIVO', '2026-05-30', '2026-05-30 19:35:10', '2026-05-30 19:48:58', NULL, 1, 'PERSONAL'),
(3, 'JEFFERSON', 'JESUS', 'GOMEZ', 'TOLENTINO', '2005-09-12', 'MASCULINO', 'jeffesor12@gmail.com', 'jefferson.tolentino25@itca.edu.sv', '78981234', '22309822', 'Alameda Roosevelt, 2102', '987654321', '160725', NULL, NULL, 'scrypt:32768:8:1$2HMjFPNtujm3xBM1$f0d66d3883a9d1a05b76548bea6a39447dfbe007220de073f71e19390a2e5f553b46409e39606164a3554f736ea9975d140c417292fb4e944daaf0a798b7b2a7', 'ACTIVO', '2026-05-30', '2026-05-30 19:40:11', '2026-05-30 19:54:06', NULL, 3, 'PERSONAL'),
(4, 'ANDRES', 'FERNANDO', 'MONTES', 'LOPEZ', '2006-02-05', 'MASCULINO', 'andres43@gmail.com', 'andres.montes25@itca.edu.sv', '89323456', '22223333', 'Paseo General Escalón, 3700', '123475689', '109525', NULL, NULL, 'scrypt:32768:8:1$2HMjFPNtujm3xBM1$f0d66d3883a9d1a05b76548bea6a39447dfbe007220de073f71e19390a2e5f553b46409e39606164a3554f736ea9975d140c417292fb4e944daaf0a798b7b2a7', 'ACTIVO', '2026-05-30', '2026-05-30 19:45:51', '2026-05-30 19:54:19', NULL, 2, 'PERSONAL'),
(5, 'JUAN', 'CARLOS', 'PEREZ', 'LOPEZ', '2000-05-10', 'MASCULINO', 'juan@gmail.com', 'juan.perez@itca.edu.sv', '77778882', '22223333', 'San Salvador', '12345678-9', 'TEST0017', '', NULL, 'scrypt:32768:8:1$HipX9JKjCPqRWbhA$4a177b0df21df21461d883fd2d4f7538a8d9661fd3b77d660fb9cdb58fd1a1ccdf702abfc833fff1df16540028814454ed29dcc984c9e8aec27bdf290fe6318a', 'INACTIVO', '2026-06-01', '2026-06-01 20:21:02', '2026-06-02 18:02:29', NULL, 3, 'PERSONAL');
INSERT INTO `usuario` (`id_usuario`, `primer_nombre`, `segundo_nombre`, `primer_apellido`, `segundo_apellido`, `fecha_nacimiento`, `sexo`, `correo_personal`, `correo_institucional`, `telefono_movil`, `telefono_fijo`, `direccion`, `dui`, `carnet`, `carnet_minoridad`, `foto_perfil`, `password_hash`, `estado`, `fecha_ingreso`, `fecha_creacion`, `fecha_actualizacion`, `ultima_conexion`, `id_rol`, `dui_tipo`) VALUES
(6, 'DAVID', 'JOSUE', 'GARCIA', 'FLAMENGO', '2026-06-08', 'FEMENINO', 'davidjaja@gmail.com', 'davidjaja@itca.edu.sv', '76554433', '33889922', 'Direccion de prueba 123', '891234567', '333333', '1233445556', NULL, 'scrypt:32768:8:1$bLebprEKY6cHkuTh$cfc884798c624fd566af162e7ea977a3f270aa3762f07ea65be2a98a7c3a345962d830bee188be53be20897a70ad515cdb4ed6bcd16c0588e597d9c44a7876c7', 'GRADUADO', '2026-06-01', '2026-06-01 20:43:51', '2026-06-03 22:14:33', NULL, 3, 'RESPONSABLE'),
(7, 'JOSUE', 'ALVARADO', 'GONZALES', 'LOPEZ', '2005-06-18', 'MASCULINO', 'gonzales3131@gmail.com', 'gonzales097@itca.edu.sv', '78782322', '22990033', 'Direccion aleatoria', '126753028', '210926', NULL, NULL, 'scrypt:32768:8:1$URtAp8HOY6YNhMlG$b7f44aa79e93103429584a5bd00e4d5fdd42198f6b3e67350c2755231cd02e4fe8594ac2200fb70a0001c7972adf267ae70544a261fc9d4f15b8009253dc2c06', 'ACTIVO', '2026-06-01', '2026-06-01 23:39:58', '2026-06-01 23:39:58', NULL, 2, 'PERSONAL'),
(8, 'BENITO', 'JOSE', 'LOPEZ', 'GOMEZ', '2026-06-11', 'MASCULINO', 'benito@gmail.com', 'benito@gmail.com', '78787878', '22222222', 'prueba', '231313222', '564433', NULL, NULL, 'scrypt:32768:8:1$3Eehh8KPElz1w3KR$0f0cc0cea76326e61076d1d13afa6640980f0227e4327e2ab6fac747358d539fbd4c16747af64153b5b0390dbca89085a7a6c3c1df0e9b966fdfaa4201fbb15d', 'ACTIVO', '2026-06-02', '2026-06-02 23:56:08', '2026-06-03 00:16:58', NULL, 2, 'PERSONAL'),
(9, 'JUANITO', 'CANCELO', 'JOTA', 'PEREIRA', '2014-08-05', 'MASCULINO', 'pruebadecorreo1234@gmail.com', 'juanito2121@itca.edu.sv', '66757575', '24242424', 'Prueba', '424234342', '258734', '113123', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAQDAwMDAgQDAwMEBAQFBgoGBgUFBgwICQcKDgwPDg4MDQ0PERYTDxAVEQ0NExoTFRcYGRkZDxIbHRsYHRYYGRj/2wBDAQQEBAYFBgsGBgsYEA0QGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBj/wAARCAGQAZADASIAAhEBAxEB/8QAHQABAAAHAQEAAAAAAAAAAAAAAAECAwUGBwgECf/EAE0QAAEDAwMCBQIDAwkEBgkFAAEAAgMEBREGEiEHMQgTIkFRYXEUMoEVI0IJFiQzUnKRobEXYsHRGURTc4KiJTQ2OUNjdLLSg5KzwvH/xAAcAQEAAQUBAQAAAAAAAAAAAAAAAgEDBAUGBwj/xAAoEQEAAgIBBAICAwADAQAAAAAAAQIDEQQFEiExBhMiQRQyURUWI0L/2gAMAwEAAhEDEQA/AO/kREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERARPZS+6CZFL391EfdBHKhkfKkdlSbN3Li7j4VVfH+q6KmXYZnO37qTzG4G53HuR2VPCPn9K6LyOqYWAkPyfklWW5avs9ryK+5U8I/3ngKM2iF7HgyX9VZKmQsatmsLFcvTR3Wml/uvBV4bU0rnB4lyT8FS8F8GSnur2ovNJM5ucPAwp97nwB0bhn3RaVkVETt3BoO4++PZREpDiHDPwgqoqYeQ71Hv2CROc5pLvlBURQJ9SpfiGj8xHJwgrIpXHA4PKpNqBwC4E5xlBXRSOkw4DaSD7qDJd7T8j2QVEUhftAyDyqfmPJG0jI/MPogroqZlGQAhlDRkggIKiKkXkM3bh8/opBUks3hpP8Au+6D0IqXnekHY7J9lOS4O+iCZFT3lnMjx9FSMznVTWMIDf4gUHpRUPNcxjnucH47BvdRbK6SAPb6XHnafZBWRUcyl28OGwe2FVadwzjCCKIiAiIgIiICIiAiIgIiIClUx7KmXZHpKrEI2nSbBUOQclSZeO5Ct1wvVHb6d0tdUMp2D+KQ4Cja2lzDW2WdVhcJJGN7vAXnkrqeBm+SdoA+q0jrbrtYrSXwW2b8VMOMxOBAWkdR9YtU3yMxCtYyF38LW4I/UFY9+REOm4HxLk8mYvrTqvUHU7TVlLjW1zMN9hytPaq8ScENS6Ow00dRGP7RLcrm2sr6yaR0ktVM8u5O55KtjpnnLT2KxL8l13C+E2ifyhuG5+IzUVa8xQxfhc/9m8lYZeNaXC8ky3OpfPnn1nKwwbM5wp/OIGMhYl+TLsuH8UxUjzDIKDWNwt799qqn05H9g4Wead6/6jtcrY6smsA/7V5/4LTRLQThSlwzlVpy5U5vxbDev4w2hH018X1dbHzTX2pgnOXiNtcMc9h+VeZvUHxN9HjFNqezi60rSPMdJUOkIGeTw1fQV0YLmt2fl9wvDerNQXe1S0dbRwzRyNLHBzAe4wt8+eGrejfXTTPVe0MNNM2kubB+/pyNuPb3OStwRkhhMmO+AV8+euGgrj0B6j0evtEwVEdAZ/Mqo2EkbQCfoByV2v0y1VDrvpja723IdLCx7xnsSMoNG+IbqpqjRHVjS1ptMpENfUujcN+OACuk9P1MtTpigqJ/62WBr3fchcaeLljndeNAsYcE1r8E/wB0rsXTLHfzOtRJ7UzAf8EF5PdcidR+rmprT4w7doeglIt8kUMjhvI5ceeF12DkuXAvVCNw/lErYN3/AFaA/wCaDue8zy09gqpoyfMijcQf0XMfhf6q6l6g9Q9Q0t7fvpaSWdkYL92C2Rze36LprUjiNK1uO/ku5/QrijwQAv6oatB/KKqqOPr5zkHQXic1pedCdBbhqWwSubVQPjY0B23uSuXNMa+8UepbEy8WW0wT00vDXurHA/8A2roLxoO2eF66YIaPOhyD7+orIPC8GP8ADjanyQscTI8Elo7Yag59/bHi8DWPFipHce9cf/xWw+it167ya7mf1Ct0dPQ7W/1dQZPfn2C6kdS08j2u8pmAOMAKDoI2NDfKZg8EhoCDmjxXdUNR9O9NU1XpiQ+dNJGxoLy3lzsLUFj1V4sr5aWXGgstLNTyDLS+uI4//as48b7IP5tWccAiupgG/I80LozphTQf7LLXtpxH+6GWkDPYIOTLt1K8UGl4Yqq8aSojDCBJJ5dW9+Wjk9m/C3p0K8Q1l6uwfhZoxQ3WAASU4aQMn7rc1fbrbV2+oiq6aItdE5rg5oPpI5Xz90c6n0z/ACjwsOmR/wCj5q9rZGxngDCD6IOOBl/pOeCFqPrB160z0toJI6ibzbgQdkIbnJ/RbA1nfafTWhbleppWxvp6Z72bvdwaSAuFekOkLh4j+sVVrXWTnyWyCYSRQnLcg/5IKk/UbxHdX7j5mjrYbdRGT0SCodESM9+Wr1V/Tfxf0UZrIr5PJI3ksNcMH/yruO06ftNpoordb6WGKniYGta1oB4GO6uQpoxEYnDLPYIOD7H4l+qvS7UNNYuqem420ocPMrWPfK7B9+wC7I0br7T2vdMwX/TdYJ4XtB2ng8/IyvN1A6YaX6gaaqLXd7fE50jC1sgABafvhcYdOrre/D14lX6EuFU42Csmd+HLs7Q0YAGT9SUH0CY5pjMzSduOQqkZDmbh7qhSSxSW+KWMZjkYH5+4yq0XY47Z4QVEREBERAREQEREBEUMoIooZ4ygOQgH8pXmDxHGWg+v6qu6QDK1z1I19RaRsctUXBtRtO1ueVS14pHlf4/EycjJFKRtPr/qRa9G2eSoq6lomA9LM5yuPtc9YNQ60qpzHUvgoX8Nax3t9ljWutX3PW9+fVVkzxCHcMzjjKscccTIwImlv3Wtz8iP09f+PfEq0rGTLCNM90b3OJdM53cvVdu+N7nvd+b2+EbJ6cEDKkDHvcSXjC1mTJaXpHG4P01/CvhM9+5UHtyDhVCzb7hQLw3uMq1Fpn22OLHMxvTz+W5PLcrjDTTzuDYoHucezR7r0S2e4wx5lopWOPZpHJWRXHNmq5XV+NhtNb21KwFjsqQscth2fprebzZobhC0sEshZsLeRj3Vi1NpybTNwbSVUjXvOc4GMKH1TVZ4fWeNyp1jtt9K27gz1uAx9VBxfxjbs+SVgPVKm1tPoSquGhrqKeugY54iDNzpvho+q0h0E8Q1z1Fqus0L1HnNNeoZSxkU2GucGjk4H1IXTPltsXxT2mirfDDqyrnaHyQ0LnMOM4OQsQ8Ed3qbt0Cm85zj+HqGxNz8YK9vi/1rbNN+He7WOWoYyS6UzoYmk8uPB4/wXp8HdhOn+gcIkZ5ZqnMmGffIQan8W8jh190EQM7a1/8A9pXY+mCTou2E+9Oz/Rcd+LSVsXXrQbnj0/jX5P8A4Suw9Lva/RtsLTkGmYf8kF2b3cuC+qP/ALxS2f8A0sH+q7zBALiThcG9UGuP8olbXAcClgOf1Qdval/9laz/ALl3+hXE/ghbnqbq07iMVVUeP++cu19Svb/NKsfn0+S7n9CuJ/BDIB1P1bh4B/FVXHz++cg3H403lvhYukrWhz2yRENd7+orlzpf4jetelentLatP6Gpa2hY47XubIc9vhq6j8Z7WP8AC9c5XjaRNDjP94q+eGOhoX+Ha2VBooS9z3AucwH2CDnJ/ip8RUoLmdOqNoB7bZR//VbV6FdcurWvNZ1Nt1dpKmt1M1jTvaHjufqAunG0FC6MAUdM76iIf8lM2goY5nGKkia94w4saBwg468d1S2m0lbJwwufDUwSDAznEgKsGkvGzQad0lR2q62ephMbA1rzTPwePnCyvxxlrdLWiFrMtNbTNJ+nmDhQ1/0Ft+uvDZRVthp4qe50kBkYQzJkJAGBhBi2ovGRrLUURtukdITTR1LDG2ofTStxu477ce6yfw09FL7Drmp6l6yi8u5TObNGCc4P68rz+FnqZYqhs3TfVFFTwXqieWsMrW7nBg74XYcLB5ALdpx/C0YQc6+Mm+V9k8Okr6eVzJJakRnaf4Svf4ObPRUPhg03c442+fWUwdI4DknKr+K/S82qOg9UIoXPdTuMpaPYNGcrG/BJqykuvQyh0/DUNlktkLY5GA8sz8oOnvKDJN7SeVWIUARjOVHc0Y57oJCFw/46rZTUd/0veaTEFW0tG5nBOZV3H35C4D8Xtyl1z190vo22P8ySHIkY3nlsgP8AxQdq6GqZqnpzZ3zZLnU0YJP9wLJ24DcD2Vm03Suo9F22kLNrmUsbT9CGAK7xkbAA7OOCgnREQEREBERAREQFKpsqU8JBAfyqnK4iL091O78qoykiEux2VJnUbRjzbTwXa4RWyyzVkzwAxhdyfouEurut6zWOrnNhmc2mY/GAePcLf/iG1y6yaZbbqWb+kzAERg8lucErj6qmfK8uZkuccla/mZvUPUPhnRJzTOS0KdRE4PayLkDuVWYPSOFFjjHCABuJ7qYADhaa+TcvbcXE+vFEACOJaApgR8qbbv7cqkTvwyce+zthQ9TlMxj2vDgwO+hXrjiaO69DfIiG94DgPZXK18se97Y8dmyumVDaapxkqInyVOMNGzLc/dbyZpG0XChg/aFJFHLtzmNuVgPRS2Uw0z+JiaKmR0rshv8ACMreH4WBlrdNE397jAPwtlhr4eHde51/5UwxqT9kWew76KJgghJJOMcjuuRuol1/bWt6uZuPKLztx8LcvVLU1bpnTDrVFG8meRwc4ewPK57qw4xMm3b3vGSFj5bfp0vxLizF+6X0hZqXTEtL5kGoLUWObn/1pmB/muGPFlZtL27UtN1B0NfaOK80rmtkZSVDP3hLgTnacnsr7N4Jta0okgpOqDo6Z4wG+S7gLJdIeBrT1unbVaqujL68jJ3NLclb14e0V02/nN4oOqVFHqmqhZbrQ5kj4HS4LwRt4ae6+jWnbVS2Ow01poaZkVNTRiIANweFxPrboh1F6S9ZaTVvSDTdXUUHmtM9PSjhzQDxk/XC7Q0fc7tdNKUNfeqCShrHQt82CTuHEcoOXPHBom6VmnrNrKyRTyyWpz55AxpJ7Y7BbQ6E9bNIau0DbaWa7Q0ldSwMhkiqZGxnc0YPBK3LdrXSXmzz0N0jbJSzN2vjcPZcp6u8FtquWqJrpo65Nshly8uY0uy4nKDoPWfU/SOkbDUXCtvlA/DSWsiqGOcf0yuPeiMl16teK+4a7rKJ7rZDG6CGV7Dj0uOO6yCh8Dt0rr1HNrLXf7Qpo3ZbC+Nw3BdVaE0Hp7p7pmKzaftjKWFv5i3+I+5/VBfdQ7XaUrg0ZHku4/QrifwRNkd1T1b6GACpqfv/AFzl3HWU8VXbZqbcGse0tJ+4Wo+kvQ2g6X6sud4oqxkklc+R7mNbjG5xd/xQY940jEPCtdPNJDvOh7f3ivL4b+pGjbV0Ft1vrr5RQyNc4lsk7GnsPkraPVzpvSdUtAVOla6pa2OctJyM9iufG+BbSzGCmF0Y0M9XAdwg6N/2o6FDMx6mtgz81UY/4q42jXOmL7cX0dpu9JVTtAJEUzX9/sVzI/wJ6Yk2u/a7SB74cs96UeGmz9LtXTXq33Rsgla1oaAe4OfdBgHjfGbFZmyED+nUxwP+9C6Q6ZtY/pbbWvjaYvKHBHfgLGOr/Ryg6o0lJ+0Z2t/DzRvbuGc7XA/8FsOwWZth03BaYTujiYGghBxZ4oOjd003qSDqzoOOanmppmCeKmBBcNwLiQOSMBb08PvWGk6p6Jge+oZFdaVg82Fx25PbkHlblr6GlulFNRVEDZYponRPzyMEYI/zWltIeHC16B6sN1RpisbS0c0ofPSsafUB7ZQbkvVthv2mqq2TxtLJ43RPDhxyMFcBakser/DD1fnvGm6aon09VTb5Wxtc8Bo+jQvohtyzaW4CtN805ZdS2aS13SljqIHt2lrgg1x0067aI6g2WGqjvVNRVAYGyRVcrYTuA54cR7rYFRqTTlOPxD9SWljSMnfVxgfpyuZNd+B3TV3rTWaUuLLHM6TfvaHHBzlYlU+B3WVxp/wNy6munpm8NPkuAwg2L1t8Vem9IWSosWlJpLpeZWlrPwzfOaCe2C3K194Z+keqNSa2d1b1+yTzah/nQxTE5YHAcYPI5C2Z0v8AB/ojp5PFcLvHFe7i12WTkEYPt3XR8NNBS0sdPHE2ONowGgdkE8J9GA3EbWgAKeH+I4wCeEJAOHcNIwFUbgNGOyCKIiAiIgIiICIiCVx5UHd1CT8wRyjHtSs+ZRd+RWu51f4aheXHG0ZKubjiPJWD9Tbo21aJrKtrsExkAqGadQyuDh+3k1r/AK5A60akdqHWk212RSuMQ+2VrFrTlXm5TmrulXUvOTLIXK2taNy0Wa3dL6Z+M8CvG40W17RY1RLeVUY1TlqxJruXSfZ3eFDaqsIxlR2qZowrsV1G1ymqztMoOiE7fLLtoPuor1W+mZV3GOB5w1x5VK38sPk5ImlmT9Nr/cLbqiloKOWpFOZR5h5xjPK6dk1rbZ4au3wufuh4JaPgZWhaS72TT92p7NT25pqZ2tAkB9ysq3tsl1FLHTmerqwXuaDyMcFbLDk8PEer4Ivy5nX7YfrnV9HqG3SCojIfHI5oLm47cLULnudUDA9A7LZHUKGzinDqHY1xcS8D2PutdF8ZYxje+FiZZeifG+PFdPqEWtIwQCogADARF0T5rSuYx4w9ocPqgYxowGgD4UyIIEAjBGQgAAwBhRRBAta7uAUwPhRRBDaMYwMJtGc4GVFEEMDOcDKbW5zgZUUQMDGMKXY3GNo4UyIIEAjBAwooiCAAHYKOB8IiAoAAdgFFEAgHumBjGOERBAgHuEIB7hRRBAgHuFFEQEREBERAREQEREEjvzBSnO5Tu/MFA/mKlClPcpZPyFaC8Qt5/DaejohIQZnlmAfot91LttM5y458Ql7fWa+Fsa/LYNr8fcFYfLn8XT/FON9vMiWmJW7nE/2eFRhALuyrzvDCfr3UkAyVoN7mX0rwsXZjiE7mgDsFTHZeh49KoHuqszUJgB8KJAQd0Kb0rFu3ykK9dqlEN1ikPYFeRRjlbDIJH9go98MXkYvujTP6+4afkrqe7Suf5sO38v0UKjXjKm9x3Kma7bGCMvHOCsAa4ve7EW6MqR8sg/cRReWz5Cr9jQZvjdclu5kF0ulmqt7iKhznEkgjjJWLVDqV8hMDXj4yFNNUM244CoMcxzv6/aoTtuOFxPq1EPp/TVcFXAJ6aZk0buzmHIVTc5gcZCMe2Fq7w/VVTUdCLTLWTumneTl7u54C2gYzsdl2eF1j5IW2uv1BbZInVtbT08crtrfMcBkq4U1Syqh82J7XsPLXN7FcV+Oi7X/T1n0bLZrlNTefWyNeGEDI2FdS9LqiaTo9p2oqJC98lDGXvPcuIQZe6YsLWu7u7H4VKruVJRUxmq6iOBo7ukOAsL6k9SLD010jPeNQVjYgGF0bXe+FxDLqvrr4itXVMGmKuvttgDnNa+J/pc0Hvgj4QdyVHVrQdLXPp5tVWoFhw4ee1XC39R9E3Ro/A6mts7icBrJ2krkqyeBGC429lTfdaVYuDhmbdC0nP+C8N58FepdNQvrNA60rzPH6msZG1uXf4IO44qxkuHN9THdnjsq+/DN2Rj5XBugeu3UvpFrGn0V1ciqamJ7/AC2VE7i44H2XbtNXQXXTTK+ikPl1EIe0Y7ZGf+KCpT6gtVXc5LfT1sL6mM7XRhwJB+yuDJNzCXAjC4b6M33UFX48NU2uquM0lJBcHsbGTwBsau4hK0yGPCCMkuxoeR6V4JNRWiK5C3vroBUnH7ovG7n6L0VUvlR7CM57BcI6x1BqOD+UfpbLFcphQGWnzCDxgh2UHesU3mtccEAHHKllqPJjLiN+PZvdQaHmBrcYGO60H158QFt6YWyS20Lm1F+mBZBTgnJd3HZBui4amtNspjLcLrSUXv8Av3huAseb1h6eeb5B1dafM7Z/ENwuMNO9KuuHXaoN61fe7ja7XO7LIQQ8bT27hZ6PABYBFuOsqnzP7XkN/wCSDri26kst2g8y23akrOM/uJA5XNkokhD9pbn2K+e2p+kfXHonKLvobUFxuNvgcC6EFrAWjv2HwuhegPiKt3UW2R2O+ltNqKABk0DiSdx+6DoQyFgG4ZyfZVFSa7e4Oby1VUBERAREQEREBERAREQEREECOVKe6nKkPdNlY1O3juc4htkkjuwaT/kuE+pFY67dTa+scCXNaAMduCV3DqR4j07UPd2DD/ouEL9V+bqmtla0EFxGf1KweZPh6D8FxxPI7mFVBldVlkjmgHlTMmMfuFG4CnNWXyy7cLxvrqFo4eD+i0VZ8y9+pljWnvNfFjD2u/RUjVNc7LI37fsrZJdadvaMFed14nLsQx4Z7Kaf2r+2cHuCEfUxtAyrEKqpm7uLVK+KpeBiYqkxuD7In2vn4qE/xgfcqV1VAwbnSsI+MrH3U8v8chUnkxh2X+sfB91b7EZyRHpf3XSjLNrpQB9DhRF2trIvLMo++eVYfIpH/wDV2p+zaN3PkNTsQnk3j090lVb5Cf3v/mVLNHnLZ8f+JUTQUWPTTsypDb4z+SnarmlyOREPoJ4dgT4f7KT3yf8AQLazg5jXHK1Z4eMf7AbMB8n/AEC2rL/Vn7LqXx84b/lAQ02XQ7pHENNdLjBxj0FdV9LWiPofp2QuHlMt0bj+jVyp/KBjOn9CDbu/p8vH/gK6f6cNkb4d7U9zyNtoGG//AKZQca9arjcutninpemkU8htcFT5cgjcRlrgfcLuHQehrTozR1FabfSRROhia0ua0AkgY5K4z6DxU9b40dQVtQxvmxTsLCe+crvkHPKCVsLQHfLu6eU4N2gjCqhRQYZqrphpTWVXT1l8t0ctRB+V7WgHv9lkP4KK32cwQANgiiDWt+ABhXJeavOLdNwD6TwUHBnQ5wd/KC6wl3ek3KT/APjau9DLG2QucNpxwT7r5bPtvUS7+MvWNH04lfS17ri/D4pAw52N+QVtUdOPGQWMbUahuJO44/pbeP8AyoO8Jntlj3huSFwFqsR/9KDCZX8+ZTYOeOzldG6A8X0OWHUVwPuR+Kb/APitWaMt+rqPx02yHW8r6m6sqITI6V+49nY5CD6T6mvEen9H3C5zShrIoHvaSfcNJH+i4N6JaXm6/wDiOuOudUiSSitszZoGkkMdglp47HuuvevBe7obdY2uLHmMkbfjaVqfwT0VHD0RfVhjRM8vD3DufWg6ioKGjo6KOmpIGxRRgNa1oAGB9l6XMJ7FQhOYG/GFUQW6toYJ6d8VRC2WOQbXNcARg/dcC+IbQ8nRLrnQdTNKCWKmq5jNUMaTsHsOOwX0Kdtx6uy5h8a9PTydAa1/ls8xkfoPuOUG+tF3mG/6ItdxglDxNTRyOIP8RaCVkq034bDI/oZbGzPc6QNbyfjaFuRAREQEREBERAREQEREBERBAqX3KSBxZ6e6dmYJVJnUG2P6vlDdJ1mBnEbu32K+d19uNYL1ViP0/vXdx9Su9ddXylt9pqKeWQZex3H6Lg/UMkEl4qnRgcvcf8ytXy778PR/huK9Ld1WMVlvqKmRr55vzjPpOFAWqFoHLv8AFXVw8zy/o1SEYWprHmXsmDJaI3d4BQxN9v8AFVRSxbeQq5CAcKa5Od5jSw/736FRZTQj3f8A4qsQjQqwjOabeIS/h4/bP6lTCmb/ABAEKq0KpjhS8K1vaPbzOp4W9mlUzG0dl6XBUnDlPC/GVARx+wKj5b/4SFMAqzRwoLMzEu3/AA2VLJfD5aJN4IBcM/oFt+Qh0WQcgjhfPjol11unQ64T9POpdvqIaCCRxiqGRuk4LvsB2C6FvHi36RW6xurqe7VkznM9ETafPJHHAK6h8oNT+OxzJn9PqNhD5hcZMxjv/VldTaDpYx0bstPIDukt7GFue2W4XGNjo9VeJbr9bNRuo5G6ctdSKgGbLfSQWn0kfULvG1UTKGjgt7YwI4GBjPsEHz/1XPXdDvGrHfKthitFfVj1EYDgAT3X0BsV1pr3p+kulLIHxTxNkBB7ZGVqLxE9FaHq9op8NO0Mu1Ixxp5AADuP1K5W0P1l6o9AdQfzX15bqmrtcR2smG+XDew7DHZB9F2yMLtocM/CmL2g4JGe60JYfFZ0luloiuDrnUxSPGXRvg2lv6Eqyam8YXTSy0sv7Lnra+Yg7B+FJy744KDo2ouNDS7fxFTHHu7bj3UawNltshByCzIIXAdDW9a/ET1Fprlb5azT2nYZMh8EhY5zTz+VwXclnpZLVpSGiq6uapEMDWvnk/MSGgFBxD0TiMX8oJq+U9m3J4wf7jV34OTuwDwuCujEZ/6QXVs+2Y077lIWucwgEbGrvMl20nGMc4CDy1TWvy8NIcOFwVqltLF/KfCJjHE7qbBzwDhy77lIdEDjGRkr5+6wp6p38qLS1EUMvkOlpgXhpx2cg7X11Y/5xdPrna3jL300hYfrsOFx/wCFHXL9DdRrr0s1Gfw5D9kQk9Odzs/8F3aYgYiAA7PBz8LkrxH+Hu6XS/N1709caa9ROMr/ACyGbiBxzz8oOuIdnktMbgWEcEfCnyM4zyuH+mfi7uGlqcaX6sWuooqild5P4iKJ8u4DjJJAC3SPFl0XNH+I/bldtxnP4bn/AFQb0mIELnE4AGSuFPF5rqbV+rLZ0u0+/wA6ad7opms9RHKuPU7xgTagonac6W2+qrampd5QnkhfGW54zkAhXzw69AbrT3uHqB1Hc+rvEhErRMQ/affnhB0V0q08zS/TC1WsEeY2njL/AKHaMrOF5omtjlELIwxoHGF6UBERAREQEREBERAREQERD2QSOcQ4DGR8qy6mvVNZLJJVzzsiwDguPdXSrlEFK+Uu2hoyuUOqvUOpv+o5KKklzSRHaWg8EjgrB5GXt3C5jpuYeTXutJrxDUztmywHDSD3ytCuDZaqRz5BkkrNLnLJJbHjbtjPsFhDmt/EuWovl7pet/E4rSI2ke4MkAacocDuhYPN47+ykfuacTDafpyoa09MtlxzWPKIBd+XlD6eHcFRZFVkZY1m353cqv8AhZpYgXBh+ueUY9+Rir+3l4IyCpQ9m7G4ZXrho3Of5bWyEn4ar3RaE1HcTvtlujkA/MZXbcfbhUmdMXL1HDjr3RKwNAVXY4tyAcLN4ul+onNH4ynih+dj8q603TBsMXm1VZMGjuAAVHua+/Xsf+tYeW9xIa0khSmnmJAETjlbcZ0/tMQEn4yf1cflC9jdBWhrN5rJvTx+UJ3MO/yCv+tMCCUOwYzn4U7WOBILTkd1tqTp9a5Z3SsuE+0Dj0heR/TKknm3xXCfBGTwE2jTr9d+3VutOkGh9f08v7fsrXySDaXtw0/5Ba8ofB90foqptRHaZnlhzgzkjP2wuhVLgDOBjK6t4Ix7S+k7Lpe2MorHRMpYWjBAAyR91ft4DTlu3HYlTgAdgokAjkZQeZrHvLHjg59WfdWHUuitOappTFd7dBMzsfQMn9cLJhwMBU3tJI24xnlIViNtAXDwidJLhXSVTbPUQunOXAVBAb+gCvVk8MHSexTMfT2GR748ODny7gT+oW594VMu2uy9xBPGFLtNLbZrbQ2mA01JQR0sEfDcNAyP0VznYyalkje30vGMfKj5YJ3FxI+Cpxk9wMeypo0wuz9L9KWbUkuoqKg8q4TP3vkJ7nt8fRZkT5eM854VXuFAgHGR2UdqKFS57I/RGXE/CxKbptpibWrtYTW7fcgGlr885H/+rNUVRRDnSQgtOz5BVN8JeGsIGB33DOV6do+FFBrvVXRrp/rWN7b1aYpXu7ujww/6LXx8HPR0jH7IqNvx+IP/ACXQYY1pyGgFTINb6U6LdPdFMYLNZGB7exfh5H+IWeRs8uV0bIwIz+UgYAXrwM5xyo4CCgZHxENc3eSe49lXUMD4UUBERAREQEREBERAREVInYIeylLTuzlQ5aw5KWnQwzqjdzZundbWRP2zBuGj5yuK2yk188znbnucXkfc5W/fEVqWaGOktELziZp3D7FaKEMbIxJJgPeMFaPmZN3mGy4+PdYla4566rp62OpicxnmfusjuMLH3UT/AMSVf7lcqWCZlOZi3Ax91TayA0/mtfnK1tfbrum9UjixqYWH8FJ53Hf2XqitFzmdtfTPe0/xgcBXClq4aecmRgcPqFkLamoNgfVAMipwCXPcdpx9Fk77tQ2nI+SzMR2xpj8WnaClAlrbtBF/8t2cq72WzaZrK7eKpkjj/C1xWr711H0jRXB8LJ6ypmBw7fES3P0KrWfqJpJ9VHJFPVQzuPLWxYaFe/jzre2kzfIslp1Et3stlLSVzBSUhAyPUeVsi1+bT0MZfs9Q4DW4WAWm50d1scVZSyggADJ4KyenuQltUbWvOYxyVhZL6ntYk8/Nkj+zIKuUuYrbKzdTO3HI+FRinfNM0l5Lfhel5D5nBvYeyt7WpzZZ/a3lsbx5e38vqUrpGFhj2n1JM8QMOe5PdSQ0z3yslycYTaE3yz+0tOIG2ssz69xzyvZboDHRPBGS85aqctGWuaxrQC07n/ZeqF34arjkeSYiDgFV7iJyx/8ATqZOFAlSB43ELsHLzbSpwoYKpl+3LnEAD3KgKhjuzgfqOydsyp9kR7VcfVUgcZDWEglUZaxkcgYeCexPZeWK60z6l1M6ePzQC7aHDOFKKytW5NYUbreo6GmqPJZvliHYFWPSmqze6WR9ewwyNlcwNcfYFYLVMobr1HvtPPcq5rmyDayN3pWOWesgYz9oQ1VVFA2sdTlsnpcSDjOFOKysfzq7dHxO3DIOW+yna5heWh3PwrDR3SkprHBUfiWmEtzl7vUV64blGHAyDBf2wPb2UZrK7Xk1ldcFAeVRM/AwDzyOEbUNc8NBDj/u8qHbLIjJEq6IiJCIiAiIgIiICIiAiIgIiICIiAiIgIiKNRLuHP0UJOYzj4Ur27cke6jkl23HGFS/ockddDNV9QKeFpOI9w/zWuaiJzh+IkPpxtx9ltLrhSiDX7ZGk5kLitRX2rdSWs+WcudkYK53lz/6S23Hn/zhre8Omu2qn0dLn924jIWXUNunhtzWyOOQEslup44XVxbmeX1EkK4l7iC32WFE+V7vmHhbSea7a3uCsa1/qiso7Q6zST74CMFjeMLO7TTt/FE9/oViHUnTk1YX1EcTM49lk0tCMza8NHU1NT11U6OEidpOS0d2qNTbDSXJrIJgwA8KSa31trqZDDDM1xJ5DTheuzWi9XCYSPic5rTnJBys+MsdrFnBfbbmgb1c6aljoX1Jka5wOB8LfVLO1tmaBGWOI5J91o/QdsrJblGZYWM2DHZb0paFklPta55cB2PZazLG52y8NLVny99vnw4NJ5KuRk8kyOJVroaV4mLnkAt7DK9E9SyVsjJCA/PGFaZaS4tMhDm9gMqrba6N8Riz6m8LyVFfBHFsJ9RGF4aSI0kjqlzjtec90GVvlZJUkYyGNDnN+B8ry3JxfAwMd63YdHJ7Nb8K0VF3ZRRBxyZye3sR7ZVVlbLLSiR4aHScgfCEy66JwFQmZ6d7e4VZ/wCTI9lb6+vjoaCSoqntZGB3PC7PTkMt4rG5YzrPUL6azTU1M/ZK5pG4eyxmg1sLDpmSpvdX5waMtY7j2Xmq7zb7tVTTxzNc1nOHHuvHTx2evE0jJGeYxjvRUkbScfBWVgxTaGk5PUccTqtmJydQNd681FSw6bZPR28vwZG8jC8t6rNR6U1TDFXXKSoragBgmIxsDuP8lkUN9kpLR+HqIaODZnBo2hrv8lb5prbfaOOzwF5n84TuqKnuGg8gOKyYwtTn53+S9YbHbXy1P7SDrizmrrsdz8kJb3Wy6l/nsa4c7R/v/wBtWi62uV1zmpKWthELDhjpH/m/vfKtlhoRb6R9FNUudI+Zx8wP4AJ7AqX1NdHPtNtbe+53a5HUlJpaK5OeZMtEo/8AhYXs1Hcepei6+lrJrpPd6Nu1ziG7QG47Ko2hotNympmkZVNn9Rc075W/b3C99FqikElTTUGZo3RegV/q9Z+/soziZ2HnTHuWU2zqzTXzSz3wuFLWuHDc5IXr0HqebzpKW5Ve8ucSxzv4iT2WNxU9DLpxtVdWUkU4xltGA3/RVW1tsbUQOpXBtNSkS7jw5x9x9Vbth8Nxg51ZmPLd0E3mKs44CxvTl+orrTiWnkzkdieVkJcHM7rX6dBTNS/9ZVAcjKKUHDQo7kXUUQHKICIiAiIgIiICIiAiIgIiICIipAlf+QqBwOfopnDLcKV7SWgBRvG4HNfX2jLdUUM+OHNcc/quetRbpKyOAdiQurevFmqqmmpayCF0giYdwYMnuuW6kfi7uCY3RljuWyDB4XPczHb7J8Nlx7fjEIQwmFkUYHG1R2+oq5VFP5UQmy0jHYd144mGUnbx91rtTE+WXWIn29Npb/ScrJX2anu1IfNjHb8xVgt7PKnIOCsqtDWtH71zsfAKla0+NLkTFf6sHqNDWw15EkjKkZ/qsL1T2C02KiL6ehbC544i+FnlVJQw+ryufkDlY3cRDW10cjCSwHJDlOMllyNz+lDT1oMUTq1zfLBOeyyWGrlMJNM/YWd8e6t1Xc6WGCOEB2AACGhTRxU0sBme6VrDyA04P6qO5mVNzt6IKi6SSPkMji0ZXlFVLM+QuJ3grxuq2UchbFI9zXcYJykUNY8mSMAB/IBSfCu4eupxLGDn1hVYqmonpvw7wcDsvPDFK+Rrdrt2cHKymKjihoW+ZE7eR7BViN+lO6GKRNqpqqZ1cCC1npz/AJL1wGonmiZ520NYcK6SUMdRudIS13bA4WPzwMpK3LnygDgYKr2yhN4/TuB4JZgLVfXSuq6Lp4BTSubunjDtvxnlbWfw1Y9qDTdDf6YQ1zXvi4JaCuyiXMZcP2U05jZWUsVVSNoTtiecTSAdhheeasMd9NKKt07XguaSPyq7db3xaEv2nYbJSOlhqKksmjDdziNpKyLTN66bXejZ+26eotdSW7Salwjz9lk48/bDSx8cyZt2rDAYYpmXWoiq7i9sbsbH4/KrhJPTUO5klWXgsy2XHutuUGk+mZpnmmurJYiPU504cf0K8Vzouldip3NqLnFUZGRE2YF6ufyVj/reaZ7dNT07YqllK99SajzAfNJHZU7S+muFLK39pGExyuDYAOOD3VDV2s7BK+ah07SzW5lPwZawYa/7FWnS2srTbK4y18YuNHL6DHRAGQOPdx+ipPJZM/Dc0V74hkdwZPGI/wAHVudK780g7tXkrsftmGlhqneTta59YB2cRyMfRbQsLeld8pmOdWy0szhxFNPh3+CyiPRGhY4DLFWx+QR6nPlBVP5LDv8AGORX9NHw/tOOpmpxcJHwF37mbH52q5OgzHDAbg6MMdvezH5lnV6HSvT1PJILg6sf3bBBOHP+wC11pa+0Oquq7rd+zK2htmGiJtS3a8nJzz8dlSeTuNJY+gcivmYZv0hrauo1bWRMlc6COQtaPbGF0BCQ6EF44WPac0daNPTyy0Ebg6Q7iScrI2NewlnGAsNuuNgmipgY47KICAKJ+FVnTOkQigFFUUidiIiKiIiAiIgIiICIiAiIgIiICIiDyV9FTVtOY6iISNIxgrkbqxpCnsfUuSRjRHTuY1zQBwSeV2BIXAZAytL9eNKSXKx013iaS6nk3v2/2QFh8jFvyvYsmvDn78DE9hJ7u5AXgnpDTtc5oVx/Fsk2PaCMDCqVRp329xc9ucfK0mXFqWdGTcLBbZjJWEH5WY0TsLDLa3FxcR2ysvpHbiA3n7LGtXS5iny9NY3zGYVqqBDR0hlkjGT2JV5cWgbXkA/VY3qmokFI2GMtxzhRbCk+FpjqHz1ZcXYb7K7U7a6bLRVOji/1Vnt0XnFkbgdxI7LZNHYbW6xF8zpPNY38rXYKb15W7yxt9pj9Do3eY/jJwvZ+Hq4qqAbyB8L3SUwFNijyCD/HypY6VwgEtVJiQdhlQndlmbJXRVMNVGQ84JGVcqqunbUQxeacbSrLWTtEIcZMEH5VmmuBkqmPbKTj6q9jiYW5syqJ8j6je5/v2VaptsFXI2SRoGFiMFZKLi15qWbeMjKzmkrIZ4GOaN2BzhUm8rcS6xx2VJ/DXFVHnAVGY/0cn6rrpnTVUndtOXvEVK+HWNimjlMbhUkh49vSVz9d9TagpWyzX6wQ3iN1SIoJKiQ8AnAxhb+8SDBJqXT7S0kOqSCB3/KVpi/WGrvmm2U1G4boq+KQj3DWuBKtTZ3XSoxUxatHt6mX69261SH9iRUkcLd0oY8nAXgnuF8uVe1tv0ZSV1aY/Ma58hBDf7Svss1BLqmbTlXUMjguYbCZHHhuB8rx2C5Md1pqKSEl9DT2x8OGHlxAxwVTvbSmLBvemB3Sy9QtRVczZ4XOFOeaUPBafovLa7JrGkmNZYqMwNb+7k2PxyO63DoVtDQ1d8rKxz6aOQgxMqXZc37q2W+7UNn0fVVV3ifM5tbJJD5J255yM/IVJvLN/kceK9swxq1zarbXMM+lYJpByaySQh/3wsot2qtT3yl30m9sTHmI0pdhriOD3XjvF0rdY3nTN4tZEEMcTjWMaMBpJ98KfUNTBerNZotLTxxvguGagR9+OCTj2yo98sPLl40/pjd6vdfRV1TWnTFPBJTP2PmDjlpK2n0iuNXfLzbbhc6p8kxmADncnA7BWHWVvF96e3OgtL4nVTZWee4DJJHx+iu/Q+mki1DR0zxjynj0HuD8pF52xM08ecdtR+nalJ/VKv7qhSf1QVf3WW89tGplMEIUEyiGtogKKgFFDWhERAREQEREBERAREQEREBERAREQSP3eY3B4914Lxb4bvZqi3TNBbKwt5+quDtu8ZPK8z53FmWMyQVHJ/VSv9nHGpdMy2HVtZQPBbTtkIZkcYVhudHGKY7VvTrha4XTUlZA0NkLCX49zlaVraWUUZLvhaDkT5bPHTcMdoP3c5aFlVuqYKIB8zgD9VikR8qoOfYqrVx1NyH9GJwPhYFp2v1r2yyW518D2GdjhgLBq+oqbrcyYqhwjaeAFUqHVMEBpJHHcVeNN6eL6QPe1xe5RZVJ8PfYbO4ObUOkcSB8LNqBjvLn3Dl/Yry2yjfRRbDC4j7K81VXHTWfzXwlgaMkkJra3knws1NC6mrJTUTnYAXYKw7WGqoaKeKWKZpa3ORlUNb6soaPS0tfS1Q8wuLMBy5cvmq7zdKwgTO2A+6ysOHuY02btrta1FQSWkbP7ytEmr6gEiEAH6FaQ/nBeoXbXSen7L1xX6tc3LJAT9ll/RpbmzdNJe37hUyV7hzy3K2jo3U8Mga0SNOfYnuuRIaquq6kSOlfGAfy5IWZ2e8XGjcyenqMeX7ZPKt24uo2Vl9dj2VnuV2pqQPjmlY14aXBmeSArpMBsDiD6eQueesdfW2nXdLfYDI2njpJInnPpLj2W/veKwxOPTun0x3rLOzU960xURP8ljKxxe5hycbSFbqfRMJjc+luE7Nxy4taOVBlOLp0W/nSI3/ioN8jwTnHPH+q2f0diob7pDzauAmQnHJ+ix62i7f1zzhxTEtZVHS2yVUkFfNUSukactcWcgqeDpLT0tY6sts0kcmwkyhoBI+F0o3SVl8nyHU7vp6lVbpy3tjNMIiPfv7K9WGFj6paJ8y5ej0VZqqOZtyuFT5g7t8rIcvY/pTYqulgp/2lPJC94/duYMBdDS6XsFPvmmozhvc57qMekbCNtRHG5wJyMO7KVojSU860220PN0aobJWNgobnMynmyXNa0AFW+l6QWW3W914o7hLStmldEWRMHJzyVtLVGqNNW6aupJY3ukpHbAQ9XjQ9vsl/0g2r/DS7BK5waX55yqREJZM9qx3S0hQ9P7cLhLSUt3qYnS5fIQwDeQPdeDp75Vo6sX1zJHSsoaRsuHDv6it9a6s9lsmkKi9U1M+OdmAPV8rSejqeJ931RqZrcU01AIgT7kOOf9VYt4lc4+ec8ah0np7U1FXUNEZZmsnq4vNZHn2WS+aHNaWfxHGVyroCsuuoup1pucUrmUlugfTeX85IOV1NS+iBrO+BlZFc0Wanm4e23h6PYIij/Cqz6YkeIAoqAUUggREVQREQEREBERAREQERPZBKohQyo5SVNaQ5yh7KOVTe/Cevalrb8QlcQDvd7LH77faSz0MlTLO1jACeThXSvulLbqGSoqZGsa1pPK4a649ZarUGp5LTYJnMpIXesg5z7Ht9li8nPFY03fQumX5WWKzHhm+s+oUt91Mdzh+HjJawA8OHyrPPVwVFEXF2MjsFq3T94Zc4Wx1MwE0fpZk9wsyhIj2CR2WH6rnsmTdno/M+L/Vh7oh5pJAypIFO14J7le6kq6qjqgKehic0+xdhXl1LSPt4fEAXYVikiqo3F4laPuFG8xLh83GtjtMWh5btM+rr2makjp/qw5WY2BkMdFFsnkJHvtWGiR0lUDMRJj4WeWGop5KNsQAjx3LlBjdvnStBdqiWOWBm0ua44cXc4VsvNwrqulio6bMpHErZTtB/5qWa2UtBeHVoZLMOXEsdwoXetguzaJ8bmsiiz5m3gj7qsK5Meq7aB6tU9Qy5CCmaIaLYC8MPAf7rUjHMp45PLbJUNb2IaSf8Auhuo9rpbnRmKkdtdH6/Uc7sLUNiuM2k7xNcBAyrycmn2BxH05Ww48sKYWe33yxsIjudvAb7l8ZyshiuegQ0PgiBd8eUf+axrU97l1DcDM6mjpcn8hYB/orZG/8ADwYO3t3wthExpbmGQXfU9gdMY6OgAyMAsjJKt4qp6V0U585kUgyGuaRleWwXKrtV5dX07IqgHhrjGHNB/VZbcqy56gqqae81VG5pb+6ZDEGbeffCt5J8JQ+vNY9zaZzgM4Hb5XNHVrUVDfbw2zCUtgj9Uz2j8rmnOF03PGDE4lwGPc+y5D1raY6HUd3pnQvzVVRqA4n82PYfdZWesz6V4N6RPl69H7LxpzUtnopn/g6mlEVOx3GHbhnAWRdDrrI29T2WB+W0rnMeXHHqAWOdN6KuqdXUz4aOSmjDxugdyWj5Kgx0+hetMlogBjNc91W5/tjPKjxaarO2w5VqX1p1dHKJnRn+Id1GSdjA94aTtHJwvLZ6mCstUNTTOD2SN/MFJea9lvt8lRLK1jWNLjn3A9lkz4aOMUTk1DRHVO+3qpqq2SgulRRwQ/lG7YHf4rBtBdStT0+j6uouVbPJVmV8MURcS0jPByrLr7Ws+tdb19FPMKWxRPxg8bm/cLGoL6Xaujsdne2SBkTXOkaMgNUJl2fC6NF8Xfpk8NNV329PZW1kj7jXvD5IgdzWke2V1npO1MsulqShhaGkAF2PckBaB6RaRkuHUOouUg82ijkyHe3ZdOGKKmpRtIDWjv8ACuR6aTqc1rb6oar6z6ggp7Wy1SFrWTRnefg+y07QRTWHoxQw1Ej2msrpmOI7lpwRn6K7dXaiTVurP5sU0hbVGYGF39poIJwvV1Cs1XbbTbhJA51GGMYxoGMPDRkrGy+kuDNcEeVh0PqqlsOuKd7G7bZEDFO/GCZDjbx7rq61VLqq3Q1AAO/nv2C46o6GC4Oit8FDI17pmPcM8uIPddg2Sm/D6ep42gtcY2jJ9uArGGs7YXUMkTZd1H+FStBEbQ45IHdTDthbGPTWT6AoqAUUUgRERUREQEREBERAREQEPZEPZBTPdTAp3UB7pXyrvcJS4B4affsvNVzsgiJe4AgL0uDN25x5b2WpetOuItGaLqKt8wFRKDHE3ODuI4UMttRtk9N4k8jLFIaa8RHV2pFZ/NmyVAaWgsqJGOwWn4C5bLd0rpXEl7iS4n+JV62urLteKq718jnT1T/McD7FUlzfJzTN5h7r8f6Hj42Kt9eVQVMkBbJAAxzT3C2DYNSMr6NtNJt8we7lr2OLzn7M491SM08NUDSksLDn7rE1Mun5E/ZHZLelNXzRR+U4AN+QVdqGGCrYWyHJK1tprU7a2FtHXHY4cbne6zOmnkhlD435b9FWHIdd6BF4rbHCFwpXU1dtZE0MJ/Mr7Z42saAHtdu+T2XguErqqk3N5dheC2VDaaWN08EhIPLs8KrzfncDJgs2T5NMKN8TwCXMP+ixKuoILLbWTgOkMoJ8sjgq5mrFXG19LUtiOMc8q01QvFRU7H1kcsMHcBvZVhrJm2tS1xW1LqjznTQBvJxke3wtWahsVdUXR1bRtjjaSScOxlbfvtFX1sj/AMO3LRnO0LX14tV+85kFLb552nu1g7rMwzpamGrq2GZoM88B8nOwPAy7cPorYZGtqA0jdH77u622NL1tW+Oa4VkNFSggFkrPcdxwrFNpC0VV5rHm4wU7IpMM3Z/ej5H0WRORbmGNW2zT1jzJbCAxwwInnaMrNbLpqWidHV3Iskc3gR7g4NXuh0nG2KGajro6osOd8QIH2V2p7JWihmfLTyRgyAhzuzvsqWvtSH1FlGIXb+W45Wq+qNsoIqGK6shpxMwANEmADk+62rKSGZB7LTHVWtt8gFHdmebG/kDOMcrf1p3+3PcvlxxY7l06Xvpau3yV9XDSx1AbyYSD7rD+vlge60w6ns/lG4RysiOHAERE+r/JY3Qa505pW3uoKGsjppGj0tLs5KxG69Up7tVPpX073wSZjcd3BB4JV6ONFY8Nfxfk1cl+y0t/dHNUQXHSbLa2fc6FoAc4/mP0+VsC+0AvGnqmjaB+8idHuPcZGFyVo3UDtHalpIIXl1C5/wDQWg480+4C6vsl4FztMc+Npc0Fx+D8LDyVtt0mG83mL1cIdQdOXzQ1berHdaOV9BVuxSVkTC9wA7lxA4Vs0nU0VZsLI6iGaMYdtjIke0fI74XVPiCoqm79P57VZ6yNtxqW4hYG5cTn2WsKLpzV6Z6m2evlmbOZ6OGGXDMAEgZyoxSzuOH1v6sHZOm4ei14s1dZ3U9t3xz0+GzslbsJKzLqBqOOxaZqHOkY3zWFjC08h2FjGmdIQWDW91ujQIaYybnO9n8LUXVXVlRftSuttvc40hd5b2A58sdi8/RSiLenJdTvW95yxK99IbdHqvXU+oby4MktrzFE4niQOAOcnutya5prbJo+RsrYnOgBfEX425+65ZtmvJdNTNoaHNTR0X7qV0ZwHn2Kzj/aZbr5p78JfrpGIZ8sbSuODGfnKy6cSt43ZyvL+RRjmKzLMel0VPcrhLV1dJQ+dC/YwRkEEH3K3iwgQDAA47NXPPTis01brqKSzObM95yS1y6DpnNFO0H82M4Vu2CtPTK4/OvyvNnoafSMqPZMZGcYQjLVbZ1d/tEEEcKKlaMKZEhERAREQEREBERAREQFA9lFEFNvB5UrpWNk2nOSp+5UkjWgbz7KsRClY14eG4TCnilmfIGtaM8nC+f3XfqPNrPXc1FFI/8AZ9KdrB8yNODx8cLpbxEdQJNLaQkgo5ttRUNIaAeVw/O41cMtVNzLI4vJPyTlavn55r4h6P8AEOjza8ZZh52B5YHyY3O5IHYKbBUsJJgbu74U60E2757pex48cY/EIDIOQcKY7Xc4wfooIq9yVoiUXySNaDEdrm85Cy7TOrsRCCvc4P7BYh7KMTmOG6T0PHZNp7iY7Zbmpa4yR+YHNLD9VdKaainpnskyHY44WoLLf6ulqQyZxMPyVnVJdaOtjJglaHY9im3O9R6Hgz7mYZPFQVLKRz4JCRuz39lJTVFxhrZWMayRk/5tx5Co0VzngpDG4FzT7qvS1LGVEc3cE8/RNuF6h8filZ7IWS6Q3OWSSlt7WiQguOThYNV02pKOfZK2o3Du6ME4W34mRvqHTxPHmd/0UI6ut/Gv/ceYCeOAr1ckw5PkdOz09Q0duulRa3muo6k4c4NHluIz89l4IqCpY1s1XbpDx6A2InI+q6HZWiSMU09u7u+AvRtijqomNtW9uD8K59sSxK8PkT7hziykrmNbI1tTTte7Aa1paFkdDRaiqWsoYZGP3jcPMf2AW3rpT2yaGFlRQAASZPthWunorQ2onnpohG5r9refZR+1SeFnj1DuyXHlE5xj5Wl+sl0sdLp6SKuifLUu/Iadu4j/AAW5pWh0ZY5uQeMLCb308orvUGV7GgnnkLscNoifLkeqcGeRTUOK44qt8hDLfPKHE+uSMkgLKqHR/lWk3y5RvbBGeI2D1F3ccfC6cg6aUNO3yy9rWn/dXg1hpNlv0y40dF+JDPUQOOyzJy1lws9AzYb/AGw5vbcqnUkH7OdbHU9YPTQPbEWtY75JxwtrdO77dbfapaeslcYmgxEuJz5mMZ+ywKn15E7UjLTHaPKnL9v5uVc5Jq6G8yUclyMDHwmVrcfmd7NT662bfB1vLgj62YlxZqCnul2qmyTU7swt35Yfuqt2cbzdYKptQxvlOa8bXfHstc3arqzpiFlTuhkDf3jic+UvbbqCuMhDLqWRNp/N347cd1GccQyK9bzXn22RqnUdwl0u+np3ARFuJ3NPrz7YWl/xV10/LLcZLeKq6T5Y5hYXxiL+E/3vlZHHTXaSKF8ep3TsnG5o29wrZdeorLRdzQS2wSODAA7d+YpGOGPyOs5bfis0mmjq6zVV5tsD6Srp3AVED2+W17jzlo9+Fi09DW007hLRSuGNo2sJwV0505tf85rKLjPbfw7XYOCe6zCt6bW+oax0ELIyT6jhSnJWsaay3Sc3Lt9jWHQa5WPypKeppHxVjXBofNHj2+SujIdpjbJwSe2Oy17QdM6Wjr2zseOD7DC2HTQfhqJsLRkALAyXdj0nBbHX8lcKOeVAcN+qKzDcWTBFAKKqqIiICIiAiIgIiICIiAh7IoHsgpSO2t47rx3OqbT2x8j3hoAySTjAXrDC55e4LUvXfWlPpnp1UeXKG1MwMIGecEYVnPk7I2yODhtnzxEQ5N67ayfqLqhUUDZfNpqGQsaWnLXD6fK1lGRLGD2G7GFSklknmMsud7uTlB3XPcnN3y+ivj/Grg40ePKLm7ZXtHYFERYcNzFu7yIot7o0/vFVVDs4ZU08Iz6gWn2VCqJD2kd8hXKOWOdojqcebjhxRWI28QD428kY+6qUVbUQ1LhC54A7ZVaWjLD6huB7FUiTEPLJ7IvxSJjUspturJKeLyqnB5WT0V7pqryWMmYN3fJxharc0vUY3upj6ScnsqwtX4OO/uG6pKiOne2WOYv3DbhhyqguD2ub5RduHytR015u8BBjlftV3ptZ1ETwKjLj7glRtLW8jouG/wCm0or2WD1RAvHvheyK/wBZHEagRxHHsRytXjXLM/1P+amGuW4/qf8ANWZmzXz0DHH6bEqb4JGgmNhc49iFb31bnFzfKawE5yBhYjS6oimBdJSfvPblUqzWz4AWPo/t6lPclegY9+n0jc5Q3OPuqhY0+yiGgdgu11L5v1baiWtxnBz9V56oRT0b4Zmbg8FnA+eF7sAjCh5bcYI+qrEylasWpNZhzdrjoxdItSx3zTXkeaHl2JFb6XRt4q6gftqlkfNjZvgacBdQGJhOSFSZBFGHBjAATysqvI1DSz0ak27paAj6NTT05L53vbJ3Dnk/4qWXo5dWQEGtG38u1jyDtXQLYY2DDWgBDDGTnak59rd+jefxc2O0RXWmVkdHDO+WEFrC4EsK8uneh96uOpmXO9GE0wfvDc+rOf8ARdOGmgLQ0xggdgqkcbGn0twqff4XMXR6V82Wy02untVFFRUsLWRRtxwMK4naHHuOFWwFAsa4gkZxyFj3tNm0x4K441Cm1zf7Jyp9x9yMKbCgWNcMEZUbRtfiIiNQkLuVNn0KOxo9lHAwqx4RrExO5SsOQp1AABRSU5EREUEREBERAREQEROyAh7KB7KmSWMc5x4AyhrbyXOuZQ0Uk0hAa0ZXBHXvXr9Wa6dR0UxdSwDDgDxuB5XSvXfXNRZtF1EFvyJ5mEMc08hcFyTSmsnnqXlkkshc4n3yVqufnjWoekfDui98/ZaBzg+QuA4KiO6iWBrsN5HsVLlg7uwtFaJ9vX8VIxxFITIoNez2O5RILvy8KMW2yvq1+xStP7xQLJWjcTwpm4AyRyq7QmulCrPqH3Xra9r2hv8AFj8y8NQdzgPqvQzhoCrCeKY9S98FU+E+VKNzT/FjKlnja6YujOWn3VEOcY9uePhXSG11FJamXGqjc2jf+Q4yCrkY5lb5HJph8zK1H0d1K7Ev3C95opK87qOJzm+2AvTTaWvRY6Wej8mIdnk91S+OaxtiT1Glq7rKyhko/jwPup8MDc5BevTXU1NTksbUbn+7cK3sIDsOZh3sVarDKwWtkjauHOx/Cpg5+P4VTTJVzwuTbU6VWzua7eC4Eey9YlgrYsTZDx2VuJJOSUBIeHA8j3VO2E6xt9ZURF2L5MEREBQwooghhMKKIIYQBRRAREQEREBERAREQEREBERAREQEREBSvBLcD5UyIKZ9L2j5XivNWyjtkkrzgAEle54z6vhY5rZoOkKp5k2/u3D/ACVJ9LmLXfXf+uWOo2qH33U9VTMAfTwuw3IzlaxuGl7dcIjI5ux+fY4WT1MH9Kz5pB3Hc4fxLx1LA4hsbf1XL8zJM2e9fHORx8dYiGuavSdbDUvEILowePdeCW2XGn/6q53/AIVttjCIwC0FQdE13dgWJaZ7XX91LzuJadMNyceKFwx/uKk+GsH9ZC5v6YW43U8WCHMAXjntdHNndC0qNPSfZufbUjY3b+SfspZDtWyqzS9FLAQyMROP8TRysVuulKin8x0Ty9rBnJUl2sRHtjP5yvQ32UkULmZE3pOePqqgGFOsJTirkhUHZb30LqDRT+nVJatQGIviB3NJGVoYOwqLof3/AJoGXnsE+zTneodNtm8RLc986laescr6TSlnAB4MlRE14/Tha/u19uN/eZmzsgeOXtHpa77AKxTVDn0zYi396SAG+yo+XNHVNbI8tDDzj2U/NoYfG6Z9FotaVUbmyn8RG8n+0oSSAvwxuR84XuiqopyYKg8bfSfkryvpnxE+YTHns0dirNomrqsFI7PxUEUGHeD8g8qeVuwsDPVuGVSJmUqYo35U0U/lnYT7gdlIA44yMKW5QrXT6zIiLs3yaIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIexRQdnHCClkmBw91gnVe5fgdCyNDsOf6f8Qs8wRL24Wnuu1QXWWGmjJyZGEj6ZUbTGpSr720HR0BdGXS+oleyS0xyU5LW4P1U8b/Km2MG4D5XodUSOIGNrTxwuY5Ndz4dLwuqXxTGpWM2iUNwXBUJLbI3+MLIpWBoPqKts4Ljw8qHZHa6/B8lvWvtZ30Mn9rKl8hzO4V0a1zM7jnKgRG44crHbrwzMXy62+2ZWxpbuw8cYWM6rqTFY3+W9rXy5YMrPoqGCV+D2+y1J1LljbqAUFJM7EOHuGMd006rp/V45GvLFYmF2HTPBLRgqKoRtLozh5OTnlV1WPDou2ZjcSKoGB3ltmcGsJ4PZU1KQXSsD3Fzc9j7KNK/l5Y+aLY6Tba7ae03fdT3kW6zUr5ATjzdm4Bb+tXh3o7dpc1uqt5exm6R7XloH3WVeGSgtkmlJqiOnZ5wmI345VXrLeNU02p20d5nfbtLlxEk0D9zns+rVvMPHiabeU9X+R8jHyfqo5Pv1BSW68z0tHMHMbIRGc54zwqcUjpmtgq3tG3gk8LenU23dP6PRENTZqVj53tBbOY9rnEj7rRNpMU1yp6WvaBHN/Wyjks+yweRhnfiHZ9B6xbNi3ZRrbfLQnzY8vY74UBsqIGyMdhzBjBW22aat0QlFU4upRThzXEZOcfC8EGktOvraCmbUPbJWxmSMBncBWceL/WZyOtRW34y1nuYXAPP7wfB4UXMa4jzz6j+XHC2VHpKxQ1E9rkkc6qeMRvLOcnso0WndN0epqTTdXO+a4TROc0OZ2x35U/q3+kP+X36l/9k=', 'scrypt:32768:8:1$bUVaJxdZS6hwyai0$375e9b538bbb140a517263fe9c41b7ce018f476e707f4f141beeec6217e4b168cdd61a2770c7b27b98f4560c10a6619917a247d96993781c1f05dd6f4f6b0dcd', 'ACTIVO', '2026-06-03', '2026-06-03 00:07:47', '2026-06-03 21:27:59', NULL, 3, 'RESPONSABLE');

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
  MODIFY `id_aula` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `carrera`
--
ALTER TABLE `carrera`
  MODIFY `id_carrera` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `carrera_materia`
--
ALTER TABLE `carrera_materia`
  MODIFY `id_carrera_materia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ciclo`
--
ALTER TABLE `ciclo`
  MODIFY `id_ciclo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `id_modalidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `periodo_lectivo`
--
ALTER TABLE `periodo_lectivo`
  MODIFY `id_periodo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `id_tipo_ciclo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tipo_programa`
--
ALTER TABLE `tipo_programa`
  MODIFY `id_tipo_programa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
