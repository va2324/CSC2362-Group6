/**
 * Employee routes - SECURE
 * - SQL Injection in search prevented through input validation (Vuln #1 Fixed)
 * - IDOR: users cannot GET/PUT any employee profiles except their own (Vuln #6 Fixed)
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

function getRole(req) {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  if(!token) return null;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    return user.role;
  } catch {
    return null;
  }
}

// FIXED: SQL input is validated & returns Error 400 - SQL Injection (Vuln #1 Fixed)
// GET /api/employees/search?name=
router.get('/search', async (req, res) => {
  try {
    const name = req.query.name || '';
    if(name.includes("'") || name.includes('"') || name.includes("=") || name.includes("--") || name.includes("#")) return res.status(400).json({error: 'Invalid input'});
    const query = `SELECT id, name, email, role, department, salary, created_at FROM users WHERE name ILIKE '%${name}%'`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FIXED: Route checks that req.user.id === id - IDOR (Vuln #6 Fixed)
// GET /api/employees/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = getUserId(req);
    const user_role = getRole(req);
    if (user_id !== parseInt(id) && user_role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
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

// FIXED: Route checks for ownership & role - IDOR
// PUT /api/employees/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = getUserId(req);
    const user_role = getRole(req);
    if (user_id !== parseInt(id) && user_role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
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
