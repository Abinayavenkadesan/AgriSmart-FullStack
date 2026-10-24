CREATE DATABASE IF NOT EXISTS agrismart CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agrismart;

CREATE TABLE IF NOT EXISTS crops (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    variety VARCHAR(120) NOT NULL,
    area DOUBLE NOT NULL,
    stage VARCHAR(40) NOT NULL,
    water VARCHAR(80) DEFAULT 'Not logged',
    health VARCHAR(40) DEFAULT 'Healthy',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO crops (name, variety, area, stage, water, health) VALUES
('Tomato', 'Arka Rakshak', 1.2, 'Flowering', 'Today', 'Healthy'),
('Paddy', 'ADT  rice', 2.5, 'Vegetative', 'Yesterday', 'Healthy'),
('Chilli', 'K1', 0.8, 'Fruiting', '2 days ago', 'Needs attention'),
('Groundnut', 'TMV 7', 1.4, 'Seedling', 'Today', 'Healthy');
