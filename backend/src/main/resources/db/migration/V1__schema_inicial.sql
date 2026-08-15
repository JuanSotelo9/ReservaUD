-- ============================================================
-- V1: Esquema inicial
-- Corregido: se eliminan las tablas huerfanas sin entidades JPA
-- (administrador, gestionar, horario_laboral, tener).
-- Se conservan caracteristicas + ser_caracterisado como funcionalidad.
-- El rol del usuario (n_role) se agrega en V2.
-- ============================================================

CREATE TABLE `caracteristicas`
(
	`k_idcaracteristicas` INT NOT NULL AUTO_INCREMENT,
	`n_descripcioncaracteristica` VARCHAR(255) NOT NULL,
	CONSTRAINT `PK_Caracteristicas` PRIMARY KEY (`k_idcaracteristicas`)
)
;

CREATE TABLE `tipo_de_recurso`
(
	`k_idtiporecurso` INT NOT NULL AUTO_INCREMENT,
	`n_nombretiporecurso` VARCHAR(50) NOT NULL,
	`n_descripciontiporecurso` VARCHAR(255) NOT NULL,
	`n_imagen` VARCHAR(250) NOT NULL,
	CONSTRAINT `PK_Tipo_De_Recurso` PRIMARY KEY (`k_idtiporecurso`)
)
;

CREATE TABLE `recurso`
(
	`k_idrecurso` INT NOT NULL AUTO_INCREMENT,
	`n_nombrerecurso` VARCHAR(50) NOT NULL,
	`n_descripcionrecurso` VARCHAR(255) NOT NULL,
	`k_idtiporecurso` INT NOT NULL,
	CONSTRAINT `PK_Recurso` PRIMARY KEY (`k_idrecurso`)
)
;

CREATE TABLE `usuario`
(
	`k_idusuario` BIGINT NOT NULL,
	`n_nombre` VARCHAR(50) NOT NULL,
	`n_usuario` VARCHAR(50) NOT NULL,
	`n_email` VARCHAR(50) NOT NULL,
	`n_password` VARCHAR(255) NOT NULL,
	CONSTRAINT `PK_Usuario` PRIMARY KEY (`k_idusuario`)
)
COMMENT = 'persona que interactua con la aplicacion'
;

CREATE TABLE `disponibilidad`
(
	`k_iddisponibilidad` INT NOT NULL AUTO_INCREMENT,
	`f_horainiciodisponibilidad` TIME NOT NULL,
	`f_horafinaldisponibilidad` TIME NOT NULL,
	`f_diadisponibilidad` DATE NOT NULL,
	CONSTRAINT `PK_Disponibilidad` PRIMARY KEY (`k_iddisponibilidad`)
)
;

CREATE TABLE `poseer`
(
	`k_idrecurso` INT NOT NULL,
	`k_iddisponibilidad` INT NOT NULL,
	CONSTRAINT `PK_Poseer` PRIMARY KEY (`k_idrecurso` ASC, `k_iddisponibilidad` ASC)
)
;

CREATE TABLE `ser_caracterisado`
(
	`k_idrecurso` INT NOT NULL,
	`k_idcaracteristicas` INT NOT NULL,
	CONSTRAINT `PK_Ser_Caracterisado` PRIMARY KEY (`k_idrecurso` ASC, `k_idcaracteristicas` ASC)
)
;

CREATE TABLE `reserva`
(
	`k_idreserva` VARCHAR(50) NOT NULL,
	`f_horainicioreserva` TIME NOT NULL,
	`f_horafinalreserva` TIME NOT NULL,
	`f_fechareserva` DATE NOT NULL,
	`n_estadoreserva` VARCHAR(15) NOT NULL,
	`k_idusuario` BIGINT NOT NULL,
	`k_idrecurso` INT NOT NULL,
	`n_calificacion` INT NOT NULL,
	CONSTRAINT `PK_Reserva` PRIMARY KEY (`k_idreserva`)
)
;

/* Foreign Key Constraints */

ALTER TABLE `recurso` 
 ADD CONSTRAINT `FK_Recurso_Tipo_De_Recurso`
	FOREIGN KEY (`k_idtiporecurso`) REFERENCES `tipo_de_recurso` (`k_idtiporecurso`) ON DELETE Restrict ON UPDATE Restrict
;

ALTER TABLE `poseer` 
 ADD CONSTRAINT `FK_Poseer_Disponibilidad`
	FOREIGN KEY (`k_iddisponibilidad`) REFERENCES `disponibilidad` (`k_iddisponibilidad`) ON DELETE Restrict ON UPDATE Restrict
;

ALTER TABLE `poseer` 
 ADD CONSTRAINT `FK_Poseer_Recurso`
	FOREIGN KEY (`k_idrecurso`) REFERENCES `recurso` (`k_idrecurso`) ON DELETE Restrict ON UPDATE Restrict
;

ALTER TABLE `ser_caracterisado` 
 ADD CONSTRAINT `FK_Ser_Caracterisado_Caracteristicas`
	FOREIGN KEY (`k_idcaracteristicas`) REFERENCES `caracteristicas` (`k_idcaracteristicas`) ON DELETE Restrict ON UPDATE Restrict
;

ALTER TABLE `ser_caracterisado` 
 ADD CONSTRAINT `FK_Ser_Caracterisado_Recurso`
	FOREIGN KEY (`k_idrecurso`) REFERENCES `recurso` (`k_idrecurso`) ON DELETE Restrict ON UPDATE Restrict
;

ALTER TABLE `reserva` 
 ADD CONSTRAINT `FK_Reserva_Usuario`
	FOREIGN KEY (`k_idusuario`) REFERENCES `usuario` (`k_idusuario`) ON DELETE Restrict ON UPDATE Restrict
;

ALTER TABLE `reserva`
	ADD CONSTRAINT `FK_Reserva_Recurso`
		FOREIGN KEY (`k_idrecurso`) REFERENCES `recurso` (`k_idrecurso`) ON DELETE Restrict ON UPDATE Restrict
;
