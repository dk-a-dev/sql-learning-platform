-- ═══════════════════════════════════════════════════════════
-- CipherSQLStudio – PostgreSQL Sandbox Seed Data
-- This runs automatically when the postgres container starts
-- ═══════════════════════════════════════════════════════════

-- ─── Assignment 1: Basic SELECT ──────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  email VARCHAR(150),
  join_date DATE NOT NULL
);

INSERT INTO users (name, email, join_date) VALUES
  ('Alice Johnson',   'alice@example.com',   '2022-05-10'),
  ('Bob Williams',    'bob@example.com',     '2023-02-15'),
  ('Charlie Brown',   'charlie@example.com', '2023-11-20'),
  ('Diana Prince',    'diana@example.com',   '2021-08-01'),
  ('Ethan Hunt',      'ethan@example.com',   '2024-01-05');

-- ─── Assignment 2: Filtering with WHERE ─────────────────────
CREATE TABLE IF NOT EXISTS products (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50)
);

INSERT INTO products (name, price, category) VALUES
  ('Mechanical Keyboard',  129.99, 'Peripherals'),
  ('Wireless Mouse',        24.99, 'Peripherals'),
  ('4K Monitor',           349.99, 'Displays'),
  ('USB-C Hub',             45.00, 'Accessories'),
  ('Webcam HD',             89.50, 'Peripherals'),
  ('Laptop Stand',          34.99, 'Accessories');

-- ─── Assignment 3: Joining Tables ───────────────────────────
CREATE TABLE IF NOT EXISTS departments (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  department_id INT REFERENCES departments(id),
  salary        DECIMAL(10,2) NOT NULL,
  hire_date     DATE NOT NULL
);

INSERT INTO departments (name) VALUES
  ('Engineering'),
  ('Marketing'),
  ('Sales'),
  ('HR');

INSERT INTO employees (name, department_id, salary, hire_date) VALUES
  ('John Doe',     1, 95000.00, '2020-03-15'),
  ('Jane Smith',   1, 105000.00, '2019-07-22'),
  ('Mike Ross',    2, 72000.00, '2021-01-10'),
  ('Rachel Zane',  3, 68000.00, '2022-06-18'),
  ('Harvey Spec',  1, 120000.00, '2018-11-05'),
  ('Louis Litt',   4, 85000.00, '2020-09-30');

-- ─── Assignment 4: GROUP BY and Aggregates ──────────────────
CREATE TABLE IF NOT EXISTS orders (
  id          SERIAL PRIMARY KEY,
  customer_id INT NOT NULL,
  product_id  INT NOT NULL,
  quantity    INT NOT NULL,
  order_date  DATE NOT NULL
);

INSERT INTO orders (customer_id, product_id, quantity, order_date) VALUES
  (1, 1, 2, '2024-01-05'),
  (2, 3, 1, '2024-01-07'),
  (1, 2, 5, '2024-01-10'),
  (3, 1, 1, '2024-02-01'),
  (2, 4, 3, '2024-02-14'),
  (4, 5, 2, '2024-03-01'),
  (1, 3, 1, '2024-03-10'),
  (5, 2, 4, '2024-03-15');

-- ─── Assignment 5: Subqueries ───────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  grade CHAR(1) NOT NULL
);

CREATE TABLE IF NOT EXISTS scores (
  id         SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(id),
  subject    VARCHAR(50) NOT NULL,
  score      INT NOT NULL
);

INSERT INTO students (name, grade) VALUES
  ('Amy Chen',      'A'),
  ('Brian Lee',     'B'),
  ('Cathy Davis',   'A'),
  ('Derek Wang',    'C'),
  ('Eva Martinez',  'B');

INSERT INTO scores (student_id, subject, score) VALUES
  (1, 'Math',    95),
  (1, 'Science', 88),
  (2, 'Math',    72),
  (2, 'Science', 65),
  (3, 'Math',    91),
  (3, 'Science', 94),
  (4, 'Math',    58),
  (4, 'Science', 62),
  (5, 'Math',    83),
  (5, 'Science', 79);
