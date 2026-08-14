/* ============================================================ */
/*  DATOS DE PRUEBA - ReservaUD                                 */
/*  Genera datos para TODAS las tablas del esquema.             */
/*  Es re-ejecutable: limpia las tablas antes de insertar.      */
/*  Las fechas de disponibilidad y reservas son relativas a la  */
/*  fecha actual (CURDATE) para que siempre se puedan probar    */
/*  los endpoints de reserva.                                   */
/* ============================================================ */

SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `reserva`;
TRUNCATE TABLE `tener`;
TRUNCATE TABLE `ser_caracterisado`;
TRUNCATE TABLE `poseer`;
TRUNCATE TABLE `gestionar`;
TRUNCATE TABLE `administrador`;
TRUNCATE TABLE `horario_laboral`;
TRUNCATE TABLE `caracteristicas`;
TRUNCATE TABLE `disponibilidad`;
TRUNCATE TABLE `recurso`;
TRUNCATE TABLE `tipo_de_recurso`;
TRUNCATE TABLE `usuario`;
SET FOREIGN_KEY_CHECKS=1;

/* ----------------------- USUARIO ----------------------- */
INSERT INTO `usuario` (`k_idusuario`, `n_nombre`, `n_usuario`, `n_email`, `n_password`, `n_role`) VALUES ('1', 'Administrador', 'admin', 'admin@reservasud.com', '$2b$12$qTH7t58rzjilNz9OSrtPq.7XX3O4cFti47kwmNmyYH66E.7IIA5rG', 'ROLE_ADMIN');
INSERT INTO `usuario` (`k_idusuario`, `n_nombre`, `n_usuario`, `n_email`, `n_password`, `n_role`) VALUES ('2', 'Usuario Prueba', 'user', 'user@reservasud.com', '$2b$12$vJfEMB0fUZX1jDS1vEruu.cv4zx1kAb27gfNmjk9T6wjLJaV2upAi', 'ROLE_USER');
INSERT INTO `usuario` (`k_idusuario`, `n_nombre`, `n_usuario`, `n_email`, `n_password`, `n_role`) VALUES ('3', 'Maria Gomez', 'maria.gomez', 'maria.gomez@reservasud.com', '$2b$12$vJfEMB0fUZX1jDS1vEruu.cv4zx1kAb27gfNmjk9T6wjLJaV2upAi', 'ROLE_USER');

/* -------------------- TIPO_DE_RECURSO -------------------- */
INSERT INTO `tipo_de_recurso` (`k_idtiporecurso`, `n_nombretiporecurso`, `n_descripciontiporecurso`, `n_imagen`) VALUES ('1', 'Laboratorio', 'Laboratorio', 'https://www.ucentral.edu.co/sites/default/files/inline-images/recorrido-laboratorios-universidad-central.jpg');
INSERT INTO `tipo_de_recurso` (`k_idtiporecurso`, `n_nombretiporecurso`, `n_descripciontiporecurso`, `n_imagen`) VALUES ('2', 'Aula', 'Aula', 'https://st3.depositphotos.com/29384342/33698/i/450/depositphotos_336981024-stock-photo-empty-modern-classrom-teacher-desk.jpg');
INSERT INTO `tipo_de_recurso` (`k_idtiporecurso`, `n_nombretiporecurso`, `n_descripciontiporecurso`, `n_imagen`) VALUES ('3', 'Tablet', 'Tablet', 'https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/media/image/2021/07/lenovo-tab-p11-pro-2424527.jpg');
INSERT INTO `tipo_de_recurso` (`k_idtiporecurso`, `n_nombretiporecurso`, `n_descripciontiporecurso`, `n_imagen`) VALUES ('4', 'Portatil', 'Portatil', 'https://megacomputer.com.co/wp-content/uploads/2023/11/PORTATIL-HP-14-EM0014LA-4.jpg');
INSERT INTO `tipo_de_recurso` (`k_idtiporecurso`, `n_nombretiporecurso`, `n_descripciontiporecurso`, `n_imagen`) VALUES ('5', 'Video Beam', 'Video Beam', 'https://mainframeltda.com/wp-content/uploads/2019/04/Que_es_un_proyector_de_video-1100x825.jpg');

