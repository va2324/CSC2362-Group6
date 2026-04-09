/**
 * Admin routes - SECURE
 * FIXED: Implemented role checks - only users with 'admin' role can call these routes (Vuln #2 Fixed - Broken Access Control)
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

// No admin middleware - anyone with valid JWT can access

// GET /api/admin/all-employees
router.get('/all-employees', async (req, res) => {
  try {
    if (!getUserId(req) || !getRole(req)) return res.status(401).json({ error: 'Unauthorized' });
    let user_role = getRole(req);
    if (user_role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const result = await pool.query(
      'SELECT id, name, email, role, department, salary, created_at FROM users ORDER BY id'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/promote/:id
router.put('/promote/:id', async (req, res) => {
  try {
    if (!getUserId(req)) return res.status(401).json({ error: 'Unauthorized' });
    let user_role = getRole(req);
    if (user_role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { id } = req.params;
    const { role } = req.body;
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role, department, salary',
      [role || 'admin', id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/employee/:id
router.delete('/employee/:id', async (req, res) => {
  try {
    if (!getUserId(req)) return res.status(401).json({ error: 'Unauthorized' });
    let user_role = getRole(req);
    if (user_role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ deleted: true, id: parseInt(id, 10) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
