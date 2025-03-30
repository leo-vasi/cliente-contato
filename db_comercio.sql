CREATE DATABASE db_comercio;
USE db_comercio;

CREATE TABLE cliente (
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    data_nascimento DATE NOT NULL,
    endereco VARCHAR(255)
);


CREATE TABLE contato (
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    cliente_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    valor VARCHAR(100) NOT NULL,
    observacao VARCHAR(255) NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE
);