/* ------------------------ RECURSO ------------------------ */
INSERT INTO `recurso` (`k_idrecurso`, `n_nombrerecurso`, `n_descripcionrecurso`, `k_idtiporecurso`) VALUES ('1', 'Laboratorio 501', 'Laboratorio de fisica', '1');
INSERT INTO `recurso` (`k_idrecurso`, `n_nombrerecurso`, `n_descripcionrecurso`, `k_idtiporecurso`) VALUES ('2', 'Laboratorio de control', 'Laboratorio de control', '1');
INSERT INTO `recurso` (`k_idrecurso`, `n_nombrerecurso`, `n_descripcionrecurso`, `k_idtiporecurso`) VALUES ('3', 'Salon 204', 'Salon para clases', '2');
INSERT INTO `recurso` (`k_idrecurso`, `n_nombrerecurso`, `n_descripcionrecurso`, `k_idtiporecurso`) VALUES ('4', 'Salon 307', 'Salon para clases', '2');
INSERT INTO `recurso` (`k_idrecurso`, `n_nombrerecurso`, `n_descripcionrecurso`, `k_idtiporecurso`) VALUES ('5', 'Sala de informatica 701', 'Sala de informatica', '2');
INSERT INTO `recurso` (`k_idrecurso`, `n_nombrerecurso`, `n_descripcionrecurso`, `k_idtiporecurso`) VALUES ('6', 'Tablet M45', 'Tablet modelo M45', '3');
INSERT INTO `recurso` (`k_idrecurso`, `n_nombrerecurso`, `n_descripcionrecurso`, `k_idtiporecurso`) VALUES ('7', 'Portatil HP Pavilion', 'Portatil para prestamo', '4');
INSERT INTO `recurso` (`k_idrecurso`, `n_nombrerecurso`, `n_descripcionrecurso`, `k_idtiporecurso`) VALUES ('8', 'Video Beam Epson', 'Video beam para salones', '5');

/* ----------------------- ADMINISTRADOR ----------------------- */
INSERT INTO `administrador` (`k_idusuario`) VALUES ('1');

/* ------------------------ GESTIONAR ------------------------ */
INSERT INTO `gestionar` (`k_idusuario`, `k_idtiporecurso`) VALUES ('1', '1');
INSERT INTO `gestionar` (`k_idusuario`, `k_idtiporecurso`) VALUES ('1', '2');

/* ---------------------- CARACTERISTICAS ---------------------- */
INSERT INTO `caracteristicas` (`k_idcaracteristicas`, `n_descripcioncaracteristica`) VALUES ('1', 'Tiene aire acondicionado');
INSERT INTO `caracteristicas` (`k_idcaracteristicas`, `n_descripcioncaracteristica`) VALUES ('2', 'Tiene video beam');
INSERT INTO `caracteristicas` (`k_idcaracteristicas`, `n_descripcioncaracteristica`) VALUES ('3', 'Capacidad para 40 personas');
INSERT INTO `caracteristicas` (`k_idcaracteristicas`, `n_descripcioncaracteristica`) VALUES ('4', 'Tiene toma corrientes');

/* ---------------------- SER_CARACTERISADO ---------------------- */
INSERT INTO `ser_caracterisado` (`k_idrecurso`, `k_idcaracteristicas`) VALUES ('1', '1');
INSERT INTO `ser_caracterisado` (`k_idrecurso`, `k_idcaracteristicas`) VALUES ('1', '2');
INSERT INTO `ser_caracterisado` (`k_idrecurso`, `k_idcaracteristicas`) VALUES ('3', '3');
INSERT INTO `ser_caracterisado` (`k_idrecurso`, `k_idcaracteristicas`) VALUES ('6', '4');

