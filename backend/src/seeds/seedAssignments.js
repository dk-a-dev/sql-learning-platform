/**
 * MongoDB Seed Script
 * Run: node src/seeds/seedAssignments.js
 * Seeds the MongoDB assignments collection with all 5 assignments
 * matching the PostgreSQL sandbox tables.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Assignment = require('../models/Assignment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ciphersqlstudio';

const assignments = [
    {
        title: 'Basic SELECT Statements',
        difficulty: 'Easy',
        description: 'Learn how to retrieve data from a single table using SELECT.',
        question: 'Write a query to find all users who joined after 2023-01-01.',
        schemaText: `TABLE: users
┌────┬──────────────────┬───────────────────────┬────────────┐
│ id │ name             │ email                 │ join_date  │
├────┼──────────────────┼───────────────────────┼────────────┤
│  1 │ Alice Johnson    │ alice@example.com     │ 2022-05-10 │
│  2 │ Bob Williams     │ bob@example.com       │ 2023-02-15 │
│  3 │ Charlie Brown    │ charlie@example.com   │ 2023-11-20 │
│  4 │ Diana Prince     │ diana@example.com     │ 2021-08-01 │
│  5 │ Ethan Hunt       │ ethan@example.com     │ 2024-01-05 │
└────┴──────────────────┴───────────────────────┴────────────┘`,
        solutionQuery: "SELECT * FROM users WHERE join_date > '2023-01-01';",
    },
    {
        title: 'Filtering with WHERE',
        difficulty: 'Easy',
        description: 'Filter records from a table using the WHERE clause.',
        question: 'Find all products with a price greater than 50.',
        schemaText: `TABLE: products
┌────┬──────────────────────┬────────┬──────────────┐
│ id │ name                 │ price  │ category     │
├────┼──────────────────────┼────────┼──────────────┤
│  1 │ Mechanical Keyboard  │ 129.99 │ Peripherals  │
│  2 │ Wireless Mouse       │  24.99 │ Peripherals  │
│  3 │ 4K Monitor           │ 349.99 │ Displays     │
│  4 │ USB-C Hub            │  45.00 │ Accessories  │
│  5 │ Webcam HD            │  89.50 │ Peripherals  │
│  6 │ Laptop Stand         │  34.99 │ Accessories  │
└────┴──────────────────────┴────────┴──────────────┘`,
        solutionQuery: 'SELECT * FROM products WHERE price > 50;',
    },
    {
        title: 'Joining Tables',
        difficulty: 'Medium',
        description: 'Combine data from multiple tables using INNER JOIN.',
        question: 'List all employees along with their department name.',
        schemaText: `TABLE: departments
┌────┬──────────────┐
│ id │ name         │
├────┼──────────────┤
│  1 │ Engineering  │
│  2 │ Marketing    │
│  3 │ Sales        │
│  4 │ HR           │
└────┴──────────────┘

TABLE: employees
┌────┬──────────────┬───────────────┬───────────┬────────────┐
│ id │ name         │ department_id │ salary    │ hire_date  │
├────┼──────────────┼───────────────┼───────────┼────────────┤
│  1 │ John Doe     │ 1             │ 95000.00  │ 2020-03-15 │
│  2 │ Jane Smith   │ 1             │ 105000.00 │ 2019-07-22 │
│  3 │ Mike Ross    │ 2             │ 72000.00  │ 2021-01-10 │
│  4 │ Rachel Zane  │ 3             │ 68000.00  │ 2022-06-18 │
│  5 │ Harvey Spec  │ 1             │ 120000.00 │ 2018-11-05 │
│  6 │ Louis Litt   │ 4             │ 85000.00  │ 2020-09-30 │
└────┴──────────────┴───────────────┴───────────┴────────────┘`,
        solutionQuery: 'SELECT e.name, d.name AS department FROM employees e INNER JOIN departments d ON e.department_id = d.id;',
    },
    {
        title: 'GROUP BY and Aggregates',
        difficulty: 'Medium',
        description: 'Use GROUP BY with aggregate functions like COUNT, SUM, AVG.',
        question: 'Find the total quantity ordered by each customer.',
        schemaText: `TABLE: orders
┌────┬─────────────┬────────────┬──────────┬────────────┐
│ id │ customer_id │ product_id │ quantity │ order_date │
├────┼─────────────┼────────────┼──────────┼────────────┤
│  1 │ 1           │ 1          │ 2        │ 2024-01-05 │
│  2 │ 2           │ 3          │ 1        │ 2024-01-07 │
│  3 │ 1           │ 2          │ 5        │ 2024-01-10 │
│  4 │ 3           │ 1          │ 1        │ 2024-02-01 │
│  5 │ 2           │ 4          │ 3        │ 2024-02-14 │
│  6 │ 4           │ 5          │ 2        │ 2024-03-01 │
│  7 │ 1           │ 3          │ 1        │ 2024-03-10 │
│  8 │ 5           │ 2          │ 4        │ 2024-03-15 │
└────┴─────────────┴────────────┴──────────┴────────────┘`,
        solutionQuery: 'SELECT customer_id, SUM(quantity) AS total_quantity FROM orders GROUP BY customer_id;',
    },
    {
        title: 'Subqueries',
        difficulty: 'Hard',
        description: 'Use subqueries to solve complex data retrieval problems.',
        question: 'Find students who scored above the average score in Math.',
        schemaText: `TABLE: students
┌────┬───────────────┬───────┐
│ id │ name          │ grade │
├────┼───────────────┼───────┤
│  1 │ Amy Chen      │ A     │
│  2 │ Brian Lee     │ B     │
│  3 │ Cathy Davis   │ A     │
│  4 │ Derek Wang    │ C     │
│  5 │ Eva Martinez  │ B     │
└────┴───────────────┴───────┘

TABLE: scores
┌────┬────────────┬─────────┬───────┐
│ id │ student_id │ subject │ score │
├────┼────────────┼─────────┼───────┤
│  1 │ 1          │ Math    │ 95    │
│  2 │ 1          │ Science │ 88    │
│  3 │ 2          │ Math    │ 72    │
│  4 │ 2          │ Science │ 65    │
│  5 │ 3          │ Math    │ 91    │
│  6 │ 3          │ Science │ 94    │
│  7 │ 4          │ Math    │ 58    │
│  8 │ 4          │ Science │ 62    │
│  9 │ 5          │ Math    │ 83    │
│ 10 │ 5          │ Science │ 79    │
└────┴────────────┴─────────┴───────┘`,
        solutionQuery: "SELECT s.name, sc.score FROM students s JOIN scores sc ON s.id = sc.student_id WHERE sc.subject = 'Math' AND sc.score > (SELECT AVG(score) FROM scores WHERE subject = 'Math');",
    },
    {
        title: 'Customer Order History',
        difficulty: 'Medium',
        description: 'Find the total amount spent by each customer, alongside their name.',
        question: 'List the names of all customers and the total sum of the quantities they have ordered. Only include customers who have placed at least one order.',
        schemaText: `TABLE: users
┌────┬──────────────────┬───────────────────────┬────────────┐
│ id │ name             │ email                 │ join_date  │
├────┼──────────────────┼───────────────────────┼────────────┤
│  1 │ Alice Johnson    │ alice@example.com     │ 2022-05-10 │
│  2 │ Bob Williams     │ bob@example.com       │ 2023-02-15 │
│  3 │ Charlie Brown    │ charlie@example.com   │ 2023-11-20 │
│  4 │ Diana Prince     │ diana@example.com     │ 2021-08-01 │
│  5 │ Ethan Hunt       │ ethan@example.com     │ 2024-01-05 │
└────┴──────────────────┴───────────────────────┴────────────┘

TABLE: orders
┌────┬─────────────┬────────────┬──────────┬────────────┐
│ id │ customer_id │ product_id │ quantity │ order_date │
├────┼─────────────┼────────────┼──────────┼────────────┤
│  1 │ 1           │ 1          │ 2        │ 2024-01-05 │
│  2 │ 2           │ 3          │ 1        │ 2024-01-07 │
│  3 │ 1           │ 2          │ 5        │ 2024-01-10 │
│  4 │ 3           │ 1          │ 1        │ 2024-02-01 │
│  5 │ 2           │ 4          │ 3        │ 2024-02-14 │
│  6 │ 4           │ 5          │ 2        │ 2024-03-01 │
│  7 │ 1           │ 3          │ 1        │ 2024-03-10 │
│  8 │ 5           │ 2          │ 4        │ 2024-03-15 │
└────┴─────────────┴────────────┴──────────┴────────────┘`,
        solutionQuery: "SELECT u.name, SUM(o.quantity) AS total_quantity FROM users u JOIN orders o ON u.id = o.customer_id GROUP BY u.id, u.name;",
    },
    {
        title: 'Product Sales Analysis',
        difficulty: 'Medium',
        description: 'Find products that have been ordered more than a specific amount.',
        question: 'Write a query to find the names of products that have a total ordered quantity strictly greater than 3. Include the total quantity ordered.',
        schemaText: `TABLE: products
┌────┬──────────────────────┬────────┬──────────────┐
│ id │ name                 │ price  │ category     │
├────┼──────────────────────┼────────┼──────────────┤
│  1 │ Mechanical Keyboard  │ 129.99 │ Peripherals  │
│  2 │ Wireless Mouse       │  24.99 │ Peripherals  │
│  3 │ 4K Monitor           │ 349.99 │ Displays     │
│  4 │ USB-C Hub            │  45.00 │ Accessories  │
│  5 │ Webcam HD            │  89.50 │ Peripherals  │
│  6 │ Laptop Stand         │  34.99 │ Accessories  │
└────┴──────────────────────┴────────┴──────────────┘

TABLE: orders
┌────┬─────────────┬────────────┬──────────┬────────────┐
│ id │ customer_id │ product_id │ quantity │ order_date │
├────┼─────────────┼────────────┼──────────┼────────────┤
│  1 │ 1           │ 1          │ 2        │ 2024-01-05 │
│  3 │ 1           │ 2          │ 5        │ 2024-01-10 │
│  4 │ 3           │ 1          │ 1        │ 2024-02-01 │
...`,
        solutionQuery: "SELECT p.name, SUM(o.quantity) as total_ordered FROM products p JOIN orders o ON p.id = o.product_id GROUP BY p.id, p.name HAVING SUM(o.quantity) > 3;",
    },
    {
        title: 'Department Top Earners',
        difficulty: 'Hard',
        description: 'Find the employees with the highest salary in each department.',
        question: 'Write a query to find the employee name, department name, and salary of the highest paid employee in every department.',
        schemaText: `TABLE: departments
┌────┬──────────────┐
│ id │ name         │
├────┼──────────────┤
│  1 │ Engineering  │
│  2 │ Marketing    │
│  3 │ Sales        │
│  4 │ HR           │
└────┴──────────────┘

TABLE: employees
┌────┬──────────────┬───────────────┬───────────┬────────────┐
│ id │ name         │ department_id │ salary    │ hire_date  │
├────┼──────────────┼───────────────┼───────────┼────────────┤
│  1 │ John Doe     │ 1             │ 95000.00  │ 2020-03-15 │
│  2 │ Jane Smith   │ 1             │ 105000.00 │ 2019-07-22 │
│  3 │ Mike Ross    │ 2             │ 72000.00  │ 2021-01-10 │
│  5 │ Harvey Spec  │ 1             │ 120000.00 │ 2018-11-05 │
└────┴──────────────┴───────────────┴───────────┴────────────┘`,
        solutionQuery: "SELECT d.name AS department, e.name AS employee, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.salary = (SELECT MAX(salary) FROM employees e2 WHERE e2.department_id = e.department_id);",
    },
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        await Assignment.deleteMany({});
        console.log('Cleared existing assignments');

        const result = await Assignment.insertMany(assignments);
        console.log(`Seeded ${result.length} assignments`);

        await mongoose.disconnect();
        console.log('Done. Disconnected.');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
}

seed();
