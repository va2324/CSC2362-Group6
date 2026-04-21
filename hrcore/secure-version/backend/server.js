const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const leaveRoutes = require('./routes/leave');
const adminRoutes = require('./routes/admin');
const documentRoutes = require('./routes/documents');

const path = require('path');
const app = express();
const PORT = process.env.PORT;

const helmet = require('helmet'); // Implemented security headers
app.use(helmet());

app.use(cors({ origin: true, credentials: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

const rateLimit = require('express-rate-limit'); // Added rate limits
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }); // Only 5 login attempts allowed in 15 minutes
app.use('/api/auth/login', loginLimiter);

app.use('/api', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/documents', documentRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`HRCore backend (secure) running on http://localhost:${PORT}`);
});