/* ---------------------- HORARIO_LABORAL ---------------------- */
INSERT INTO `horario_laboral` (`k_idhorariolavoral`, `f_horainicio`, `f_horafinal`, `f_dia`) VALUES ('1', '06:00:00', '20:00:00', DATE_ADD(CURDATE(), INTERVAL 1 DAY));
INSERT INTO `horario_laboral` (`k_idhorariolavoral`, `f_horainicio`, `f_horafinal`, `f_dia`) VALUES ('2', '06:00:00', '20:00:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY));

/* -------------------------- TENER -------------------------- */
INSERT INTO `tener` (`k_idhorariolavoral`, `k_idusuario`) VALUES ('1', '1');

/* ---------------------- DISPONIBILIDAD ---------------------- */
/* Slots de MANANA (06:00 - 20:00) */
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('1', '06:00:00', '07:00:00', DATE_ADD(CURDATE(), INTERVAL 1 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('2', '07:00:00', '08:00:00', DATE_ADD(CURDATE(), INTERVAL 1 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('3', '08:00:00', '09:00:00', DATE_ADD(CURDATE(), INTERVAL 1 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('4', '09:00:00', '10:00:00', DATE_ADD(CURDATE(), INTERVAL 1 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('5', '10:00:00', '11:00:00', DATE_ADD(CURDATE(), INTERVAL 1 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('6', '11:00:00', '12:00:00', DATE_ADD(CURDATE(), INTERVAL 1 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('7', '12:00:00', '13:00:00', DATE_ADD(CURDATE(), INTERVAL 1 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('8', '13:00:00', '14:00:00', DATE_ADD(CURDATE(), INTERVAL 1 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('9', '14:00:00', '15:00:00', DATE_ADD(CURDATE(), INTERVAL 1 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('10', '15:00:00', '16:00:00', DATE_ADD(CURDATE(), INTERVAL 1 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('11', '16:00:00', '17:00:00', DATE_ADD(CURDATE(), INTERVAL 1 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('12', '17:00:00', '18:00:00', DATE_ADD(CURDATE(), INTERVAL 1 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('13', '18:00:00', '19:00:00', DATE_ADD(CURDATE(), INTERVAL 1 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('14', '19:00:00', '20:00:00', DATE_ADD(CURDATE(), INTERVAL 1 DAY));
/* Slots de PASADO MAÑANA (06:00 - 20:00) */
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('15', '06:00:00', '07:00:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('16', '07:00:00', '08:00:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('17', '08:00:00', '09:00:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('18', '09:00:00', '10:00:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('19', '10:00:00', '11:00:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('20', '11:00:00', '12:00:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('21', '12:00:00', '13:00:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('22', '13:00:00', '14:00:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('23', '14:00:00', '15:00:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('24', '15:00:00', '16:00:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('25', '16:00:00', '17:00:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('26', '17:00:00', '18:00:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('27', '18:00:00', '19:00:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY));
INSERT INTO `disponibilidad` (`k_iddisponibilidad`, `f_horainiciodisponibilidad`, `f_horafinaldisponibilidad`, `f_diadisponibilidad`) VALUES ('28', '19:00:00', '20:00:00', DATE_ADD(CURDATE(), INTERVAL 2 DAY));

/* -------------------------- POSEER -------------------------- */
/* Todos los recursos disponibles en todos los slots.           */
/* NOTA: el recurso 8 en el slot 11 (manana 16:00-17:00) NO se  */
/* inserta porque esa reserva ya existe (R-001).                */
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '1');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '1');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '1');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '1');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '1');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '1');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '1');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '1');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '2');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '2');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '2');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '2');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '2');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '2');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '2');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '2');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '3');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '3');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '3');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '3');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '3');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '3');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '3');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '3');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '4');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '4');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '4');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '4');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '4');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '4');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '4');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '4');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '5');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '5');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '5');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '5');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '5');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '5');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '5');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '5');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '6');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '6');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '6');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '6');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '6');
/* Recurso 6 en slot 6 (manana 11:00-12:00) reservado (R-005) */
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '6');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '6');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '7');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '7');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '7');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '7');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '7');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '7');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '7');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '7');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '8');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '8');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '8');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '8');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '8');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '8');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '8');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '8');
/* Slot 9 (manana 14:00-15:00): recurso 1 libre para probar POST /reservas */
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '9');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '9');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '9');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '9');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '9');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '9');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '9');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '9');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '10');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '10');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '10');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '10');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '10');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '10');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '10');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '10');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '11');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '11');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '11');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '11');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '11');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '11');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '11');
/* Recurso 8 en slot 11 (manana 16:00-17:00) reservado (R-001) */
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '12');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '12');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '12');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '12');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '12');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '12');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '12');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '12');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '13');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '13');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '13');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '13');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '13');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '13');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '13');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '13');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '14');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '14');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '14');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '14');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '14');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '14');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '14');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '14');
/* Slots de PASADO MAÑANA (15-28) disponibles para todos los recursos */
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '15');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '15');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '15');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '15');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '15');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '15');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '15');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '15');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '16');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '16');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '16');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '16');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '16');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '16');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '16');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '16');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '17');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '17');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '17');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '17');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '17');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '17');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '17');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '17');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '18');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '18');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '18');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '18');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '18');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '18');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '18');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '18');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '19');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '19');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '19');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '19');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '19');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '19');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '19');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '19');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '20');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '20');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '20');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '20');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '20');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '20');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '20');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '20');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '21');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '21');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '21');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '21');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '21');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '21');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '21');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '21');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '22');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '22');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '22');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '22');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '22');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '22');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '22');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '22');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '23');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '23');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '23');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '23');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '23');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '23');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '23');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '23');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '24');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '24');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '24');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '24');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '24');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '24');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '24');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '24');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '25');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '25');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '25');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '25');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '25');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '25');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '25');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '25');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '26');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '26');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '26');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '26');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '26');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '26');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '26');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '26');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '27');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '27');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '27');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '27');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '27');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '27');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '27');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '27');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('1', '28');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('2', '28');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('3', '28');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('4', '28');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('5', '28');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('6', '28');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('7', '28');
INSERT INTO `poseer` (`k_idrecurso`, `k_iddisponibilidad`) VALUES ('8', '28');

