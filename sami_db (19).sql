-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 08, 2026 at 05:09 AM
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
  `estado` enum('PRESENTE','AUSENTE','TARDE','JUSTIFICADA') NOT NULL,
  `tipo_registro` enum('AUTOMATICO','MANUAL') NOT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_horario` int(11) NOT NULL,
  `id_usuario_modificador` int(11) DEFAULT NULL,
  `ip_equipo_registro` varchar(50) DEFAULT NULL,
  `id_usuario_registrador` int(11) DEFAULT NULL,
  `justificacion_aprobada` enum('PENDIENTE','APROBADA','RECHAZADA') DEFAULT NULL
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
(1, 'AULA L301', 'L', 3, 'Aula comun', 50, 'ACTIVO', '2026-06-07 20:36:50'),
(2, 'INNOVA', 'F', 1, 'Aula/laboratorio', 25, 'ACTIVO', '2026-06-07 20:37:23'),
(3, 'C204', 'C', 2, 'Aula tradicional', 50, 'ACTIVO', '2026-06-07 20:38:01');

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
(1, 'IID', 'TECNICO EN INGENIERIA EN INFORMATICA INTELIGENTE', 'Carrera Dual (nueva)', 'ACTIVO', '2026-06-07 20:27:35', 1);

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

--
-- Dumping data for table `carrera_materia`
--

INSERT INTO `carrera_materia` (`id_carrera_materia`, `numero_correlativo`, `estado`, `id_carrera`, `id_materia`) VALUES
(1, 15, 'ACTIVO', 1, 1),
(2, 16, 'ACTIVO', 1, 2),
(3, 17, 'ACTIVO', 1, 3),
(4, 18, 'ACTIVO', 1, 4),
(5, 19, 'ACTIVO', 1, 5),
(7, 20, 'ACTIVO', 1, 6);

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
(1, 'CICLO 1 - DUAL 2026', 1, '2026-01-05', '2026-06-15', 'ACTIVO', '2026-06-07 20:26:45', 1, 1);

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

--
-- Dumping data for table `clase`
--

INSERT INTO `clase` (`id_clase`, `tipo_clase`, `estado`, `fecha_actualizacion`, `id_materia`, `id_docente`) VALUES
(1, 'TEORIA', 'ACTIVO', '2026-06-07 20:42:05', 2, 3),
(2, 'PRACTICA', 'ACTIVO', '2026-06-07 20:42:15', 2, 3),
(3, 'TEORIA', 'ACTIVO', '2026-06-07 20:42:21', 4, 3),
(4, 'PRACTICA', 'ACTIVO', '2026-06-07 20:42:26', 4, 3),
(5, 'TEORIA', 'ACTIVO', '2026-06-07 20:42:35', 1, 3),
(6, 'PRACTICA', 'ACTIVO', '2026-06-07 20:42:42', 1, 3),
(7, 'TEORIA', 'ACTIVO', '2026-06-07 20:42:48', 3, 3),
(8, 'PRACTICA', 'ACTIVO', '2026-06-07 20:42:54', 3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `clase_grupo`
--

CREATE TABLE `clase_grupo` (
  `id_clase_grupo` int(11) NOT NULL,
  `id_clase` int(11) NOT NULL,
  `id_grupo` int(11) NOT NULL,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clase_grupo`
--

INSERT INTO `clase_grupo` (`id_clase_grupo`, `id_clase`, `id_grupo`, `estado`) VALUES
(1, 1, 1, 'ACTIVO'),
(2, 2, 1, 'ACTIVO'),
(3, 3, 1, 'ACTIVO'),
(4, 4, 1, 'ACTIVO'),
(5, 5, 1, 'ACTIVO'),
(6, 6, 1, 'ACTIVO'),
(7, 7, 1, 'ACTIVO'),
(8, 8, 1, 'ACTIVO');

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

--
-- Dumping data for table `grupo`
--

INSERT INTO `grupo` (`id_grupo`, `nombre_grupo`, `descripcion`, `limite_estudiantes`, `estado`, `fecha_actualizacion`, `id_ciclo`, `id_carrera`) VALUES
(1, 'IID02-2026', 'Grupo dual 2026', 40, 'ACTIVO', '2026-06-07 20:43:46', 1, 1);

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

--
-- Dumping data for table `horario`
--

INSERT INTO `horario` (`id_horario`, `dia_semana`, `hora_inicio`, `hora_fin`, `minutos_anticipacion`, `minutos_tolerancia`, `fecha_inicio`, `fecha_fin`, `estado`, `fecha_actualizacion`, `id_modalidad`, `id_aula`, `id_clase`) VALUES
(1, 'LUNES', '07:50:00', '11:30:00', 10, 10, '2026-01-26', '2026-06-14', 'ACTIVO', '2026-06-07 20:49:01', 1, 2, 3),
(2, 'LUNES', '11:50:00', '14:50:00', 10, 10, '2026-01-26', '2026-06-14', 'ACTIVO', '2026-06-07 20:50:37', 1, 1, 7),
(3, 'MARTES', '07:50:00', '11:30:00', 10, 10, '2026-01-26', '2026-06-14', 'ACTIVO', '2026-06-07 20:51:28', 1, 2, 6),
(4, 'MIERCOLES', '08:00:00', '11:30:00', 10, 10, '2026-01-26', '2026-06-14', 'ACTIVO', '2026-06-07 20:52:45', 1, 1, 4),
(5, 'MIERCOLES', '14:00:00', '15:40:00', 10, 10, '2026-01-26', '2026-06-14', 'ACTIVO', '2026-06-07 20:54:06', 1, 2, 6),
(6, 'JUEVES', '09:50:00', '14:00:00', 10, 10, '2026-01-26', '2026-06-14', 'ACTIVO', '2026-06-07 20:55:02', 2, 2, 2),
(7, 'JUEVES', '14:00:00', '16:30:00', 10, 10, '2026-01-26', '2026-06-14', 'ACTIVO', '2026-06-07 20:55:58', 1, 2, 3);

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

--
-- Dumping data for table `inscripcion`
--

INSERT INTO `inscripcion` (`id_inscripcion`, `fecha_inscripcion`, `estado`, `observacion`, `fecha_actualizacion`, `id_usuario`, `id_grupo`, `id_usuario_registro`) VALUES
(1, '2026-01-06 20:59:00', 'ACTIVA', 'Inscripcion tardia', '2026-06-07 21:00:25', 4, 1, 1);

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
(1, 'DESARROLLO DE PROGRAMACION PARA LA INDUSTRIA 4.0', 24, 36, 3, 'Desarrollo avanzado de programacion', 'ACTIVA', '2026-06-07 20:29:26'),
(2, 'ADMINISTRACION DE LA ESCABILIDAD EN LA INFRAESTRUCTURA DE REDES', 24, 36, 3, 'Redes', 'ACTIVA', '2026-06-07 20:30:21'),
(3, 'USO DE HERRAMIENTAS DE SOFTWARE PARA ROBOTICA', 24, 36, 3, 'Robotica bro', 'ACTIVA', '2026-06-07 20:30:49'),
(4, 'APLICACION DE ESTRATEGIAS OFENSIVAS Y DEFENSIVAS DE SEGURIDAD', 24, 36, 3, 'Ciberseguridad', 'ACTIVA', '2026-06-07 20:31:26'),
(5, 'COMUNICACION ORAL Y ESCRITA', 16, 24, 2, 'LENGUAJE :V', 'ACTIVA', '2026-06-07 20:31:47'),
(6, 'INGLES BASICO 2', 30, 30, 3, 'Ingles B2', 'ACTIVA', '2026-06-07 20:32:11');

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
(1, 'PRESENCIAL', 'Clases 100% presenciales', 'ACTIVO', '2026-06-07 20:18:27'),
(2, 'VIRTUAL', 'Clases 100% virtuales', 'ACTIVO', '2026-06-07 20:18:51'),
(3, 'SEMIPRESENCIAL', 'Modalidad diseñada para recibir clases virtuales y practicas presenciales', 'ACTIVO', '2026-06-07 20:19:49');

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
(1, 'AÑO LECTIVO ORDINARIO 2026', 'Año lectivo normal', '2026', '2026-01-05', '2026-12-25', 'ACTIVO', '2026-06-07 20:24:54');

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
(1, 'ADMINISTRADOR', 'CONTROL TOTAL', 'ACTIVO', '2026-06-07 20:04:36'),
(2, 'DOCENTE', 'VISTAS ESCOGIDAS', 'ACTIVO', '2026-06-07 20:04:46'),
(3, 'ESTUDIANTE', 'MARCACION Y GENERACION DE REPORTES', 'ACTIVO', '2026-06-07 20:04:57');

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
(1, 'ORDINARIO', 'Ciclo normal o recurrente para recibir estudiantes', 'ACTIVO', '2026-06-07 20:21:07'),
(2, 'EXTRAORDINARIO', 'Ciclo diseñado para recibir estudiantes que han reprobado alguna materia en algun ciclo academico ordinario', 'ACTIVO', '2026-06-07 20:21:49');

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
(1, 'DUAL', 'El estudiante se presenta dos meses y medio en el instituto y luego procede a ir a una empresa a hacer practicas profesionales durante otros dos meses y medio', 'ACTIVO', '2026-06-07 20:15:52'),
(2, 'TECNICO', 'Carrera tradicional de dos años de estudio en ITCA FEPADE', 'ACTIVO', '2026-06-07 20:16:27'),
(3, 'INGENIERIA', 'Carrera tradicional de cinco años en ITCA FEPADE', 'ACTIVO', '2026-06-07 20:17:04');

-- --------------------------------------------------------

--
-- Table structure for table `token_activacion`
--

