/**
 * Auth routes - VULNERABLE
 * - Plaintext/MD5 password storage
 * - JWT secret hardcoded
 * - Role in cookie (client can tamper)
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const router = express.Router();

// INTENTIONAL: Hardcoded JWT secret (Vuln #5)
const JWT_SECRET = process.env.JWT_SECRET;

// INTENTIONAL: Store password in plaintext or weak hash (Vuln #4)
// Using plaintext for demo; could use MD5 in DB
function hashPassword(plain) {
  return plain; // no hashing - plaintext
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'employee', department, salary } = req.body;
    const hashed = hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, department, salary) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role, department, salary, created_at',
      [name, email, hashed, role, department || null, salary || null]
    );
    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    // INTENTIONAL: Put role in cookie so client can edit (Vuln #7)
    res.cookie('token', token, { httpOnly: false });
    res.cookie('role', user.role, { httpOnly: false });
    res.cookie('userId', String(user.id), { httpOnly: false });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department, salary: user.salary }, token });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Email already registered' });
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      'SELECT id, name, email, password, role, department, salary FROM users WHERE email = $1',
      [email]
    );
    const user = result.rows[0];
    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('token', token, { httpOnly: false });
    res.cookie('role', user.role, { httpOnly: false });
    res.cookie('userId', String(user.id), { httpOnly: false });
    const { password: _, ...safe } = user;
    res.json({ user: safe, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('role');
  res.clearCookie('userId');
  res.json({ ok: true });
});

module.exports = router;
