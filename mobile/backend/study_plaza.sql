-- ===============================================
-- INICIALIZAÇÃO
-- ===============================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `study_plaza`
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE `study_plaza`;


-- ===============================================
-- Tabela: usuarios
-- ===============================================

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,      -- Suporta hash (ex: bcrypt)
    tipo_usuario ENUM('estudante', 'professor', 'admin')
        NOT NULL DEFAULT 'estudante'
) ENGINE=InnoDB;

INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES
('Admin', 'admin@gmail.com', '147258', 'admin');


-- ===============================================
-- Tabela: grupos
-- ===============================================

CREATE TABLE grupos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    descricao VARCHAR(300),
    privado TINYINT(1) NOT NULL DEFAULT 0,
    criado_por INT NOT NULL,
    data_criacao DATE DEFAULT CURRENT_DATE,
    idioma ENUM('português', 'inglês')
        NOT NULL DEFAULT 'português',
    ativo TINYINT(1) NOT NULL DEFAULT 1,
   
    FOREIGN KEY (criado_por)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;


-- ===============================================
-- Tabela: usuarios_grupos (membros de grupos)
-- ===============================================

CREATE TABLE usuarios_grupos (
    id_usuario INT NOT NULL,
    id_grupo INT NOT NULL,
    papel ENUM('membro', 'moderador', 'admin') DEFAULT 'membro',

    PRIMARY KEY (id_usuario, id_grupo),

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    FOREIGN KEY (id_grupo)
        REFERENCES grupos(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;


-- ===============================================
-- Tabela: cursos
-- ===============================================

CREATE TABLE cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao VARCHAR(500),
    url VARCHAR(255) NOT NULL,
    plataforma VARCHAR(100),
    modalidade VARCHAR(50),
    duracao_semestres INT NOT NULL -- Otimizado para formato numérico
) ENGINE=InnoDB;


-- ===============================================
-- Inserts iniciais (cursos)
-- ===============================================

INSERT INTO cursos (titulo, descricao, url, plataforma, modalidade, duracao_semestres) VALUES
('Agronegócio',
 'Forma profissionais aptos a gerenciar a cadeia produtiva do agronegócio, desde a produção até a comercialização e logística.',
 'https://fatectq.cps.sp.gov.br',
 'Fatec Taquaritinga',
 'Presencial',
 6),

('Análise e Desenvolvimento de Software',
 'Prepare-se para criar, analisar, projetar, implementar e gerenciar sistemas de informação e soluções de software.',
 'https://fatectq.cps.sp.gov.br',
 'Fatec Taquaritinga',
 'Presencial',
 6),

('Análise e Desenvolvimento de Software - AMS',
 'Foco em Análise, Modelagem e Simulação de Sistemas, integrando o desenvolvimento de software com técnicas avançadas de TI.',
 'https://fatectq.cps.sp.gov.br',
 'Fatec Taquaritinga',
 'Presencial',
 4),

('Gestão Empresarial - EAD',
 'Curso a distância para formar líderes com visão estratégica e gerencial, prontos para atuar em diversos setores.',
 'https://fatectq.cps.sp.gov.br',
 'Fatec Taquaritinga',
 'EAD (Educação a Distância)',
 6),    

('Gestão da Produção Industrial',
 'Otimize processos, gerencie recursos e melhore a produtividade em ambientes industriais.',
 'https://fatectq.cps.sp.gov.br',
 'Fatec Taquaritinga',
 'Presencial',
 6),

('Sistemas para Internet',
 'Foque no desenvolvimento de aplicações web, websites e sistemas interativos.',
 'https://fatectq.cps.sp.gov.br',
 'Fatec Taquaritinga',
 'Presencial',
 6);


-- ===============================================
-- Tabela: inscricoes
-- ===============================================

CREATE TABLE inscricoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_curso INT NOT NULL,

    UNIQUE (id_usuario, id_curso), -- Evita duplicidade de inscrição do mesmo aluno no mesmo curso

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    FOREIGN KEY (id_curso)
        REFERENCES cursos(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

COMMIT;

-- ===============================================
-- Tabela: mensagens
-- ===============================================

CREATE TABLE mensagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_grupo INT NOT NULL,
    mensagem TEXT NOT NULL,
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    FOREIGN KEY (id_grupo)
        REFERENCES grupos(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE VIEW vw_inscricoes AS
SELECT
    u.id AS id_usuario,
    u.nome AS nome_usuario,
    c.id AS id_curso,
    c.titulo AS curso
FROM inscricoes i
INNER JOIN usuarios u
    ON i.id_usuario = u.id
INNER JOIN cursos c
    ON i.id_curso = c.id;   

    CREATE VIEW vw_grupos AS
SELECT
    g.id,
    g.nome AS grupo,
    g.descricao,
    u.nome AS criador,
    g.data_criacao,
    g.idioma
FROM grupos g
INNER JOIN usuarios u
    ON g.criado_por = u.id;