/* ------------------------- RESERVA ------------------------- */
/* R-001: reservada para manana -> probar PATCH /reservas/{id}/cancelar */
INSERT INTO `reserva` (`k_idreserva`, `f_horainicioreserva`, `f_horafinalreserva`, `f_fechareserva`, `n_estadoreserva`, `k_idusuario`, `k_idrecurso`, `n_calificacion`) VALUES ('R-001', '16:00:00', '17:00:00', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'reservado', '2', '8', 0);
/* R-002: finalizada sin calificar -> probar PATCH /reservas/{id}/calificar */
INSERT INTO `reserva` (`k_idreserva`, `f_horainicioreserva`, `f_horafinalreserva`, `f_fechareserva`, `n_estadoreserva`, `k_idusuario`, `k_idrecurso`, `n_calificacion`) VALUES ('R-002', '10:00:00', '11:00:00', DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'finalizado', '2', '2', 0);
/* R-003: cancelada */
INSERT INTO `reserva` (`k_idreserva`, `f_horainicioreserva`, `f_horafinalreserva`, `f_fechareserva`, `n_estadoreserva`, `k_idusuario`, `k_idrecurso`, `n_calificacion`) VALUES ('R-003', '09:00:00', '10:00:00', DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'cancelado', '2', '3', 0);
/* R-004: finalizada y calificada */
INSERT INTO `reserva` (`k_idreserva`, `f_horainicioreserva`, `f_horafinalreserva`, `f_fechareserva`, `n_estadoreserva`, `k_idusuario`, `k_idrecurso`, `n_calificacion`) VALUES ('R-004', '16:00:00', '17:00:00', DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'finalizado', '3', '4', 5);
/* R-005: reservada de la usuaria Maria (id 3) para manana */
INSERT INTO `reserva` (`k_idreserva`, `f_horainicioreserva`, `f_horafinalreserva`, `f_fechareserva`, `n_estadoreserva`, `k_idusuario`, `k_idrecurso`, `n_calificacion`) VALUES ('R-005', '11:00:00', '12:00:00', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'reservado', '3', '6', 0);
