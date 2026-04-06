/**
 * Employee routes - VULNERABLE
 * - SQL Injection in search (Vuln #1)
 * - IDOR: any user can GET/PUT any employee by id (Vuln #6)
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

function getUserId(req) {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
}

// INTENTIONAL: Raw SQL concatenation - SQL Injection (Vuln #1)
// GET /api/employees/search?name=
router.get('/search', async (req, res) => {
  try {
    const name = req.query.name || '';
    const query = `SELECT id, name, email, role, department, salary, created_at FROM users WHERE name ILIKE '%${name}%'`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// INTENTIONAL: No check that req.user.id === id - IDOR (Vuln #6)
// GET /api/employees/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, name, email, role, department, salary, created_at FROM users WHERE id = $1',
      [id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// INTENTIONAL: No ownership/role check - IDOR
// PUT /api/employees/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, salary } = req.body;
    const result = await pool.query(
      'UPDATE users SET name = COALESCE($1, name), department = COALESCE($2, department), salary = COALESCE($3, salary) WHERE id = $4 RETURNING id, name, email, role, department, salary',
      [name, department, salary, id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
