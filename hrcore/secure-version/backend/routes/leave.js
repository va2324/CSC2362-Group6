/**
 * Leave routes - VULNERABLE
 * - Notes stored and returned unsanitized (Stored XSS - Vuln #3)
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

// POST /api/leave - submit request (notes not sanitized - XSS)
router.post('/', async (req, res) => {
  try {
    const uid = getUserId(req);
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });
    const { type, start_date, end_date, notes } = req.body;
    const result = await pool.query(
      'INSERT INTO leave_requests (user_id, type, start_date, end_date, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [uid, type, start_date, end_date, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leave - list current user's leave requests (for XSS PoC: notes rendered unsanitized in UI)
router.get('/', async (req, res) => {
  try {
    const uid = getUserId(req);
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });
    const result = await pool.query(
      'SELECT * FROM leave_requests WHERE user_id = $1 ORDER BY created_at DESC',
      [uid]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leave/:id
router.get('/:id', async (req, res) => {
  try {
    const uid = getUserId(req);
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM leave_requests WHERE id = $1',
      [id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    const row = result.rows[0];
    if (row.user_id !== uid) return res.status(403).json({ error: 'Forbidden' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
