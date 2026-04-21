/**
 * Document routes - basic upload/list
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
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

// GET /api/documents - list current user's documents
router.get('/', async (req, res) => {
  try {
    const uid = getUserId(req);
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });
    const result = await pool.query(
      'SELECT id, filename, filepath, uploaded_at FROM documents WHERE user_id = $1 ORDER BY uploaded_at DESC',
      [uid]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/documents - upload (store metadata; file stored at filepath)
router.post('/', async (req, res) => {
  try {
    const uid = getUserId(req);
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });
    const { filename, filepath } = req.body;
    if (!filename || !filepath) return res.status(400).json({ error: 'Filename and Filepath Required' });
    // const base = path.resolve('/allowed/uploads');
    // const safePath = path.resolve(base, filepath);
    // const relative = path.relative(base, safePath);
    if (filepath.startsWith('..') || path.isAbsolute(filepath)) return res.status(400).json({ error: 'Invalid path' });
    const result = await pool.query(
      'INSERT INTO documents (user_id, filename, filepath) VALUES ($1, $2, $3) RETURNING *',
      [uid, filename, filepath]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
