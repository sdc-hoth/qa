-- In terminal:
-- DROP DATABASE IF EXISTS qa;
-- CREATE DATABASE qa;
-- \c qa;
-- \i Schema.sql;


-- DROP TABLE IF EXISTS questions CASCADE;
CREATE TABLE questions (
  id INT PRIMARY KEY,
  product_id INT,
  body VARCHAR(255),
  date_written VARCHAR(255),
  asker_name VARCHAR(255),
  asker_email VARCHAR(255),
  reported INT DEFAULT 0,
  helpful INT
);

-- DROP TABLE IF EXISTS answers CASCADE;
CREATE TABLE answers (
  id INT PRIMARY KEY,
  question_id INT REFERENCES questions (id),
  body VARCHAR(255),
  date_written VARCHAR(255),
  answerer_name VARCHAR(255),
  answerer_email VARCHAR(255),
  reported INT DEFAULT 0,
  helpful INT
);

-- DROP TABLE IF EXISTS photos CASCADE;
CREATE TABLE photos (
  id INT PRIMARY KEY,
  answer_id INT REFERENCES answers (id),
  url VARCHAR(255)
);


--In terminal:
--run each copy command in ETL.sql separately
