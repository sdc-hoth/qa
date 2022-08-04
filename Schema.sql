-- In terminal:
-- DROP DATABASE IF EXISTS qa;
-- CREATE DATABASE qa;
-- \c qa;
-- \i Schema.sql;


CREATE TABLE questions (
  question_id INT SERIAL PRIMARY KEY,
  product_id INT,
  question_body VARCHAR(255),
  question_date VARCHAR(255),
  asker_name VARCHAR(255),
  asker_email VARCHAR(255),
  reported BOOLEAN,
  question_helpfulness INT
);

CREATE TABLE answers (
  answer_id INT SERIAL PRIMARY KEY,
  question_id INT REFERENCES questions (id),
  body VARCHAR(255),
  date VARCHAR(255),
  answerer_name VARCHAR(255),
  answerer_email VARCHAR(255),
  reported BOOLEAN,
  helpfulness INT
);

CREATE TABLE photos (
  id INT PRIMARY KEY,
  answer_id INT REFERENCES answers (id),
  url VARCHAR(255)
);


--In terminal:
--run each copy command in ETL.sql separately