CREATE TABLE `token_activacion` (
  `id_token` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `token` varchar(100) NOT NULL,
  `fecha_expira` datetime NOT NULL,
  `usado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `estado` enum('ACTIVO','INACTIVO','GRADUADO','RETIRADO') NOT NULL DEFAULT 'INACTIVO',
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
(1, 'FABRICIO', 'DANIEL', 'VANEGAS', 'AVILES', '2006-05-03', 'MASCULINO', 'fabriciovanegas05@gmail.com', 'fabricio.vanegas25@itca.edu.sv', '73641707', '22334455', 'Av. Peralta Col. Don Bosco psj 6 casa 5', '074389230', '210225', NULL, 'data:image/jpeg;base64,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', 'scrypt:32768:8:1$2HMjFPNtujm3xBM1$f0d66d3883a9d1a05b76548bea6a39447dfbe007220de073f71e19390a2e5f553b46409e39606164a3554f736ea9975d140c417292fb4e944daaf0a798b7b2a7', 'ACTIVO', '2026-05-30', '2026-05-30 18:17:57', '2026-06-04 19:30:54', NULL, 1, 'PERSONAL');
INSERT INTO `usuario` (`id_usuario`, `primer_nombre`, `segundo_nombre`, `primer_apellido`, `segundo_apellido`, `fecha_nacimiento`, `sexo`, `correo_personal`, `correo_institucional`, `telefono_movil`, `telefono_fijo`, `direccion`, `dui`, `carnet`, `carnet_minoridad`, `foto_perfil`, `password_hash`, `estado`, `fecha_ingreso`, `fecha_creacion`, `fecha_actualizacion`, `ultima_conexion`, `id_rol`, `dui_tipo`) VALUES
(2, 'CARLOS', 'JOSUE', 'SANCHEZ', 'MENDES', '2006-01-04', 'MASCULINO', 'carlosmendes01@gmail.com', 'cjosue.sanchez25@itca.edu.sv', '78787878', '23232323', 'ITCA FEPADE', '123456999', '062825', NULL, 'data:image/jpeg;base64,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', 'scrypt:32768:8:1$J1Ord5IEgGOpTv1X$54fb298885b254e7ccb43100154475769ab60ddbe4081f20e9a84551325ab12707c5618c611f35b305a1847a0a031b4c383c166f58c1e0884fed211805e9f0f2', 'INACTIVO', '2026-06-07', '2026-06-07 20:13:38', '2026-06-07 20:13:38', NULL, 1, 'PERSONAL');
INSERT INTO `usuario` (`id_usuario`, `primer_nombre`, `segundo_nombre`, `primer_apellido`, `segundo_apellido`, `fecha_nacimiento`, `sexo`, `correo_personal`, `correo_institucional`, `telefono_movil`, `telefono_fijo`, `direccion`, `dui`, `carnet`, `carnet_minoridad`, `foto_perfil`, `password_hash`, `estado`, `fecha_ingreso`, `fecha_creacion`, `fecha_actualizacion`, `ultima_conexion`, `id_rol`, `dui_tipo`) VALUES
(3, 'JEFFERSON', 'JOSUE', 'GOMEZ', 'TOLENTINO', '2006-12-31', 'MASCULINO', 'correopersonal@gmail.com', 'jefferson.gomez25@itca.edu.sv', '67676767', '42231313', 'Prueba de direccion', '231232332', '160725', NULL, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAQDAwMDAgQDAwMEBAQFBgoGBgUFBgwICQcKDgwPDg4MDQ0PERYTDxAVEQ0NExoTFRcYGRkZDxIbHRsYHRYYGRj/2wBDAQQEBAYFBgsGBgsYEA0QGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBj/wAARCAGQAZADASIAAhEBAxEB/8QAHQAAAQQDAQEAAAAAAAAAAAAABgMEBQcBAggJAP/EAEkQAAEDAwMCBAQEAwUEBwgDAAECAwQABREGEiEHMRMiQVEIFGFxFTKBkSNCoRYXJLHwM1KC0SY0YnKyweEYJTdTc5Ki8UNUY//EABsBAAMBAQEBAQAAAAAAAAAAAAABAgMEBQYH/8QAJBEBAQEBAAMBAAICAwEBAAAAAAECEQMSITEEQRNRBSJhMnH/2gAMAwEAAhEDEQA/AOetTgGK3hI5oUA5Cfai/UfnjNg8YoWKAHK7I+GmmgQR9qcNtnINfYPAA4p/GYKkZwacid+SSHkRlPhA+tO20ZUeK0YbUhIp0kD9arvI8bz7+lm2yE8j0pZIATWGzlGCK2J2p5Tx71eNdcus2/WT+WkVAkgema3Kh2BNZShSu9X1M73htIGEYpp4YJ5qQllIaBNRTiyl1I3UrXd4o+lM4bzio8khQqXmpPywWCeRURznJGKi9dWeFHDljBGTTIhSTnFPiglrNMnFeYjNL63zZGAtWckU/i7nQUADJqNCj75p/AkFt8HAGKV6NXopssDwcyJHAAqPu1zfcW422shsnsDSrt5LjQZzgGoqYoBPkVmqzbxzWfWqHCWwCMU4bRkEHHNNmXd42kcj1pXdg8Gq+1NkO2EpQacBRJ7nFMGt2c5NOCotjcoY9Kfqy1TxSv4IGeabKUWiDkcGvvF3pGK+lJ8opeo509DodZCkjBHFNyTu/Wt4iT4WDWHEEq4qpBZwqlYKaylwBXJpskKBxk1sB5uadkTZD9pzjNOW3DmmKFpSkDFLg5TxU3/8ZXMSqXD4B5xWjC3C5gmmzKj4ZyaUaWfEHehNwmWlFKQVYNSDMhtprcAMmogOYSM0qp0BIxQXOphEtSkkgn9KIbKcRy4sgnHehBt5IjelEdpfAtyuPSn0/sLzH8yirccZr5EkEeUfvUe+8FqPvSjK0hrkcgUh1ORJKlHBxiplEzwGBkgZoatygpeKdypBKth4oV3/AMPQ8pb2/d61OwXwgBXahmOoEDJqZjL8gHeo+qzZn+hZBlZcCwo8UZ2iaHHEnPp61XkJYTj60UWiSUL7Vludev8AxfP9Wdb5ZU8jJ7UasKC4yVZ9Kq+2SwpxJ5qxrctK7aFZ9K5tPp/4vk7EgCO+aScWCK0JwkEHvWigcfSs5a69V5O6gaAiI5J4oWCCpyiy5trfhJT3xUF8kpKsnNdr4vW2seGpxYAFTDUXYAK0tzLm/t+tTDUfIyo058cfm8vDRKQkY4rBGPMO9Oi0ncQATWoaKs8gEUacmP8AvpMWGzKuclDK3Uo3Y7nFEGpuns2yQ0ymnN6CM+9V3bpck65iRfm/BbKxkg9qt+9XWRGkNRHpPzcLZyv24qM65Xpb/icz1VwQfE2q4NKOO+G1ntTq4GObktTCtyCeCKjZq8I2kit5p518fNIyVKUtWPT60yWtSyPcUq4k7uOabq3BVPrqxPibQ8iRbA2R5wKh3W8KI570tDc2ulJNZkD/ABOT2NC+t0oxEqJfPnPFT5CfkcAVAv4S4QT60L8d7eEBnFOo6sU1A5p023hGc1GmmjtC0lZB7elIOkhzhWRWoSo9j+tYc8vc5pxlMn0IbjnFOHgE+n7U2ibtu4HApZ0qUjv/AEqkahxDAW8hBHen9wZQkoGBUVbgtUvclXb3qaeadlR1LQCraPSq6iYtMUltGPatZDm4DHpSJVtIS4PN2xXzySkjJyaPYeth7GWRj2pwcEmmbSuBisuKWlwHkDNL2Kl3EkjKRSCXv4u0pzinzDbz6ShsjkUxLK2pSm1H+JTTD9CUqb3etbNrBOPak0gtMAuVu2B4ZWPWhNh0k7WyQazHWQ/mm3iHYayys785oRYllLV4qTningytAVwR61FF1RA+lOGn3AkJBwKETNPy8CdiBx61Lw5vhx/Dx3Hah2Oo+KfEOaetLy8CO1CuJ1oBR+9OT5EkVHwnR4+1Rp9JVsA5yD60Fw/t7m0kmsvOlcqmMR8gEn0rYSEqdzkAUHxMR3UpxUvGkICQcgc9qFDIGPzUs3O2qAJ4pZVn6LkXFSVjCuKKLRMKykkiqzTOSRlPf70TaenKW6AT/WsfJPrr8F9at22SBxk+tWdYny7ASOcAVTNtlHIq09LyU/h+N3Nc2svp/wCF5JZBV2ApFx3HrTV6Q5t7038RZOSanMd908uErOMOZ/WkHgOdgp28yd3Gay1EUtY4xXXMvh9+WRiE2spCRwTRJEt7ZYCnTjNMosTasAjP6VOBsKjbCMHFXnP915+/J7XiCmeE06UsDdj1qb0ppVN8klyW+llnPOaj27VJfleRkkKPBxR3ZNIPw4gmXa4JjRiM4DgHFTp6P8P+PrWu8N7l0W05cpKH7ZfWw+nk4GMfrmomfpO/2JC7eZaZMRQ5WDRawNHIdVGg3nEg8Ahw96EtRr1HYJQDr3zMRw4SrOa5/wC30Hl8XMAuQ0YrimE/ynv71FzHErJG4Zoxuelbu5aTdGBuQobjjuKAHQ624pLgIUDzmtcV4Pl8f/YmpWxWRmklLKlcivlOblHmtQoZrXvSk+cbtq2K9c05SVLUCBk0zJ5yKkbWtC5KUHnJ9aPg5UkUNiFhadpoVmqHzKsds0YSWiqUEKICTQ5d4aI8jKFBX2otaeP4jkDJFOSvDO31psgebPpThpHiKqb9ab+l1gojAgZpmVFTmDzTmRvQ1gGmSFHxAT71U/Ck+JuHgNDOBWC8nxcV8ytCY+T2xSBAccJTmqtY6P2FpbUrbjkUV6TeihZiygSXeADzQahpZbygEqBq3OkECyXq9IYuDYS83yMio7V54AL9al2y9Op2EpUrKcio0tLffwEk/WrK6wCNG1kqJECdiAKBIrrTZUvgjFHajZBpoNuhKqXebCm+FUxdeK5alA8ZpdDhPrVSdc3b07tQcTK2eKQK1uLambkFfmSed1JBxaPMgYNZEl14/wAVOR71UnDOHXmXGEgHJFapeAa2jtTYp2oCh6+lZxtb+9MUotwlPetoyyVEEYpskefFOmwEEHPehnYkCTgU6jLSRyKaJVkAU6R4aUAhXNBN1rCVccU7ZWNmaj1rCgM0qyspSKAlWH8PJPPepqQtK4aSk5NDTCwV96mIi0qRsUuhUhw25tYV9aSS+AkhQ5zTWS8plSkpPFR4lKUug+RMqfKR3/WtkPknORUOqTz3p3HWFEc1JzPxNsOnnmibT7ykyk4NB7KsEkVNWaYpMsJPvU6/20wuC1vjIJ5Iq09JSULj7apW1TOU5Iq0tHyRtOCM1hqR7/8Ax+vwdPPp37R6etIGSB2NMVyMqPNNlvYV3qHsV51oa3LJKu9O2WwlYwM1gBCBggjitUPjx0pFdUvX5/5sXggjMpASpQ4p6pDZKCgZyaYxpSfC8Mc5Hc0p8wBNYYSSE+qsdqNb5OMv43gt39Scu4SU2wsW+IC8OEke9AF0svUC7NLTPuK2EejZ4qbe1EbJqdSgVOoxlIx3NBmvNV6yussSYsZxlrOQEVz60+0/g/x5mRGI0xqm1uqkuKceKexGaJ7PreQ6z+HX8qygeQLoOg9QtTRFJZlMuLQOCFCjqUNN6usbbzSUx7iBk8cmsu/XT/Jz8Yg9RJ1tmuwHsvRF5CPoKgbzJS9MW+2AkLOcU1nwhDQGXwkuJ7H1pmt5TjABPatc14XlzOspBWa1UgoGTWiHdhrdbqVowDWkrCZa7uOKeW7iWlWcY5qPHJpylYaa3A4NPpeqTuc9S3wltZ4qGUt11eXFZrVcgqO44P1pLxCSSDU3v6vOC25KE7MetOo7ZKcp49ajt2V4Jp8zIWkYSBT6r1YlqI4Jpo0pG/zDtW0hwreOaQ9cj96qUSfEqFgtbU0o0rApiyojBzxUvaY4kytqhkZotZXCRhRnfA+aAw2ODmiDpvqFq26/SotbtxIOPtUfcHixY1RWW+U8EinHRuDFvHUttD+Nqd3f1ODU9bePw9Euqow1B1FdQjhbiQQP0FAt3t0ixzjGkpV+1HOopD1s65qaiRVuJBSkYH2oj6g6dRcbd82hjEhKcke1E0fl/jqO8bY/yMg08adSVYCcVHSyY8hSVDlJxg+lbsStxBPFbZ049eLlSRJzwadxkeIjCscc1HNuAq709YXse4J5qustThOQvD4RjgVsVqUQnbisSziSDjj3pdkhQBKePehPDc7kuflpUOZWnjFaTH0pzsHIpOOsrJKuKCsiTS8OxpVKyexpkkjdmnLSknjNDOz/AEcpSCrmlwsJGE801USlPFJ+IpBznmgj0OqSSTTmLKIdHP8AWoRUlRXjPHrSzLmHPzc59KFyiCW7v5FRqVfxeTWfFwgAkmkCvzcUGfJSlawBUtHYCEhX0qHiqSFgqJqU8clISDxUqn4eJeCc4FLWiYr8UAIwM1HoKvua+jvli5tqI2jNTr8Vlb9qWVFJzVn6Pf8AOU5qoLXK8jZSc8VZWjH1GalPvWF/Hr/8fpYKid5GaQdcIV3p4tsBwkDnFMX0HPI7VD359jzziXVh1O5ZwfrW/wAylyQC2QBUCGmlL2oVgGnLccoxh7AHfJrWafJb8PRXHcPA3g/Y08+bcchLDSBhPdVC7e9SUpYdIJ/m7iiW2uRI6WYTqipb60pUffJqNab/AMT+NZoN3iVGauEeY49kDG4GtJWv1S1fh1stqZCwdvCM0edW+nCja7XHsMZRceSFKUnkf65pHpRoQ6Z1KZl6S28WUkqSRWN+vo/HjkkBlqudjduQhagtRjuq7qUgjFSd80k1EbRddPO5Qj+VJou6z3zTkrwjare2HVp8y0ehFVRDu9xi+HHkPYjukDCj70M/Ni38MrlLenTQ44Ru9QKScQhCaJtVaVlWa2tXllO6O8Adw5Heg9LxLaCFhRX6Vc/HleTw3rVZHODzWzRIHmzSrNquLzhUiMsAepHFNVpfQpQdwCk4Iqu8RPFSil4Xwc1hTylJxTUL9zW4WO+aqWM7jlbhJUrFbKHh9qS3AqyCRWFKyOck1apGwcOew70+YcwjOKj0425pwXMNAJoK/GXXRvPFbNoKk7j2HtTYEb/enodG0JAH6U4i/wDjYAkgJ9KI9MISmYtxw+nFQLATjeogCnMG4qiIWop3Ae1Z7p+PPaOIkEyYU6TIICAkbc/egfT+o3NIa/amsq8gcwR7gmiqx63sjluct9xQpIX2NQV3sNnn3BtyNLI3LGMAH/zrPr0/F4nYOmNK2nVdrZ1g1HS5IWkdxnkVIwenF2uOppb1zbCYriMISrtUP0111YdBdOYkG4SkunZnae/aod/4gbhqfXQtViZ2tN5pzTXfinFD9WNGvaU12+wtH8JxWRjtQOUKbRuT2NWb1S1Q7qPU6osoJ+Yb4OaBnohDATxuHetsPI/kZ4aRSseZVPEOguDmkAtJjlGAFCkG1EOZrXFeXr9SzwCkbia1Q/hohPJrVpQWyQefvWzDG4lAwM1auGbiiMk85OaWjuoIwBj706etSmUFS1jnkUxUA3kn0oT69Ogsg5pdt/tzUSZG5e0UslSgAc0I9Us6+Ut5xSBfKk8U28YqTgnNalwJ7GhXqdbt361hKyh0HNMi8rdwaUSs5yoUC5TrckFoA+1aLcwcimzLiNoJrV17HaotHKk48hJVg5qQS8Eq4UeaGmHP4wyfWpVLg2A1HuqZqbRIGBzzXy3keKhRIzmoT5ghQGf60vvHhbiPNn1pXXWsx9+rUsExJYb96tbRzyE3Fv64qldGkS0JZUrY4PerQ01Jdj3RLSwRtOM1nfx6H8OfV3vHypWn2pm9kjgU5YcDltQc54BpFfFQ+iz9jy2ZdkoUN3B+tSrcGfNZz5to9RWlrYFwuKUO4AyO9XbY29OwbGY0httStv5+KfXiY8coA03AjrJbekJbS3yd1RmodZttXxpq3RspjLAK0+uD3qG1reYkO9yGrPJUkFRyE0LWa5LXO8NLReWs8j3rO2vR8Hi59dc2PqfE1BosQ0JQZ6GilvcRnNAFotuvVzLnInRHfDdKtrpOBg5qorZcbjB1YFQwplxs7ttXR/eTrbVOllWuzQgpbKdi1pQB2qY6Z0C6ntC7PZZC58nfIJ3JSTnFAUh2dcbS0plKgWjnIqZ1cvUQcCr0o7wcFPHf9KRhSmoVsIKQd5wBTFi2dI3iBq7paqxXV1IkMIwnceSR/wDqq6laWjwlrUzISpxtXCal7JZnHYirhBUpsqHOOK2kwkI2PLWrxArkZ71fXPvE6sXpvcNM3OxqtV3Qy1NIwndgHNVb1Q0y9p7ULhQghhw5SfQ0y1HIVadR2+4x1lrCtygDjPNG/VW7xtR6GttwbUkONtgK55OKOpuIpXJFZaXz5sUgnepsK96yODg96bn14pTpS0jsRXyVKUmlIEB643FqGzgFfvVpW3o+tuK3Klzm9iuSArOK0zU/4eRVQKiMJQo/YVnxONhBBHvXRWntG6QcWbcMPPK4Jx+Wn1y6C2eXIJiO4cIztBqmVxHNODwQMj3pVJIH5s1ZOq+jN90+y5IZQtxkAkYGarXwJkZ4tvMuJKTggpNErPXjOkqWWjngU8YSwIi/EXgn3pFA3s7AnzH0xUFNdk+KpvzDFZb+q8XjvTpT8eM44AkLPpU3o+5RfxHfcmSpAORQtb2HJE1CHUk5OM0WyLKu3todI8ihwQKiPSk5Ehe9Tl26IMZKlMp4De6rh6Or0iq7C9TnG4rpSQUr7k0KdG+litd6ndU6MMND+bipHqH01uGntQuLjLWy0z+VCFYziilq0n1L0/EGpXrzZFh5LhydtBpbeUyHnGlA4wQRTj+2S7Y2lFwB2j+VfOasXQ+pNMa1QLLIgtMuEYDgGM1tmvN/k46piQAl5WD3rDHn4PcVP6+sTemtXOQgSUZ8pofZwlwbAcH3rbNeVrx3p83gJIFapkOtr8vJpJ5wt4471hl0F0bhitOj1LOTpT7gSrdjtWsooQ2nzHJ75qQQhktgkCoie4gvYHpR0XJFP5gacJVhNNW1e57UqXWz2NLrP0OC5hPGRWniDd3pArBHBNYAI5o6fqcBYC8ntSyX0nAxTLd9DWUOISr60dHqmEqw3WqyVDINR65m0ZrdEhbieBWd+xcycIf2O8mpJEoFsc1AuElVLocKG+TzWfFTPxMeKCc0uiUpRGfQ1BtyVY7g/rT9lzIHNK/F+o4ttydZSxIYyFJI7Gross4TbYzKQMOYGfeqN0uhcuWGQjckd/WrqsLCGYYShe3bxiptdn8acq8LO74lgZXnkDBpdxYxQ3pe8MuW4Q9w3j61MuuEZGan8e/47OPMi2uLTfWmiraCoDijK/x5DVu3R5KtxT2zQVDUFXhtxQAAIxRdd53+EQQodqfHmeO8Advskm43sNyslJ7qNS71qi6dvbLkc7yCCR3pw1PU1hbZG4+1aPPoXKzJG9Shx64qLHZ4/JwY3iHapttj3W1uI+dcwlaR3H+sU2l66k9PLObdbm0mU+nzqPpnj/zqP6a22VcdZqiKSvw1flCu1QnWCwzbVrV1Mn8pV5eanjpzrpnaL9Lv2o994X5HVc55FPNT2CZadQtYJ+Td8zZxxQxYYcyW82mMgjBBBq+HnLTqHpqIMpSEXGIMBSvXFA0j9NPqYsmFkY21IQHbY++DLxyeBVfM3t2Ja3GlEbhkcH6UuLg4bM1J5Sc5B/Wn1h6nPUvTdxStF0jtkxEDIqvn73PmQERVKKmE8bQaudOp2rpp5mzzEhaFjBPcio1XT62NsmdFw42PMtP9aJS4q+FbLhOeS3DaKvcYyas/TnRWRfYJlvXJLKxypG3nH71pBkWyI84ITYQ8OCCKZS7peY0lb7MxxCVd0hWKsuIfUFhcseoPwu0rLjyThTgGKL+n7Wof7Qtwbmp16M5gEjOBVbXC93KJPMxhwqUrkk80S6N6vXaxTkqkMB5BPsMiql4Ln461j9N7ZZoKbrBUoqcG5X0qLkXdy2uqdQolQ4GaT0r1rtd/tSY8kBokY2qra6KhziXI6QQTkGn7Oe5R7nUdEVLke+Rgtk8ZV7VvbrDojWkVyTDYaSpPJAAoR1NYn34bhWypQIO3ig6zXa5aRLqGllsLB8pOKLRMCHV+irLaW3ZbIAKewFc/32cGLosIRxnFWTe9V3a5xltP5KVdjmhyNoCbfmVz1OJQ2jkk1ja2xjgXs87xHC2sAKV+X6Vc0jTC5XRdy7lwFxoA5+m6qZkwWrVeEstr37FYyKu2bfGrb8P7kNS8reSMA/epjf1iz+njiLF0JRfIElDcrB3K9zVEat6m37VeoTHekflUR96tDpBco2pOhk61uH+IznCc4znNUVeLfHhajfwoIWlZ9frVs9ZN7y4r51AlHcBT6y3ddj1BEuUdza2CMgH6ihWcuVKecdUSQO2KaxHn1PoZXlScjGauVhvHtOL76oPMXe0xbw0grWsAlWKrKKhxSkbcrJ749K6B0lpRrVXSNEYhJfCfKT6cUy0p0gmWp98zGfG352DGa0zXB5f4/wBUxKW20E7s8d6ZPzG0uhTQyas+4dMZ0zVbsFxHhBSvKk+mTRQ58NVyasKpbSwtYTuwOa0lYzwWqehPOzkhlocgZNQ9wStm5qZcOFZortWn7nYdSSoU1kpWjIGaHXY7l21guOkeYK9/rT6m+Gxn5RQihz6VHlX8Xbxmiq4wxDcTE3hRA55oTmgNzCU8Y9DSumX+MuCU/wA1ZLh70zQ+SO4rPjEKotTrBVTvPrWwWnuTTRS9yvWsFRA70dPPj/2e+In705aeARgAVEhXGSa2ElSeB2o60mD555zd3xX3irKO9My8VEEkU4bWCnk1F/TmD2IfMCo1KCQ0hKQDzUClzB8p7U5bXuXnnii/V6xyLV6YrdduqglsFA7k1csUJStQbIBPBArnzRd8lWxw/L9vXFWZZ9RuyJCdyyMnmpX4flFULU5s2rksLUUoUcZI4q3mJyJduTJZXuBGeKoq8wUzWBMQk7k8g55o06cX35uC5b3VZW32FTqPVx5PnHB7Dh+ZTg85qVuEhRhbFLx6VBMrUlzIBJ+lSyLfOuOCcoR7mjrjnSER0JbAX39DTxmQlM1Klo3cjFPo1rt9uR4k11KyB+Uc0v8AgkmRDFzYiLTHByFEVNb46ItNXZbOp2XoqQ1t7kGhjq/eDetWBBd3qBwT+1SSXLVbIKrmX/4oT+TPrVfXC4/iN0XcHkkBRJTmoru8f4nLBNbtUBQ8u8njNKTdQIJxCcPiLHn5oMQZ8t5XyyVEZ9KlY+lL0uMmSlCgo+lJdnS7u9SAS5k5yrBogmTWhpWM0jG4AZ/eo6Bpe+qBW60SkDPao65CbGyl1tQbScdqfEfBZop0XDW0O3HKisYx6dxVz3KHH0nfnYkhXke42ntzVK9O3I9muiNQSlpK0qG1PtU31U18NR36LKg7krQQFY9aJPqbOp+56YbcmonwCAlR3KA4qN1BAalRNjRCHEp5rD0yQvRTV0+dDagn/Z+9CrNzmXdpXgbvH7Yx/WrLiCeC25SkLbKm08E4qNIbTcQ63wAe2aKpLzkGIuLPZQXFetBUwFqQrBOO9KmsOxTN+1bP8NSOcg1c2gdSuXFv5Z8k7DjJrnjTEzzHKjwP3q2+nV/gGa5FUAhwHGarv+mesSr2VeLY5GMV4Nl0JOEn14rl/qQ5Lb1ir+KQ2tR2gHtTrqXqi42bV6FRJKkoIzgH6UKx7+3qR/Nwe2rTyCaXamY5EfcrjcWGEsr3fTmpy3a4lwNNG3AHzjk1ojTUq+zksQXCvnBNHM7p9b7RpdJkq3SCOeO1ZbtaKnUtuTIEk4yFAqzUxfr+xc7VHtzTp2t9wDTa4WVKCQw4QmocQBHfAK8k8Z9qUoloq6f6yc0neXWQ+pMd4AKTnjtiojVb5lalcfaWVJcOeP3qOctx3AJJJHORUrbNNXO5xVSlbglA4z3q+lq/BFoS0QLnFkRp20L2Hbmgm7M/heqHWANoQvjNWNpyyuwYpllzarsRQnrqPHRLEpo7nFcmnKyz3ro/phfGrRohh+Q5tQQO5q3LFqSFcm1zIakrWlOQAfXFc4dLEuam6fuQCfOgADFWzorR9ysMQvreUck+U81pFXMrFqF1v/UyZNloLTbJG3Prj/8AVXPY76gW9xh5QJTxg1WEoTIMhyWyjJX3AHfvQ+7qp4z0xFFTSlnBNad4yuZH3WCyMOT3bzbmRu287RXOmlmFr1VKmOjBR3yPvXZFtYtz9sTHmqDyVjndignVnSqCi2y59gbCFKSSUgU7WW8djmS6XRP9pVrWeCcc1DXdbal+InjPbFTjugtUXG9usNQXSpK+DtPNLXbpZrW3wfHdty1JAzwDRL1z/wCGgvfjBHb2pfxU+HTJ9iTEdU3LYcaWOCCKT8VWOeQKRXwnwXzn0rVT3JpmXjjg4pIvf9qp9i/xH3ikgkUip/B7CkkP4yO1JrWDz60ey54j5LoPI708aUVDAPNRkdCloJpdhxbKylaVHPqBQdxw6WtTagSeM08iyApQ5HNM0sKdySFfakklTC+QcJp9K5HWkH1NT3A5naewoygOrEwqQrjdVZWm4mO4l4EBKverEs0tt9KVJVnJo6mZW9bHUPWxCVkEbea00++mya/bKSA08r9KHbbLWpYaQvAqcaiJfHzAc/itHcCPpUadPirk2wWxcic2sNEpJ9atAaSaXbg+5LS0kDOwUla7XHhJTswK0vsp5mMoeIdm3tQqQHSjbLfeQJCi82lXPsasy46rtly6cottqYbYwMHgc1SEyWHZSipGRnua3t0yfLubUSJuSgqCcDsaLG2cnNxtilPhDr2W+5A7U1i2kXS4IjMIywk8qHbFSt3izmZIty2l+Mvscd6JtIaacgsuRZGUvuDjJqOOrGeRHC0WzTjYJcQtR/lHNFkeXHGljOS2kADtUGrQUxm5rmXWQVM5yEk9qc3h1qJpx1iOrc3jjFPie/WundcNXC6G2htOVZHap+bpqBeC5ESlHid8YqpdC7f7WlQHmBJzVs6YlLVrCT4qzjPH7USJs4ALzpabY5Hhjd4YPIzQleHUpfGDyBirL15d3Rd3W/E8vOBVRzXUvTVKUok5o18El/Ty33iQp1qJKeV8uFDgnjFHr+orLZYrZt4Qt1ScE+1Va44kkZAGKyt3eoJGePWp609U9dZsq5zS+youbucVFS0PDIkeVWO1F2nrlYIFlcckBKnwngH3oOvNx+fuC3EeVOTwBU3R+qR01n5pR28AUSWK7JjamCUeQlWCRx60KWaaIjatw5IpzanA7qRDyjhJUDVSosT3UV8z9QtJHPlHP7U2s+nkKcCicZHGKUvzsd29JcyDgetO7bcG23RhX5fSq6S+elWnLRBtqpMx5AcVxk96tHUej7G5oFdyDzS1kHgn6VzRC1cphlLSHSk+lSR6gXk2dcNyYvwecAmo3QHLvEima+gKA2k4GaE37alyWVJV5BTiTdhJmvArys1qw5iItZPr61Gf9kkIFofTbzJQ0pxI9TRdY58RuMIxbCCrjGK1tF+hNadTD8JO4jnIpFD0MpDqUpChVz9TpIXRSIsZSWVHCh2FVdf3fEeVnnntRddLwFbgnkgVX10m7n1K9atGf1cHw/3xab0uCThJPKa6XOp/AuZhL2qQB61xj0o1NHsOpy9IAxirUla0du993xHtiM8HNCtXjo5qfElxiXtgAPbihC/2OGmSmaxtPc8VWMDUV3iTsTJCvBP5eaIrdqOVcQ8w44duPL9afWXepaBfUN3AJlPFIScDJo1c1Qxb7aqRIcShgD+Y96qhi3IVKXcLw6GI7RKhuOM1UXU7qdJu8x212yQUxWvKCngGl7cUtq/ddLFp6c6bfFZcWSeQmmtp+KGHJfTGukBCmVeUkoHFcquSPG5dKlHvkmtU/l4Jx96Pc/WO0rxY+mmvLaJseTHYkO8kdiDVL626L3CxtKnWlxMqMPNlCs4FV1p5OqHlhq1KkqBPG0nirNsd16k2omJcY0iRFUMFKhnij2tLWIpqQFxpC2JAKHEnBBrTcAnIUKtvUWhndRhUqJCUzK7qTt71Xb+jtRN3YQEwXVKzjITVFMRDF7KeK2QVrwccUcRejutpLYUm3PAEf7tSqOjWqrckPTIy0J7kKFBazICYanAgDYSSPaiS129t5vfJwD35qcTp9Eb/AAzbO58cdvWo64WubEVtkIWyP1FDLUP4Ldp8YtSEAAnANRmrNPLgrRJio3x3PVNREl9xlYQle5I5zmi/T1+jzrebbPUFDsN1DLgFcUWG0gAlA/pRdpW6jCUFRrW+WNpCSmOjynsaFmPGtUsKSSE5pji+bPJBUHAeaMrfIRuGTjcMfeqn0zdEyIqQFebvR1FmFSW8HBScnNTpWb6qgVfFK1AiIyo49qV1HI221e7vgihixuJk6nSvOSBmpHVUtStzB7YxTad4E4UX5txTZP5jR3oe1w06sixEpClpWCqq/tniJkqIWUhPPerM6PtruWupEoJKg0D2+1F+t8/nRrqti2va/YLDCAWW8k4+1VFqXWEqP1BeEdYISshIHpVnTJQ/GLpLdABQkpBP2qmtOwWb3rV+RLUNocJ5+9Ljp8d+CubdL5PtPjvvlLZGcU2nOKd01tQoggc1pq24NQ5rcKKsFsDBA9qZzJrbtnQ00QCRzTTZymuiWFDUKl8DAPNHunXcamlq8Tt/yoM0ltTcHFA8hJNSNjuAGobhhRynOPrwKlP7UBry7leonWm/MQa0s3Ty63LSz1+cSUtJ5zUXKju3HXYbIKt7mT9q66iWKI50XNrjJSHPAycfY0VtiOJ5SAl9TXBUk4rRKy0Ck9/epC6RnIeoZkRecocPcfWmiglS8q71nJ9XymylKzuyRn3rCBleKVd2nISe1It58UGiwj5PASMUo3KVHfCkDkU2dUcA+n0pDeScZoTZ8Sb9wcfdClHmpK2ymgseIoA1ANI3pyFZIp0ylIIyo/bNOT4n1GpcjtIQrIye1TKYNwvTLUK2QFrcXxuAoas9vduM1kSDsj7hlR9BXc/Ry0dO06XQ7Bkx35bbYKkqwTnFIermC29C9RtRlzZaSFKGQkiq/vdsuGnrm5AmEhW7iu8Z01idfFx4iANvBGeKp3rR0+hybM5eGwkOtp3EpPNPia59ceVHiNLBycegrHz21sAKPPfNQy5x2Fkn8hxjNJPPKSkY5qpOMtH1zkbWwpByT6ULTFb18nmpqa4FwBnvUA4CSCBnFOlkvbXQxMDhHFGCZLwiofiLKcHJwaCEpKjhNTdnuJiSEx3zlJ45pS9VqdHcW/S7gywy8o/wu5z9qLLdqRuFc2pC28R0dyD3oDkJhIjiQ1ICSRkgVCXPVTiIRgs4UDxuo6nOBh1O6nqv0oW+0uFqMAAoJPfiqjdUQ6QSTn3oj0Yza5V3U1clBPiHgn3NHF/6TOqgIuVt/ioc5SBzSaevFRkFKcipC12ifd3fDhMqcUOSBT+76UudndQJjRSgjuRirT6Krs0ByS9PCDhJxu+9CbEXpLUitHOpTNhJStHcKFXJZ+tdklob8eC1uTgEkVRuv9SQ3r86llgbNxGQAOKjdO278YQlEVwpUo4wO9P8HHZ1h1bpS7YdEdhBXxnIoogI0SZwccjR1LHO4jJNcbajk3LRNoZYS+5vUAQacaBvertT6mYYVIdREGCteT2+9OUp+uyb3NRKb/8AdbbTbDac7tveqU1Fe9S6lkSLPaWA44g4Cgk071RrV3TbTcSGv5hpKAHNpz6c086eau0+uUZxAafVyoLp9TyX4GrB0zvyUIuFzbKH0qyUmsdQNJrk2sLbZG9I5A9atbUGu7QLY4uNOaU8RgJTVeyr3clW75tEVUkKOcd+KOp9HOF2tcuKtXixlJA4zUKh1yLJRIBKNpq+79fy5GzI06vbjOQgd6AyjSd7C48o/IPg8BQIzU3X0v8AFT6zXGJfLCppwpDwTjNB1wtrvzDjBGTk4NFqen70BlE+3XNtbXqArGRW8uyTJCm1shO/GCc96qf+l/ioT07IdgT0tLXjB9TVnQbm2tI/iZOKDrnovUEJImiGohX8wFYscl6LILExDiVdvMMUXlRrAT0SlIvylODOBSGp31uXp1tPYGnWkWyLk859D3plckhy7vuEZ5NNlb9Q7ja22FOJOOKuPoOfwy13G6Ot78hX+VU9KViKU4PJq8dDR37X0gdktNnc5nnFDpzr/qh9V3RDtonvNNhtTijj60J9LtPuOzXZU7yt981K6pddl2ZEZtOHVLrQfM2XSKUE+G64n070N8b5EZr2wOru3jW9regdyOaFFtyWmkodBT6HNOl3y6tpWhb5WD/vZqElTHXnfEePHtR1M8naJtNPpZefXnsk9/tTWyXNDWpZi3Bwok4pCwOtfLvuKPJHrUhpPROpNSahUq2QHHW1LwSEnFS1yn9C2j8W1RKuaWQtDRyKt3RF7nTL09atqihaSjHtRpoPoVe7Rp9TrjRYW8BuGOaPtIdH4unZhuVykoCic88UqftyuIesGmZWn9ZSH1MkNvK3BWMVWwDjjgQ2hS1emBXpN1K6e9PdWWUR5c5j5hAwDuGc1VVm6NaNsT5LiW5Y9D3xRGvv8cxaZ0Bcr0yp8R1du2Kln+msmM2ouRnEn7V1xZNOWWJLWI7KGmvQYogXYNPyIiky2Ec9jinxjfL9efl103It55SSD9O1QRirS+U7SPvXYvUHpDEmxXpNoUCcEgA1zvK0ZdLdLdTOjqAQc5I7ip4JvoRt9mlzHtiGlBJONwFWfZuliVW0zJS8BA3HP2p9orVFiTst0q3hS0HBPrmijWrF4n6dLljKmWCPyj2pVcvQ7Bg2y4WZ62RZLbLiTsCuMnmt7TpnVmhnPxeHeHExFnJAJwaB9L6fuS9XtNzHXWm94Kz29a6hesmmJmlWbbKnbkhH+8O9I1ayeqeq4dsVItMcvOHhTm3OaQ0nrbUusXJduvXibHAUhJGOaIrtpe1WizOLtUtO1IztJyTVXwOoos2oAwuOkALwV4xWknxnuBfU+m52n7+/47ag2pRKD9KjWlNrPnIq9dWC1ar05HuCVpDhTnAPNU7dtPfKyg4gqwDnFDL1M5kMribsbU44ofA2v7DjHvRLPffdt6YzDeT2+tQbUB35otu8L9qL+DnCIQRICUCsykKS+MntyKeNwFtSCcHimE5ZMtSSc49Kyt4vE9iLk2QkbS4Sn2Jpip1RUcknPrXz693Azmk0nnCh+9XPromJIVakLacQ4hSgsHgj0q7ul3VBcKWxbL46HGCQBv5qjxtCxgkVJ2Zptb6vFeO4cpV7U+Hcx2zqjQun9aaP/Eoi21FKNydvvXMcaBOsWtlWshW1S9vHanuier150jK+QkPGREzjCj6VY1u1ZoLU94ROlqQzIJ3HJ7Gky1gI6+0MqDZW56k5LoyAKNeh/T9lEAXaYhSccgGiXUly0bKtzXi3BC0IHCN3HaopnrLpexWIwGEpO0YATSuuM+JbW+i4uqLmpLgDbLI5UfpQ/pfUWk7HeDpSK4gOr8heSec9qq/XnWm53rfFtW6O0vykg8kU26TaabvOp2rpcJ/KVBXmPJNLqriSOioHTt9u6lc1an4bp3hSj6GgrqXIt+kHlrtZQnGfKmrdvd4ETRS0xXf9m3gGuN9ZXi6Tr8+mW6pxsk8Hmj2TM8ZV1AlYWpLilKJ4Bok071zutqdQ1JbQ4z22qSKpuQopeJQNvNbKcCkpCgQpP9aj2bZxOO2tEaysuu7aptTEcvgf7MpFIai0toO4KMK4tJgzOQhYO3nHFcp6K1ZM0tqJq4NvLQkEEpzV9611XZ9caCZukBwInsgKXtPOeKqaa/44Dde6V1Zou2KlwJ70i3fmSoE4AqvLb1IvcWUh5yQpSUHsfWr30zqiJqnpjOsFyV4j7bG1IUefQVy/d4nyF9kR+QELOAfvVy9H+OV0XpTro5dnWoVzYZUynjzJFWom3aG1bbt8YMsSiONpA5rhyNMkMkKYUUY9jVg6P13OtExp59SlIT6ZqnP5PFEvpxtLa31AY4NQk51Ilu8jJNT9oaLbEhQVg4PehiYyoyFqx3PeqryZO3iPkFTkhtkfzrxxXSMKK7b+lEFgkJC292D965ygJ8fU8NgJyfEGQPvXQerV3A6dtsRgFDbcfnj6mnHTnN+KX1Xf5CNQoiMEYQrJwKkbvLXcLSwtT43BPYUCalnrF/dSlBLmeT61tAkTkAKkJX4eOAad+urebMpR+IVjdg47596YsWVy4StuShHuaIofgyouF8VpcpTUKO2zDwHFHGan1ceNcpOBaolqkJXLdSpod0j1q0NPfES3oxpqBp2xtKKeCvwkqJP3oEe0jcp9kjPoQsB4AqUfaiuzaBsljtarjMIdUlO7H1o9a655IvfSHxMSri8hvUREdLuAlJAGOKEeuWveojklI04l523ujclxs9h+lc13+4y3778xGSpLKF+TaO1dAaL1vcInTovXGGmW2hACQ4gE/wBaXrVTTnu6ax1y1KKp0ua0v6rIo+6adStRiePxJbj8ZHcqyalbtqDSGpXVqv0BqJz/ACgINRzkvSlttC2LHsKV87s5petVvU9XU2nJ9q1LbRKiqCFgdh705nBC2VQwVJV2Cs1zdonUtysjaZDMj+CV525q5069tsyyNqJbEpXANOuS/G1zN0iRwxFcK1Hue9QbluYurK4lzZQHVA+bFS0m+iDHRLlNhTShkr9BSsU229xTMhykE++cYpKxtR17gae0HfyqVGBS6oHdijayax0TcbQ407NbTgcJNM9dWa1aidXEeeb8VAxkmudNT6fnaZmqUzJ/hE5G1VTp15+rJ1Dqe2sXd5FsCTyQFJoUVq2/KSo+I6cHgA1X6Ly828HHMqPrmnzOrPBkE+GCKlrPHRvGv+oro2pnxlgAYIUajjpCfPWuU8COck/WhxnVMg3IONq2AnsBXQOkJ9rkdP3pUkJW6GyTTlTrFgEsMhiI43CnSyEJ4wSaLLtdNGOQ0RG3UKfI5VQG5dLDdr0WUJKHNxBIOKVm6NckXdtq3eI+4vkbT2q2Fzy9O5Me3okgQ3Uq5zTV2C0q7JcDY3VP2LpvqKRdCx8q4gt91KzzRUen9wjW9yVKRtKeAdtBKymxFBYbZaKnF9gKFbvpy4okIUGj4qzyBV/M6IdYtAmqWnx1fl47U4g9NnpUUTpjwS4exUKXqvHxznN0zPjxWlljzkc0ykWaa2ylamiVe1deRujb1wiJkpdTgDuec0zc6CTJkkrbeCvoO1NrrXHI70OU2pJWwoDHcCsrivsIDjeU5/rXXv8A7Nl0XFUpZBPdI2mhK9dBdRW7PzMBa2h2ITQmac5MIc35eTuz6msuoUy+FMqUlX0OKsXVHTm9WhKXUW18IJ4yDQTdLZcoDaFyITiM+pFZ6X3pNx6cppBclO7T6E1qxFcdXuUCpIPcmtUu72gFudvQ1N6dgS7/AHWNa4DRIcXtUoDtU86zv6YjT0+4vBNthLeVnHlBo+0h0+18zOaLMN5pBI5I9K6v6Z9PdJ6H0kiVdG2X5akBRCsEjiiRvXmlWZW35ZltKTjgCqzKV+gBvTklvRqId0WoPKTzmqL6oaBXBS3cYvDfdZArt1yLpbVdqEyFKaaVtz5ldqDb90yh3i0v2x6W26h0EApIPpU2UuOEoWioMkKekzUdsgfWmMzSWVERiFqHIx61cXUHoJqnSrT0y3KdlRk8hKBzVPtXC4W5R8crQ8DgoWORU+vSu70OS7fLZ3IfjnA4zRBoWU43PXBUpRbdTjYo8UrIuRlRVFxKVE/SoSHcFW69JlIR+X6UWcaTY00wmXbepCozaiEuqKduahOqVjet+qnJCmylDg3DAqRsF9bc1Wm8v7U7DuxijK6aj07q6UI0xkbvyhRomq0zVDoaUGQoKz96kmXwI5SaJ9Y6JkackIltILkFzlJHOKFFtEHekBTfvntWsto3Or/n2aNES4I2SCD2oAuTZS+pCECrpdXb7e1ukoSr055oQ1AbF8i7Ib8NLhBwBWleLiS1XOiIrkvqGw0lO5QWCB+tXvrpi42+0+M8djYawM/aq06K21Vx6lOPpSCW9xFG/V26XNbD0d5CtqRgAfanHX6/VBwHrbJ1ypdx2+EVnk/ei3UsaAkJVbiks+mKH7NoWfd5SpbzaktjzZp9cIrsMmK2VbUcc1XWvm1PXiMS660Tzj0IFT2kLInUmro8Z5e1oHJUaGnCpKj3UT6UZaUsN8Fmeu8Nl5Hh9lgH/XpRK4OfercuzzMO+R9Kwti20DBV7D/QoquNis7WjxBWtBeWOSe9UM27dIz0e8/MKclbvMCSfWizVN5mt2mDOQ+ouqQCUZ+tPrXMtWHo/pXpp5wG6NoU2PMe1Q/VK+6f07ANosoShoEJIBHNBUTqHqGMxlKHAkjBOeKCNTyJl0nGZKUSSrJBPFJvmWIS4upvVwUg+RI7elPYUMW+H/FZUtonG7Hao9hth/UEVgLwFqAODV49RbPadNdJ4pZaSXXEZyRz2pVdir40h92OpuK6UoTzgGvmL/LiFG55ZKVehoYsz91ebX8pGcWk5yU08XAuaSl4sq3JO4ikx1n71fOl7y/eIDduvAPhvABO72oH16NTdOrqVRHnRBc5HOQM1I6Husm+yI8ZDakOsYA4q0etNthyukzS5xQJCEADPejkaYy5Muurb3IX80mSsFXcg1FyJ868Mf4yQVhPuay82EwltgeVJIH9ai4r4QstrIxWWnZ48wymJ8OQUjsKZgHdnin9w2mQop5FMfWp66c3hdgkOZAzirX0FOfc0/MbUr+EGzVUtAjkHvVnaOyjRM5xH5thpyps6faM0tGlok3RWFKDhxn710FoSwRYFu/GZPhpexhKV44FcgxNW3e0rUmI+Qjccp/WpB7qZqp+MGPxB1DfsFEVXsw34rXclvvERdwCA8wFLPJBHapbULMV+1pjMtJWFDOUjNcDWnXuoY9wDn4i6cHOCqug9BdWpz8QokkOqbTnnmn2Mv8AHergtukJchxBkNqDQOUpxRVK0m07HabSAgIxlArnZr4l7k1q78OUylLYWE1Zdy6tvp08u5NDcoI3cfaqlVMcWZIgqjWoIbcDTaR74oLn6vesIKvGSGweVlVVIx1ouuotPTl7y2Wc4A/WqJv/AFO1Fe1PQnpCwjcRwakrjrtmz9XLPPnNNu3hoYIBSDU9rPqVAiWZLo8N1kJ/N715yWqXd2rmh6O89kKyfMauDVusJh6Vstu7vGKSCSeT2o6U8VWjqzrnZJ9tbht25pa0kjIFURrbWDtxkJSYCQyfYUCWe9OKnAP+fcc8/ejV5yLNbbZLYKlYA4qbOq1m5D9q01c9S3dMeDGUEkgEgfWulun3TZrRNv8AxCS2lx0J3cjJBpfQemYOmtHfiUp1pt5xJ2579q+tWsXfHmxJ0pLrTvCFH0okie/A/q7XV0aMh5MktpScJTu9KrdGvLmqenc5vQo8mp/XltTKnn5WRubVyoJNVfcbfNtwJA/hpOQferKUf6k6l6ittsajW+W5GbcH5kkj0rXRfXvUlnnNMXGY7KQVYypRNNtJWOD1GtvyMuQiI+2MJWvgUSQekentG3BM683FmalHmDaDnP8ASlxpMrylamv120Qi/RTvjlPmaWOK5t18m1Xl92ZFbDMtJJWke9WTq/qR83oM23TTXybDCSCkDvxQx0k07bupMebAedCLjhWCTyTRxNxFHuOOM5SSaUbW0tBCgOfpRL1A0RedFapfhXCKtLaTgLI4PNCu1J57Glc9TZ8LtsnduQSAD2FSXhqKEvxUlKkc8VHtyg0NpAqWt0lOdpxg0piRWBppq/Iv9qOn7qpKyryoUv0qF1V0m1Fp4fMtRFvQXPOlaU8YNQbxet1wRMiqKSDniupdA9R4ty6atxLrFbllA2YWkHAqr8/F60pa8amdnuKZYQo57UIus3B5ajIKx3ITROqVFanborAKPT1qHuF8Ju3hFpIKhireN4ZeLW+HnTj65UyYkBDmD5lcVG9ZXZVredckuocwrjBzVi9LrUhrpnImpnpjurSMc47g1SHVhMlMQh+T8yVKxu96Ud2J/dP+n2qo9yimI4hKcDBIFNNWKtrk1xmIBnJBIFQOj4T9qsDk0tErWOAPWtHbkwl1ZktKS6eTn3qtJ8s6f6L0TJ1FqdmMhJUgrAJ9ua7rseh9JaN6WKYu7bA3tjJIGc4rmLoVdrWiVIfeKd6VZTk0Ua/1bfNQLfhNOrTESSBg0nLIgNWQtNRGpEqz4W0XM8YwBmqr1NrK2MsBhsbnEpwM84qduzEuPpB9lBVk98nNU7Htj1zuxQ6DhKuSR+tLldvikv6eOawurkfZuQlGfb0ptK1NLkJ8NRBB9q1vNuREkJYaUTxitE2Z5uMiVg7QQe1PldOpIJtLaelyp0W4OBWAoKFX1q+G3qPS0OE4SQhISR7cUHaMvtotenWDOYVngVY0mdb5NkVLgRytK05AHoafqy7DHTOkLbZdMPNtwm3HFo4WQDzihqw6ekK1gtN1jH5VayAMcUF3nqnqDTd2XBeQrwM8JPtmirSHVJF83l6PtcQe/FToXPZ1bdt0bZNP3H8QiIShIwTzVHdZ+oz9zvn4JGUQygYwO1WTcNSyZMF1QWUo21zTqX/EapeeKtygrvUxWMo+Y241biSBlXpQs5kLPvRncW1CA2ojAI9aEpYSl4kAd6jTfMNSrcDk80kRilwBnPpSLnBqW8bIcARijfRF9bjpctT5AD4Kear8nnitmpKmXUugkLTyCKGsz36m77apFvujmOW1EkKHaoreFj7UUs3+Nc7YmLLSAtIwFmoKZaH2XCtkhaO/FIepqw4lLmO1WFoe9Bma42knlOKr8BKG/wCKnBqY0nI8K8YHY1UTcF7g+pWsFOA4V4mauq23ZD2hXm3CSoNetUXc3Ep1OpeD3qx9PyvmdNSUg4wiq65tzlfaRntptt1YOBnt/X/nQzabM29LdlOcjcTildPvuJXcGk5G4/8AOntrd8MKjqBznvTR1KMwIbCvEbSKkryxEvOnGogfTuTnIzQ1cJ6WcstBSiajI0iQ29y6Rn+lA6bPWFMCWktuZwe9T1uWlM5hO5Kl57UwlhYG9R3VDIuTkO8NPA8IUCaC1ertv8/UM2JHhNB1toAYx27VGLs98t1rMsuqWgDJ5OatnS9ysWqOnqVMpb+cQgpHqc44qutQ/jNot0luSsFokgA+1Dn1VcSdV3BqeVcqGcEEk08nXePcLOFvBKVD+tC7viPzVllorUo54GaSeMtkFDzKkoHNUefsPYV3kszh8g6tjB/Mg4orVeHVW8PP3NbzvqFHNDmm2oUialL6wEr4z7UVai6fyIliN1trpfZxkhHpRxXrb+C7p3BtuowYc+c00l7gg4GKtXS/SuB071pGvFmuW5tS9yyFZGP3rj5m5T4j/iQHnGVI7gGrN031D1C1AQJUlbwSOE5zT4f2L5+LG86au2l4aYjTQm+H53AACTiuNEoCW/c1ft9TN6g6SMkMrQ60nsfpVHSYy4spcdYw4k4IpH7dMS2VDcqnMdSkOJIUe/vWigrO3GK0G9LgCeTQm6EywJcIAd8UR9OLuIdxdt0lZAV+UZ4oKt1wKHw27wDT6UDFnNTojgGCCSKEav8ApIS7gYyMtAY9CKhYSlXLVzCFfzKGTmp+1aVmXVaxJkBCEpJ5NRFuhotuuEN+MF7Fjkfeqc/i8a+Z+o7dp3SybOl8h1aQAkK+lVpq6U1LtcSPt3OOFJ5PP5qzq2M5NvjT6HSQlJ4zQ9b5b121iiM4kKSxx+1Dq9fievl0TZrNGZjAbgkZTQLKnyJ0tbzyEpKj2oyvxiLeKXwN44AoZRCDrnlx3p29Y2W1IaYvErTzinmVHYo5UBRL/eFLuVwbhI8gUeTQhKZMaGRxyMU2gNLTFXNwAocA0lTx8+rfuE6M7ZyyCFnblRFNLPpJpvT8i8OsbEqyUkigvTH4jKWXFO70BWcGrR1Nq1sdOmbayyhtSUbVYHr/AKNVJTnxR11ZYVdtxOeeKnEtg2YNBI71Bz2VF1D2So5yKJYCFKjN7k+lPlVaNNLs2WVZGoc5pJcPAopu8p/SdpaQ1HC46uQB7UCWVQZujawPyc4o7m3hF48GEvw1EYwlVKy8Zz7Qv1B0axrDQCdSW5kIeZSSsY9v9Gqk0M4Yb7zSiArfg101q+5N6V6VyELjpQl1vAGO9cnWe4lV6dWBgLcJAH3rntrszO5XyualenVArGcVUymEu3KQtQzyTmjGRJU3pULKvQUCw5RkSlISr8ysUvpU7f8AAnWpTScZRVfzk7ZKk+1WVLtPyNtU4lYysZNV3ObKJSyrnJqe/VYMU+opN5AHIFbZAzmvnFp8Lvmm6MmSxSR/NSjnIxWmCQB2+tDfP4zuKcBORUjGur7SQhStwqPSkA81gpO6lZ1XwRf4S5M+GnCV1iHGdtc8OrHl9DUG1vSQUrKTmjOwoeusQRJDWAeAsj+tOfGeg9OfL9xU6P3o90O+lVpltqVyUkd6Cr3a1Wq4FBUFJP1qQ0tMLTjrW/AKafax1OnsEuR58lbauCqlI81aX1KPrmmTclLDr+9WCSf1pNiWjYolVOMfVJCaguncnKs8Vhlt1c4qXkJ9qioj+6dwCoZopb2NQi+9gE8JoLjSWQ4hKE4wPWhy4MDxMITkmiSJsfSUqPftTe5Wwts+Ig59afU9L6M1hM0nPRla/CJAIzxV2vvWzX9kQuNJQlZ/MnPeua5SCsDcASKVtGo7jZJBchyXEj1Tk0dRcddHN6EtNlsa3kobcfCc+9B7FjVeY8ltyIkEdjipLp7qt/U0NSJqitSe+TRgqREioX4LSdw5VijqJnimrlpZdosbzoG1xOSCPSpvpVq1+4RJWnrgrxkOcJ3HNZ6kXdSbP4TYCd/egnpRvb6nQUFXkcWM5+9P2dGJERqSK5Z9VymlIKU7jwPualLBfER1pC0Ap9Qaubq3oGA3cUykNjc4jOQKoibp+dEknYNo3eU1U+luLl0vrJqLcEMLIRHdISQKCeo0KHF1Z8zDV5HfMaxpayyrlGEfCi8nnjvU/e9OOTrOGVpUZLXfPfFXI578VotG0bh61hDeV5VxTh+M5He8J3Pl45pNGBkHj2qaXY2VE8RvxEHkU9hPJdhLiucqxgGkG1qSk+ordtrdKQsJxmo/o2yr3ctitr6kEgjik7G74t03ulSnFH8xqNUs49vvT+ythEsOKPrkVoXj/BfeHXYrL8hTmRg7efvWOktnVdrhPuTmSWyo5/SoTVc10W5KO27+ooz6eTIdi6eS3w8kOupJ+vYUNrPgK1NKK9SOpCvIgkcGmkGQ544CTkGo+4TPmrk656KUTn9a+jTG4+VLWBjtRxjmJW6SHFrEdOMqwOaIpWnJkTSrK0oKgsAnbQSuZ80fHyBg8Gr/AOn02JftHpiPth1aBgetDTV5FfWJiRFtyljgJ7571peJhehJCSSPXNG+qNMu2OE/JKtiHOyaA1xnW7bvdCgFcjNa5055pCXBJHgpR7VPNqcbgt7cZxUdMabUljkZonlWdA0yiW26CoADAotX3qOj3NyM4PE/KTgkUZ6WjQLrforiJJDgIO0HvVcpz4J3qBxT3TV1Va70JYOC3kj2qbfiZO34PfiT1Yy3p+FYIriVLAG7Fc0W51xh7xB3zRB1B1C9qDU7kl1ZUATjBqEgozhSh61y6/XoYnMrHkzFjRiXHVYCh70F2qUiPNS6VEjOcUU3NAk6VjthWABzQ83am/D3JWDgelJKfkTZFwtbim1EpSKAphWVYc4IPej6xRnk2d7KDtweTQPdyBNWn6mpt4cRKyNx54pFXAx6ZpVTalHaAc5pwmA8laFKaVgmlK3zfhxB03OuKdzCeDz2rEyxSYIIW2SRRbDmPWyAhaFJGfQ0+/EVT0oQYfiKWceWqg/ycVqYq1+UNqC/YCtVxXQf9isfcVaTVnZ/HWVqhnZgFeR2pzrWVp5iOG4sZKF45x70znk6rKLaiUB97hIPapdy/BmMGIidm3+YVELnFSinkIzSElxo48LIPrQctp3NmquOC4olQ75pKI6YzhKO9JM7ceZQBrcrQF5bINJP4+ddU85nJyaftMH5b9KatNl10eXFTLTY8Pak545qmetGVtBaeKl44PGacKuLsiWGFLGwdqh31uNPrSleeSMVJ262LdimUe45xVf0Wp8TSQErQULOKkkykrjllzk/WoiG4FghXChTphtLskBasCk52H7ahSN3BJ5odlQC0+CBjmiW8JeitpVHJUMelDUqW875eSr2FDSD/pvdEWx507gM8YNWGm5B6PLkAg5TkVQNtuD8RwkZ5qwbPc1rsEhwqJJT2/196EeT9MdY3BUi3NhSdxC+36VBaPkuRtcwXGjtw4P86zc7ml1aWiM81ExZwhXhqa2QC2oHH60Ly7S1RHRdbfAXJTu3NjnFCmvdKafZ0U09D/60nBPFT+i7wdc6NipjbS8yACBya11U00iK5CkRlBWME1pEb0qvp1JEHWkZcgIDClhKvpV79SOnUWLZWtR205aeTlWOaoVuCWZmI+4KQrcP3rqfp9eGdXdOxYp6kqcbSU4V3HAq5HNrTjrVtnbcBfitqyD5uKCFABRKh24I+tdT6o0KmJqB6Hswy4TjIqitX6YXYb6tJZPgqJOccUrEe30HtuEc7Tj2p03L7ZSBTxFvUteUI8hGc4rc2kgb1NnH2qFS0ISnssgJGDmpqyocMhsfaoRbXirSlIIOaNNNxErdSVkApFW28X4HtYSiuc3GIPFSsF9LOlS1vIyO1QmotszVxYYG5QURil5LcqNGSy9hIxUWttz4jF/lOO+c5pB1px0IAPfvS6lIGWxjP0NOIoGQhXJz96JpjiVuuM1GgBKj3FWb0Qv7cW8Ltjqt3icpz/r61W9yYWqMFFOB6Cs6JuTlj1kzMWSEp4yf0p+zbWexfnUrUkNy6x7W+eUuAED71FXmDGuESG3FG1JR6e9B2t7l+KXpq6tJJSVA0Z6IuUe43CGzLQQgEc5q5qOTyYsCN3tfyc9plRA+4pO63R1qAIAUTn2FdI6p0doqRBYnPTG214GRn6VW+rLVpKJYXJkNaHHQMAgVVqMy/wBqabTtJb8UqUrsPWjCJo52LoyVe56vDAT5d3HcVJdP+n7uqr+zJStPhhW7aT6VMdfr9GsNlb0vCwF7cLx9Bis9V1ePDmS4qH4i7tO4FRxW8dbwUMDjNKRW0uBW/aVDnn0pZ5C2UJcQRjPNc/e3rq9fnBYue2bKhk/mCeMVrb7bLkW9UlCSR3prbAzNjh0JyQPWiqySViM5HACU4PBpsz+xuR3dJvslIS4kEZqqbnHQZiiVDINF34z+HuymVZwo0Dzn1OSFKB8qj2pcKU0ebCV5QrBqSi3RXghp1AJHZRFRqtuMq7CpmyWldwc8VzCW0+pokbS8jSe8+9GSQcJFEOlvmlPNLbRu5A7ZxUPeflYrfyzCgo1I6Vv7VqcS26jNNlb0Y6xvzFmtiGGUp+YWOVetU/OmyJkkuvOFX0o1vgVqO4gxSFLV/LntRCjp/AtFiZlXoErdGQBQrOuKnCdzeeKarbGCVdvSjvUOlvAt4nQWVln6D619a+nt1vdoVNjx1BsDPY0Nc6Wv8Pvw7R+qtrXLceKQKsjqH8G0XR2jZd7akhQaTu7VZXwS2edadKy2JTKmyMYJHerw6+pUOi11A9WzS4v9eP7gVCuL0cnIQopzT2PJAdAyBu4plcgtN+kJUjjxDSsOM47KCtvlTTZahaXaFKkBwflPNS0JlxELY2kketJsy3HHSytI2jjNS0KQyy2pKk4xVJ9rxHIwyk7gQTThhQzvVwK3dSzJUVAgDPpSjqGWo4oZfbWCXZDSgPMke9MfwpsIVIIGT7U6bddZSpTQyjHrWkKX4viNLB57UD1puLOk+GUDhZ71ZWg+mmoNVSFWy0suKQsckDIFB8bDcTesjCTxXXXwqaw01AeXHnutIkKGApdCs5/uqb1h8Kur9OadcurjSl7BvOPQVzlcG1RJS4rrZS6hWFcV7C9RNa6Si6CnomzmHPEZISncDXlLreHEm6xny4B/hLdVt4+tDWycF3RLqI7prUSIjjh8JRAIJq/dWfM3yMLhHKQ2pO7y1xa0ZMaYHWRtW2c7h9K6I6TdQk3aOiz3iQAcBIJNaZ4w8kfLZeZuHiKbISk88d6O9A6hNo1K042shtwgKGaVv0eMmd8klpPhrHlcHqTQpAQIN3VH3ZIO4KrTvHHqV0RquKZ7LNyYZCxgElP2qk+p9rYlwEullPiJHbFXL04vgu1uXaJRSXQkhIVVbdR7fIh6jdjyMeFxgUrWN+X6pNMBQShS2whA/Sk57kZK0R0pFfXuXKeuC2GkKShHbioVK1OPErCtw45qLFZ1/oFJwZCAkdzRXbcMQHHPEAVjGTUHHiYil9XYdqkI6FPhqHyPHUEjBqnR4X2g9A6l19rwptEZxSQvzLKTj9662t/wWSb1EZdvE9DZKRuG48Vdvw4dM7XpHpdBn/KIMuQ0FFZHPIH/ADpv106/QelCmYa07pDic4B9c1np6XrJPqmrn8CMRLCnIN0SVgcec1RGvfh11Z05kql+CuTFB/MgZwK6l6V/FpA1fqxqz3FoMqdVhKlCujr/AGmz6p06/ClJYebdQQFEdqUrLk/qPIq4MtuspAQUlIwrPoaGFxJku9NwLcyt59Z8oRz+9W9140w3oPqBLt0ZO1pxZ2n71e/wkdCIk+F/bTUDAXyC0F+oo6ecBLpn8L+sdX6ejyL2PlW1AEBeUkVcET4RF25DbkW6JC0j0We9dNXi92TStoQ7LW3FYAASkYFVbqD4idM6duzLUtSBHdI2u5474pzR68cc+dVuhOubZaFSoj7khlsZKW1E8Vy7cLhc/HFlmh5hQcCMLGDnNeutkvVm1hpsTYTqJMV5IIHcDNchfE50IbaubWq7FECWkL8R3aOODmj2Z3xT+jXoL0O1C9EZ1A1eAI605DYWfX6UG/EX8O+qI65mr3ZYdZQSdu7Pfn/yq7fhi6m2uYP7IKdQXmQE7c+tX11N0+jUXTW5W9Te7LZAHvS1V+Lx8eLTba2ntoJ3ZwoVcfS7odf+qjjrNuX4aGwMlRx3oE1ZYl6f1xKhLQdyZG0J/wCLFejXwi6STaOmiLu+wG3JCQRn1rOfW3qoZn4NNRacsr86ZdGA20nJG41z5NkoturH7U2QrwlFJVXpV8ResRpfpFMKFBLrqcAj7GvMS2x1XK8Sri4crcWpVNjqRF39xr5tak8A0NrO4+uM1K3QkXd1pY9ab26Eu43uPAb48dwI/rQykSeltDX3WN3bgWeE89vIBUhJIFdb6O+DbUcjTra5chDJcTkgqOa6D+HjpHYNGdPoU4xmnJjzYXvUBkZqf6v9d9OdJoKFTClbhHCBVddGM9+OWr38CN8cbXJiXVkrHO3ca596h9ENbdO5C1T7e86wjP8AEQnIrvPpX8W+leoupU2UNiO8sgJGauzWWjrNrLSsiBcIzbxdaO0kduKVXfHHixBusq3T0ymSQtPcY7VZem9Uz9ZXBi2TW1PnOGwBn6Vjqn0nuli6tXCzWuIpbZWdiUg9s/SuifhH6DyPxM37U1vLXhcpS4mkzmS+k/hu1hebIUv+AiI6MoSoYIo2t/w/6n0rpt1CfBeSBkISM5rqqfcLbp2xqmSVNx4bKe+cACqnnfE70ujyTEVd46iFbSN6f+dDWYbdDkzYcB6FMtnyi0cZ2Yziprr29s6M3Eq7Fs8UW6Uu1gv9vTdrEtpxtwZOz60FfEQSOi1wwe7ZoVyceU8SxStU6/TaoOA488QD+tdGW34MtaGGmWmS2ApAVjJ9ap/pI2T11tyscfMc5/7wr10tI/6PxE7QSWh6fShlx5aTPh+1mzrf+z0WG4vnBdSk4q0Y3wYasm2hBXNSysjkEn/lXX+tNaaB6cOrumoFMNPnkFWM1D6M+JDpvrW8ItlruTRkKOAkEc1XT9OuItafDJrLQNmdmKQqY2juWwTxQJofpXqzqDdjFgQ5CAFbSVJxjnFet1wtkG8Wp2LMZbfYdTjkZqtJDvTno5EXJkiLEWtRX3A7ml0/SRyjE+C/VjlsClTktqI/KpRqutc/DXrbQg+aLSpDA8ylIyRXfmluumhNW3JMC23BkuK7AKFHl5tMG92V2FKYbdQ6ggKIB9KLSziV46OtyEsGKsFDoOClXejvpt0w1pq+YpzTkxxh1HOUKI/yqV666KXpTq/IbZQUMrUSAO1X38GzI/EZJJB8o7jNKf6R6/Vd6o6A9WY+mHrjer486yyjKkFxVc2usvquhtqeXA4UZ+ucV69dVAlHSu7A4x4J/SvJCSss9Ulkess8f8VPitfPi2bL8KuvdQWNu5REfwngDyT68+1CuoeiuvNFaujW2JEeVIWpJCmgcCvTjpQUp6U2shOP4Q7fYUnrF7RWnZg1DqEsJUkAguEU80TxTU65t0J0S1jftMMfjhLa0pGCs81Han+HfVNqcM6M4t0A+ij2q/rP8RXTO43UWyJdo6Vk4SEqFWs2uLcYAcRtdaWMpPHIq/ZlfA4xsFmuNsdjy2leHIZIC0n1wMVP9UITV0sMS6pjnxggBzj1p/11mN6J1AxIiYbStedvbPFDts143qDTamZjATlPGaqa683zePlUbqC4WqEylfy38RRwrgUOMuRJSy4G0pz2Bo31Rp1ma1IeSAAlRINVisttqUhD2Cg4Ip2M8/EGlG2EOOM9q0m3ZqDJiP4wGVhXanTPMBNC97K3paY6ElaifyppV2eLP16rfD7r62au6TW5uPKQH2mUpKNwz2Hp+lM+tvQm09VIqH3sokNp4UR35rzx6caw6haAukd61NT0MDGUjOCPtXWenfjOgxIzcPU8JxD6QAoqTg1nXdr/AOVX3T4Vdb6VuX4np91RcaOUY70Kaj111y0SktXJyUhtJ2lWVDArufQ/XLROulNtRZjKHlcJbXjmiPW/T3TmsrFIiz4LC1KQdqwgUk5z8+PKyZfrpr/V8I3d5T7i3Ug7jnnNepfSC0M2jpFaorbYT/CTkAY9K85NZ6TY6fdeWLejalkSAQAOwzXpd03eEnplbXGlAjwk4/ahtmOUfjb1rc7O3Gt9vkKbxjgKxmuZ9NaxGtLSLFelpDwG1DivQ/rVy/HlbZiNQxpqkq8L3FcaRZUqM4l6M4pBHmBTxSqdZen3wqputosj9lmS/HYBHh+bOBVu9X4JndIbu2lOSllZGftXMXwTT79emH35rq1tN+XKjn3rqrqhLZh9K7w84QE/LrGf+E0ujGf7eWPSHWcjRnxIJdedUlC5RQrzYHc162QJbV90wzKbIUiSznI+orxPus0t9RJVwQSCiUVgj716t/DXrJrU/RiCQ8FuMtpSrJzjihp7T8cgddenS2PiUjxGmQUypSVcDjv/AOld9dPrM3YenFtghAQpLQyAKFNb9K4+puo9t1IEJJYVuVxR/fJ0exaQfluqDbbDHc/QUKs+OKvi+10ibqMaZYkAgbgoA8VytZ29klxhPoDUj1Z1bJ1j1iuFyZWS2l5W3njGaiLdLVGWt10EHBocm4F70Si7vFXBzTKJKeiXJqU0rattW5JHvTu7uCRPcd/3q+03aFX/AFbAtTRILzgTzz6igsuhOn3UjrReYjUKxrkutJG1JBOAKJtTfD91i6loRMvjyiDyErJNdhdGOk1k0JoSGkQ2jIU2lSllI5yKh+svxCWXpQz4LaEOyPRAA4odOPjmvpf8JGr9J9Q4F9W+EJZOVYyK76iNOItjbbi8rQ2En9BXFekPjdumq+okWw/hyW2n3AkEIA712rAfXKtKJSk4LrYWePpQvVcA9ataRtHfEc45IjocDiwMEZ9a7N6STot06dRbg0wlsODPAxnivPX4tSlv4g0kn/8AkBP71350GcjvdEbSWVDGwZwfoKEyKr+M7VtwsXSdcG2LUhx5ODt44z/6V5kMPynJKnJDyysndyT3r0J+O8zI2koshCT4RHJH3NednjeUuZVgmg+PTL4LbvJn6BWw44pYbHqc1aPxHE/3IXFQ48neqb+Bfb/YV/CTnHr9quX4kAf7j7kkYyUGgPNHpC7v63wEg9nz/wCKvXu0Z/s9G7f7ED+leQXRmM4OusEqIx8wf/FXr9aRjTsYHv4IoRP15y/GNd5zvVlduekKMbjy547Cqd6Uw37f1ftMi3OKCFOgHB+oqyvjLJHWR0DOeP8Awiqt6QzXf72rS2o8eMMc/UUK9nr7YHXV6VhuL5UWQT+1cI/F3cLjJ16IRdUGU44B+ntXd1gV/wBGIZ9PCGP2rhL4rtn95ClHvgH+lCd67FNdLpM6D1JthYUpKS6lJ2nHrXqnYnFO6Xhrd/OWgSf0FeUHTmdu6n21sns8n/OvV/Tyt2lYf/0RQMWR59/GPI8DqOkjjPqKsD4KXw69JURncEj/AF+1Vt8Z3/xLQnOc4/qKsX4ImSj5gnPp3/19aGc13TqzqoN/S+7JAP8AsDXlM7A+Y6kLJThSZRP/AOVer3U1aUdN7mVc/wAE15dtuNK6vLSn8hkq/wDFQfmn16edKwP7rrYnHZtP+Qrmz4xLlIbDMFDykIWeQk9+DXTXTpKU9ObcG/8A5YP9BXKPxnlYuEYZ9R/lQqXkccQ2n4moGJMV5YWFggpOPWvWDovPkTekFuflqKlhABJ79q8q7UjdPZ82TuFeqHRNvZ0ht4I7oH+VHU4328U58UVgbvkyPHbk+G8SNoJwc4rmhEDV1mWmOppwso4388irk+MW/wBysGs7ZMjrUG0ugkA/9mq6011utF4aRb7q0gHbgqIrTNcn8jFv1NRDFuFm8FxQ8ZScKB96pW625Nr1ouFIwlLqjgH1q+2dMoudwRdLS8lcc+bamqv62WJ2FeYN0S0tJQRn9qu3riuVfphOfIowMHGcVDaauMO39WIarq0lcZDo3hXajLxW0RfFG3als/5VT90k+NqJ59J2+bKSDRXb4ePXnRujunepdGQrhCtENwONDKgAfQVzB8Q/wx3ubqFV10fE/hqPKGk5qvugfxIXnRUdu3Xl1TkJPlGecCuy9P8AxF9Pb5bUOPzkNLIyUqOKnjou5+OQOjfQHqdbOokOfKbkxmGlgq3JIBr0Wb3Q7Kj5lYy235ldvSq6lddOnkGIp5FwayPQKqhervxTNy7ZIt2mF4CgUlaTSsOak+RRHxKXiFcus78mA4lS2XBkpPtXYnwudSLbqTpqxZ1yU/Nx0hO0qGe1ec12lu3G6P3Sa6XHXSVKJPNSPTXqPfen2qkXG1vrDRV50g+lSc29KuvPRyP1V0YqK2kCSlJ2KI5rhhv4MeoI1H8opDny3iAbthxjPvXVvTz4utG3mC1GvcoR5GMEqNWOOv8A0zcSp1N5a8vP5qGuaz0S6UxOluhWrelI+ZUB4ix9qq34weq0DTfTpzT8SSn5l/ykJVzz9K+6nfF3pS02R5mxPh6QUkJKfeuAdea6vPUfUEm63Z5amwolCSf2pcHtOcCr6g42XzgqcJUo/Wuy/gj1wuPcHNMuvfw3MADP3FcWBZU2W8YA7VaXw9X+bYus1vDK1DevBSPuKTP+3r+lAGCg49SDXP8A8WevUaS6NvRWpATIkpKQM44q+LdILlmYkODGW9x/avOn429aO33VrNjju5Zi5BANDTrnCDKZdiKlqGXVncqn8bbOKglAHlNDsdfy8EN4xnjmp+xq2R1uE4yKHPsL3MeHclt5xtPaibpFKiROs1memY8IPJ59uaGLmSbm64RnJpvDffhT2pkZW11pQWk/ahOP17jWiTHlWCI+w4lTSmUhKh27Yrin4nOh+s9Qa5N4s7T0uOvJCEI3AVp8PnxV2+PZ2LFq6WE+EnYlSj2wK6cb64dNZsESV3lgpxnBVQ6c1x/0Q+GHVbOu4uoL1GcjoZWFBK0bfX616CRWPlrahhGcob2/0rnXWnxa6B05Mag2qS26pStqin0otsvxIdPZdkakyLm2hxSQSCqnw+uEvjH8ZHXB13BBSSefvXVvwbdQIV76Tt2R18GQyOElXPYen6Vyx8XOpNNar1wm6WKWh0KHJTz7VW/RvqrdOl+rWZjDqjGUob0g9hmjg9nqD106Ys9Uem79nwBISgqRnvXnS/8ACP1ORqlVubt75iheA4GiRjOO9d79PfiX0DqqzsKl3JqNJ2AKC1Y5xRLfuufTayQXJDt7juqSCcBXejirr4gPhz6UzOmOh0R5/wDtlJ5GOakfiMCF9F7hnP5KrvRfxZ6WvesZkeXJS1EbUQhSj6U563dZdCXrpNNiQro046tBwkKzRxF3HDXSEso64QWwfN454Pr5q9bbYoixRxg8Mj/KvHbp/e4Vv63W+4SXEtR0PZKv1r07t/X3pyiysIXemgsNAEbvpRxErhz4ys/3yurKTxjv/wB0VU3Sbarq7aD/AP7D/MVYfxSaqs+q+qrk60yQ+0rHIOR2qsumU2LbuplumTVhtpDoUSfuKR29exmn+NKQuOzI/wAq4P8Aiy2jqQQDjy/+VdU2Prl07Z07FZcvTIWlkAjd9K4s+JTV9n1L1IXItcxLjXHIOR2oK1TfTpx0dY7cnCseMjn/AIq9fdN5/sjB/wDoJ/yryQ0BIgQ+qUCXKcSlCHUqJP3r0usnWzp+zYokNy8NJWhoJI3fSgo42+MZJX1UQACfy9vtVq/BmkIiulKTnAqo/iVvVp1N1I+etslLzQ5yOaN/hY15pvTC5KbtOQ0SOATj0oEnHYPVJW3pldVH/wCSe9eU5kOI6mqKf/7Suf8Air0a6g9WdGXfptc40O5tLcW0QkBVecSHmz1DU7IUA18wVbs/WhWv+z1d6ZDHTC2KPJLQyf0rlz4xQy9dY7a8birj/wC01dfT3q1oiLoG3Ql3ZlK0tgEFQGOK5r+LLUduv98hv2eWh9AVk7DnjaaC1qSccxwG3Yl9ZSASkrGP3r1U6LLB6RW45/kB/oK8xbQiPIlNLfWElKh3r0Q6V9Q9IWnptBhzLqy2tCACFGhli/VCfG2kPX23oION4P8A+JrjNaFRnAplRSofWuwPiy1HY9UXWG5aZzbwSoElJ/7JrkqXHKn8IV3pz9Hk5Rv086rXfSt3b+afU7EB5QTVh9X+qOndZaNiogNIS/xuGee3/pXPMq3vtpCwkqFO7dDWpSQ4k89gartjl1mJqXLlI0++tKT4ZBGarRJK3vqTRxf7uiPp8wknBV7UEQAp2YjIzzWjfOOZ6MrdHbVBQ2rzEj1qaYZcYSkturR9AcUzgNpCEpA9KkV5UkBOcikwtsr55yStY/xLqhjsVcUzmuBhjKiM+uaetoKQVEfvUFfXcoxuwfpS006jHF+NIOeEdzitDtQ4SnhI9Kj0y1fMeGPfvUhIaKIwyTuX2qGmIhJUha7gDHWpJz3BxUohyc2zzMeBV7LNTlr6e3GTZXrq4FBCBuzioWQCkp4zsODQ2/os5F3wAp8lSjzkmkgyUQFYAwRyalLWld5nJgR2yVK4GBUnqLptqe224vBhexXOAn0oCC0Toi66+1Giz2ZOXc9+9didCvhMvmntax79qFQ/h84P3Bqh/hkv9p0Z1aRKv7iI6AeS6cf0NeiDvxAdM2oanUXqIsgZCEuCpVBbrW9R9LdP5s9bqUoaY2p5x6V5K9Sb7I1d1IuM11zyLcJSTXRfxC/Ec3rRxem9OOLREH51IPB5rk+ZI8SQptKsrzkq9aFWwwdZcdk7ArIBqfghxFvKCMYHeoRpDhlkpJolj7VQS2SNwTQw2E5xy8tJINM0kbR7inExJTNcyfWmhIz3o4zjbcQ7vSrYr3FL/id0Q3sRcJAT7BZpBI4rYJz6U1e1JKW6654jrqnF+6lZNSUS4SkNlBkuYxgeamyY+eaUDSQMetMe9bvIU8Spay5/3jmo5bSmlHy8fWn6C4hWVdq2fCXUkgUH7VGszZ7C8xpLrZz/ACqIqRZkXOYnEqdIcGfVZNJx4ZKu3r2p/wCI3HTwnBoXd/CzDXy7R2PKb9yk4JpncLlKdT4AlOqSn0Ks0i9OecykAAU3IBJ9SaGV7aTCj4ocBIUPY04TMn5JEx/n/tmkktgKpw2gUKuuMJU6te5x1bij6qOaVCVFQKSUkdiO9bISOTispUAe9Sm6OEv3FKtwnPf/AHHitVvPKcK3nVrV7qVmtgryZNJOH0o6cvWWpDiZqXEr2kdjU0mTLXJTIE54EdwHDUCtvO3A5p7AClO7FKV9qFC0yPFhFa3ytzGPMc0OsNT0TFutyXGwf9xRFN7jMXCeShKjj1Gal4q0y7YCj8+OcUDpy1NuMdjYJzyknjBUTTSTuUd5Wd2c5ppMn/LJ8NQ5pkLp4ytuf2oHslUSbq2Qpie+Ej2WcVOw7hMlsBuQ8t8gcbjmoO3ymkpKHSAD2p2zJEWWnZ+RR5oZ70fydkdolCylav8AOnxNwetCXkXJ9OOAA4RX1zgsLtyZSVZKhnioyNLcU38mM4Pags0nOTJ8JC3Zjjp7+ZWag5SXkvJ2KURRO1GQ4nwnyQaTl21thSVZBSacFvW9lCJDIbfAPHqKlTa0E5Qr/u4Pao+DtSsbE8e4qxNM6Fvuoil1hPgsnspQxTrPTnvVTgMpCAe1aabjhyYCqmd+keNc1ewOKldNJKAFnFV11b+YGzLSUflHpThhOQSeeaQjupWB5TzUiEobjleQKqfXBrvTd3hBwKC7+VlZAB70XrdISTmhu5DxXs4zS18aoK2xP8T4jo4HvUhNkNrdbKANqTSiUlCc449aavhIV4LSMuKPAFQ1zRs9rx+DpZFvjMlaFp2kgUJix3ifBenojqQ0PMSqp+PpeSxpYzpagkJGUpWKbwtYzZbLenm2hhw7CpI+tJp7ILT+oPwGR8wlhS3k+vsaOovWmdcZaItwQnwSMcmja2dJrYdMKU80nx1gLBKeaprVHT+62me86ywotJOQcVXLFTcox1NpeHqW1pu2nyUvYyoJFV7bmbjCuKmZrjqVI9Ce9TOmdcXHTTAQ7GUWwdpChwRRFdp1q1hb1S7c2hmSBykDFTY1n2fALMuiI0hwtElSuO1QfzLgkKeWe5960mtPxpa2JGd6VUipW5GAKRc4LUFluzl/+YjvScWStbZUD6VCMyJDrAjknb9Km2Yvy8TefahjtDSt5lKJHekglHG6njzgUpSkg8U1S0txW7aapm+LfHBrDaFeLg5p42yQgA96dsQwsc4zQCTLWU8ilflgMECnQYDI3Z7Vp4qSSAOaChq7H8pwKYOJdZV+UlP1qcGOx9aRkBG3bxihVRiXykZSKauOurVlVO1N7VHB4NJlAyBihUJIb9SKUABPatwnjB7VgoGOKFMEZPFbpBFYCCOea3HHehnf1uj8hr4ZJr5OAg4rPIFFhcrJUcYBrZLa1DPFZSAVDsTS/gL25BwKiRWSZwAAcGlbcFfNbq+bb3fXmnsdnacJ7mq4o1lWt+4TAQDgVP26EIUbwyCVYp/aWg2QVgc+9Scplvb4oxzzRypquNQJcTIz2Gah8ltxBByDRpfGGn92NuRQm7DWo4ByfSjlCWbcCWEeXcafKeWI6SUU2022X3FNugHHbNEMeF/jlx1DcD2Bo4z0fQc3C0hKF8gdjTaCUQJS/mEZPoTTSKuZb7g42gHaFVIzsSrcH0AbvWmnn01XJQ66V5KQTWt2nBqI2M54piht91okJIx3xUZOeVy2ckjihX9LK6ex7e9PbfuzqAxnnNXfN1PCRAbh2Fwtx0AArQPauVLU7cH0JjsrUAfRNdP9JrBb1Wdpu6uIWpwcpVyaEf04nnq8S5rA4yaK7EyluKOO9CZSVXA+pKqOrK2Ux0lacVVjq8lnE00rKAEJ5r5ZfBCHCUg+9LxVNIkJOKzdpUMqT5gD9accvJ01UghBTu5PaoyShI4URmpIvpSxgILij+XFJr0tqa7JCrfa3lZ54Bo1F2IZ1xKGvfPHFGvT/pnc9QXVu8PAIiA584p7pjpLqp6a27cLQ6UDkjbU1qWz9UIMJwWSC9EtrIwrbkVPDgk11o2E7bmYrU1CWgBuCFACg7p/03jf3iIdaBkR2lA7u4zT7pvpjW+r7e/4izLySFJUokprp7p306RpjTQEiJ/HUCpaiOc05DtR0iBbBFTlAbShIBP6f+lDE60WO4wXXChp5vHcc8/6xR3rbTzj+i5Ity9rx4wPtVAPR9UaY0uWVtuLJWCon2zVI9voE6naatrsVz8PShotZ+mapmy3R6yXgLKyUE4UnPBq7r02rUzK2Vr+Xc2ndzjJqjL3bFwLq5HXghJOFCstOvx74nNT29M1kXiP2UMkChAKJHPBHFEFkmOuxXoD69zYT5QahJMdTUpaD71n1pqH1sH8cKV6e9EjzqFRdhFD1oQpTvIom+WKhgJ/ary59o1MdG0+XvTxiK0U42YxThiOlt7C6XfCWiC2Bg1TM0MEHlPatkRNvvT9gZRkk59qUyBkYzQEHKQ4k4BNNdi0p8w/ap5bW9RO2mzrC94GzihUyiUvgEhROazt8VOcYpy9BHi5COaXSwltvsKF8RJawcYNJlsA1I7N7hIHakHGFbuKDnDMpHpX23gUsWljmsBCscjNCmm3y4rUpweaX245pNTW84FCbPrUFARivkuJCsKOayIygOKVYiKWvlOaulwu0lskK9aVaDzj2wA7aVajIS4lPapQRUBvcngn2qC4ZN29Q8wxSzDToc2nAH2rdIdSragkj3p/FaPBWck1UB9CQcAEkVJvMJXCOFdh2pgSWkAjinkN5To2r7GguwB3ZTgklO7AzSESMt5w4xkUU3m0tKkEoGVE0lCtaIwK3Tg44zQi6DrAfgXIKSk4zyKJI1xUbm09jHODmomT/wBdVu9KVRs8MFKsVKKnroptuSHf9/29KRiuJ8It8KzzTBRcda3OqJCewzS9mkpXNLO36UJbOT2mULa2YJFCshZU6tffmia7NIanEKR+ahia34UjyKzn0oVPw/st2dt81KikEexq5tN6iXHtvzxlbXB+RIOKoqC0uTI8Mr24qQanS4c5LK5BLaD2BoFnQ5FirRcwXUfzUdMhpMRJSnGKaG3+LPyEYSTxUm3HSnCSeBWlVaRJUpBUnIxUTcYUiUlKI5W46TwlPNG7VlbnNttMLwtRwBV8dKui8G2obvmolN4OFJSvFOF1UnRjpdqy96gZfuFpdMULBypJxiu4Lfpqz6XtTbf4KwpYwOEZPpWrmutE6RshDaorBSMYTgUwg9YdK3COHlymloJwCTTpUbQUW+SwHRbW0K9QU4qrfiC1E/prpy+xbbahfjpwdqPpRTcOq+lbQwJTkxjaocJ3Vy51k68wruH4cZSHWj2Hf0rOrhh8M2odS2zWrri21fKPKPlI4rs968Qn2EpW422V8HJArzK031Nu9ruB/DlhsHJA9qspHXG5hEWLJlnORuOfrR1Vy7CvVskuyG0wpLa2+5AOaC9exYsG37pobCAAVZxVUXDr3EtlkadiSvEfAGQTmq16hdbZ+rbOY7DoQojBxR1n6k9dT7bKuWbDgKTwvZVRalbU4UuKQd6e5NaM3K4wX/GQ+VKWcqBpjebs7JWpC+6u9RfrfGUVEccamhaVYSTzTy4gKdbXnj1xUU2VF4AelSyGvEjErOTjio/W9nwuwEoSlbJ59cUXW1tTscFSucVF6Wsi5kUrUO1GNvtYjkhf2q459hec26hwkE96zHLjrYQU5+tF0i1tLAyBk01XDRHR5WhmmziFDL6QAAcVuGnt+OcVJgEp5bwfpSaDlztQZv4CkeZWa+DQWM0pLVjkk5pASkBIAIoa9fKjj2rRUQ/zdqXSpa05TzW2x3tjig5Ed4DaTgcClTbwWisdqVXHVuzWyXVJR4dBIlyMBnj+lJGKe/apr5ZThyE5rKoZSnkUBAqiHvzSQZ2A4FEXy4IxtrQwEkHy0BCttkj8tSEWGR5iP6U9bgEH8gxT5tnwgMjigG7MBChvI5pwYicc08bSkI4AP3pN1R5SU0Ak1GZKu4pGe34be5omnEdhRWSM5+tbraAVtWM5oLWUczP8RCWljnOKfoW6he5BwKbSYASoLa4xTuKcN4VyR70MuPnniXULX6d6azX0yXAlsgYqRcbS+jbx+lQl7bFtaQoKwVUDhnKYBQo+tRJleGsJJ4H1p2/L3NZ3d6hX1JLiuaBwTRJbbjWFkYNIImpiXLxEdqHBIcSMJUcUu26ojcTn70DifuV2EpwKI5qGfWFJ3lPBPvWAouAqAHHtSbyT4PBxigSJi16SvV3R41sSon2GazP0nqe3p3v2yQrB7hBNJab1jd9PuH5d3y+xosb6z3N1pbUqOy5j/eTQPU4WmMzESsYJHGaiLs+Y1pW82klffIFR715WGdhTxntSov7MmL8s4wkpxgk1oXEz0sZuNz1I1MlSlJYbVuIPb0q+NZ9Q0ogsw408pS0kApSfaub4eqhp9hbcZrAXnlNQlyv8yUtT/jLG70zThyCbqFra4XN0sNzndnrhRqF05qi4xI/hOzFhpPIyo0HPyXJDu91ZVSJfcBKUKwDU3TTOOivUuubpc5gbRLd8JPAAWaFJEl59RUtalfc5pAAlRya+2+9Q2ziQqxJWwQpHCh9aeKuJUMrOVfeo4JyO9ZQgqXjNAsnUow/JkcKKij706WoNJG0/vX1tbSls5HNZlpBxtNCfRr4pUcqJFRUs73gef2qRUlaUd6bObT+YChSOB8NwEipaOoKhqWVbajnAknApZkqcUhk8JJpSC1Y2iZKmoKgvt6H3qZnXVDbp2+/vQ3E3xbahLOMEd6bSi6W96lEk/WqmWes9FbV6aKRuIz96UcuTDg/l/egEpfWPK4RWESH45wtalc0UvQcG4sBOwJGaQddbPmQQKF0ykrSCVKBpIylpcVtcURSL0Ey0pexlQpD5FsOA7xUB88/2ClUg5OmAnCz9KF8HLDTaGgQQRTWROQy5tGKEWbjOTwVqx96ct+JKytx/B+poOQRCchaMnFIqkNBe84xUKtaUMhAeyaTBCkcvc/eg+CVq5MZwkjNOC4hw7ioAH60FlKwvcl+tlSZW0BL3b2NBcGZcbAwnH1NYRJZ7FQFBzMqXk7niaWW+8pON5FBcFpmtAYSRSS5YXhOQKEkyC2cKdNLCQTylw0DgvYkIbRgqBxSDk9sPZ4oXVLdxgLP71r8y5n8xoMZMXNsK7CniH2XPMcZoGblqIwFHNK/iDzXZVB2DpDsb+fBrVb0IZUAmgL8XkLeCQsinrctRG4uf1oRcidFwjokgAYAPeozWaBJtqH2fNjvioc3BS3ggEDnvTh+fIcty2VbVDHGaE+oTMoFGwnkd6RU6kqyDTV8lp9efU0j4h98UD0Pg4kU7jr3JwOaiErVu5OadNv8Ah0H6JhDiGmiFcGmrrySCPSmypW/1pNTmTQJgsVJI2pJFbRkoEtAV2J5poFkGt0qKVeIDyKKVy//Z', 'scrypt:32768:8:1$Po8A9hyn5NmuPQSc$fd9a8de271581eeaac51a1982a400c6f06840b6c4ecd0f3d6bbcedd10c31fbc140c8261d9b4efa77d9f9b2fc5660a3c694ad7a5aa2fbe3f06f515056c4c604a8', 'ACTIVO', '2026-06-07', '2026-06-07 20:41:06', '2026-06-07 20:41:34', NULL, 2, 'PERSONAL');
INSERT INTO `usuario` (`id_usuario`, `primer_nombre`, `segundo_nombre`, `primer_apellido`, `segundo_apellido`, `fecha_nacimiento`, `sexo`, `correo_personal`, `correo_institucional`, `telefono_movil`, `telefono_fijo`, `direccion`, `dui`, `carnet`, `carnet_minoridad`, `foto_perfil`, `password_hash`, `estado`, `fecha_ingreso`, `fecha_creacion`, `fecha_actualizacion`, `ultima_conexion`, `id_rol`, `dui_tipo`) VALUES
(4, 'ANDRES', 'FERNANDO', 'MONTES', 'LOPEZ', '2007-07-13', 'MASCULINO', 'andres212@gmail.com', 'andres.montes25@itca.edu.sv', '23132321', '56547457', 'ITCA FEPADE', '312312312', '109525', '3123123123', 'data:image/jpeg;base64,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', 'scrypt:32768:8:1$KpGQIuYdy4eSRgzb$48e3ff4f84be1e5228b637fc9a5c05a5420ca7dccbefd7578a62a4f368a7da769000d2b856b3d07cadf30e3bc23f9741f9924d2b727a87b9188023fa4078122d', 'ACTIVO', '2026-06-07', '2026-06-07 20:59:30', '2026-06-07 20:59:51', NULL, 3, 'RESPONSABLE');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `asistencia`
--
ALTER TABLE `asistencia`
  ADD PRIMARY KEY (`id_asistencia`),
  ADD UNIQUE KEY `uk_asistencia_unica` (`id_usuario`,`id_horario`,`fecha`),
  ADD UNIQUE KEY `uk_asistencia` (`id_usuario`,`id_horario`,`fecha`),
  ADD KEY `fk_asistencia_horario` (`id_horario`),
  ADD KEY `fk_asistencia_modificador` (`id_usuario_modificador`),
  ADD KEY `fk_asistencia_registrador` (`id_usuario_registrador`);

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
-- Indexes for table `token_activacion`
--
ALTER TABLE `token_activacion`
  ADD PRIMARY KEY (`id_token`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `carnet` (`carnet`),
  ADD UNIQUE KEY `dui` (`dui`),
  ADD UNIQUE KEY `carnet_minoridad` (`carnet_minoridad`),
  ADD UNIQUE KEY `correo_institucional` (`correo_institucional`),
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
  MODIFY `id_aula` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `carrera`
--
ALTER TABLE `carrera`
  MODIFY `id_carrera` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `carrera_materia`
--
ALTER TABLE `carrera_materia`
  MODIFY `id_carrera_materia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `ciclo`
--
ALTER TABLE `ciclo`
  MODIFY `id_ciclo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `clase`
--
ALTER TABLE `clase`
  MODIFY `id_clase` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `clase_grupo`
--
ALTER TABLE `clase_grupo`
  MODIFY `id_clase_grupo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `grupo`
--
ALTER TABLE `grupo`
  MODIFY `id_grupo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `horario`
--
ALTER TABLE `horario`
  MODIFY `id_horario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `inscripcion`
--
ALTER TABLE `inscripcion`
  MODIFY `id_inscripcion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `materia`
--
ALTER TABLE `materia`
  MODIFY `id_materia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
  MODIFY `id_tipo_programa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `token_activacion`
--
ALTER TABLE `token_activacion`
  MODIFY `id_token` int(11) NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `fk_asistencia_horario` FOREIGN KEY (`id_horario`) REFERENCES `horario` (`id_horario`),
  ADD CONSTRAINT `fk_asistencia_modificador` FOREIGN KEY (`id_usuario_modificador`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `fk_asistencia_registrador` FOREIGN KEY (`id_usuario_registrador`) REFERENCES `usuario` (`id_usuario`),
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
-- Constraints for table `token_activacion`
--
ALTER TABLE `token_activacion`
  ADD CONSTRAINT `token_activacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
