-- ============================================================
-- V2: Agregar columna de rol al usuario
-- ============================================================

ALTER TABLE `usuario` ADD COLUMN `n_role` VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER';
