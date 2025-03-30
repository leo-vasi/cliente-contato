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


INSERT INTO cliente (nome, cpf, data_nascimento, endereco) VALUES
('Ana Souza', '123.456.789-01', '1990-05-20', 'Rua das Palmeiras, 123'),
('Bruno Lima', '987.654.321-09', '1985-08-15', 'Avenida Brasil, 456'),
('Carla Mendes', '321.654.987-05', '2000-11-10', 'Rua dos Pinheiros, 789'),
('Daniel Oliveira', '456.789.123-02', '1978-03-25', 'Rua das Flores, 100'),
('Elena Santos', '654.321.987-06', '1995-07-12', 'Avenida Paulista, 2000'),
('Fernando Costa', '789.123.456-03', '1982-09-30', 'Rua das Acácias, 50');

INSERT INTO contato (cliente_id, tipo, valor, observacao) VALUES
-- Ana Souza (ID 1)
(1, 'Celular', '(11) 98765-4321', 'WhatsApp disponível'),
(1, 'Email', 'ana.souza@empresa.com', 'E-mail corporativo'),
(1, 'Telefone', '(11) 4002-8922', 'Ramal 221'),

-- Bruno Lima (ID 2)
(2, 'Celular', '(11) 91234-5678', 'Recados após 18h'),
(2, 'Email', 'bruno.lima@gmail.com', NULL),
(2, 'Telefone', '(11) 2503-7890', 'Casa'),

-- Carla Mendes (ID 3)
(3, 'Celular', '(11) 99876-5432', 'Não ligar de manhã'),
(3, 'Email', 'carla.m@faculdade.edu', 'Acadêmico'),
(3, 'Telefone', '(11) 3105-6789', 'Trabalho'),

-- Daniel Oliveira (ID 4)
(4, 'Celular', '(11) 94567-8901', 'Só mensagem'),
(4, 'Email', 'daniel.oliveira@outlook.com', 'Pessoal'),
(4, 'Telefone', '(11) 2201-3456', 'Casa'),

-- Elena Santos (ID 5)
(5, 'Celular', '(11) 97890-1234', 'WhatsApp'),
(5, 'Email', 'elena.santos@startup.com.br', NULL),
(5, 'Telefone', '(11) 3402-5678', 'Recepção'),

-- Fernando Costa (ID 6)
(6, 'Celular', '(11) 92345-6789', 'Viagens'),
(6, 'Email', 'fernando.costa@consultoria.com', 'Cliente VIP'),
(6, 'Telefone', '(11) 2103-4567', 'Escritório');
