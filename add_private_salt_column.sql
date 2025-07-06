-- Adicionar coluna private_salt à tabela users
ALTER TABLE users ADD COLUMN private_salt VARCHAR(255) NULL; 