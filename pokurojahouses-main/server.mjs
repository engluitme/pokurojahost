import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import propertyRoutes from './routes/properties.js';
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import blogRoutes from './routes/blogs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

/* ============================= */
/* Environment Check */
/* ============================= */
console.log('🔍 Environment check:');
console.log('   PORT:', PORT);
console.log('   MONGO_URI:', process.env.MONGO_URI ? '✅ SET' : '❌ MISSING');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ MISSING');

/* ============================= */
/* MongoDB Connection */
/* ============================= */
let cachedDb = null;

const mongoUri = process.env.MONGO_URI || null;
const mongoDbName = process.env.MONGO_DB_NAME || 'pokuroja';

async function connectToDatabase() {
  if (cachedDb) {
    console.log('📦 Using cached DB');
    return cachedDb;
  }

  if (!mongoUri) {
    console.error('❌ MONGO_URI not set');
    return null;
  }

  try {
    const client = new MongoClient(mongoUri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    cachedDb = client.db(mongoDbName);
    console.log('✅ MongoDB connected');
    return cachedDb;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    return null;
  }
}

/* ============================= */
/* Middleware */
/* ============================= */
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Log requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// Attach DB to request
app.use(async (req, res, next) => {
  req.db = await connectToDatabase();
  next();
});

/* ============================= */
/* Static Files */
/* ============================= */
app.use(express.static(path.join(__dirname, '../')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

/* ============================= */
/* Routes */
/* ============================= */
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/upload', uploadRoutes);

/* ============================= */
/* Health Check */
/* ============================= */
app.get('/api/health', async (req, res) => {
  const db = await connectToDatabase();
  res.json({
    status: '✅ Backend running',
    mongoConnected: !!db,
    timestamp: new Date().toISOString()
  });
});

/* ============================= */
/* Admin Route */
/* ============================= */
app.get('/admin', (req, res) => {
  const filePath = path.join(__dirname, 'admin', 'login.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Admin page not found');
  }
});

/* ============================= */
/* Global Error Handler */
/* ============================= */
app.use((err, req, res, next) => {
  console.error('💥 ERROR:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

/* ============================= */
/* Start Server */
/* ============================= */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health: /api/health`);
});
