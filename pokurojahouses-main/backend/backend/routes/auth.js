import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@pokuroja.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authorization token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, token, user: { email } });
  }

  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

router.get('/verify', authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.post('/verify', authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.get('/me', (req, res) => {
  res.json({ email: ADMIN_EMAIL, role: 'admin' });
});

export default router;
