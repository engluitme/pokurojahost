import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import propertyRoutes from './routes/properties.js';
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import blogRoutes from './routes/blogs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

/* ============================= */
/* Environment Logging */
/* ============================= */
console.log('🔍 Environment check:');
console.log('   PORT:', process.env.PORT || 5000);
console.log('   MONGO_URI:', process.env.MONGO_URI ? '✅ SET' : '❌ MISSING');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ MISSING');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
process.env.JWT_SECRET = JWT_SECRET;

/* ============================= */
/* MongoDB Connection */
/* ============================= */
let cachedDb = null;
let mongoClient = null;

const mongoUri = process.env.MONGO_URI || null;
const mongoDbName = process.env.MONGO_DB_NAME || 'pokuroja';

async function connectToDatabase() {
  if (cachedDb) {
    console.log('📦 Using cached database connection');
    return cachedDb;
  }

  if (!mongoUri) {
    console.error('❌ MONGO_URI not set — MongoDB disabled!');
    return null;
  }

  console.log('🔗 Creating new MongoDB connection...');
  try {
    mongoClient = new MongoClient(mongoUri, {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
    });

    await mongoClient.connect();
    cachedDb = mongoClient.db(mongoDbName);
    console.log('✅ MongoDB connected:', mongoDbName);

    return cachedDb;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message || err);
    return null;
  }
}

/* ============================= */
/* Middleware */
/* ============================= */
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

/* ============================= */
/* Attach DB to request */
/* ============================= */
app.use(async (req, res, next) => {
  try {
    req.db = await connectToDatabase();
  } catch (err) {
    console.error('❌ Failed to attach DB:', err.message || err);
    req.db = null;
  }
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
/* Health & Debug */
/* ============================= */
app.get('/api/health', async (req, res) => {
  const db = await connectToDatabase();
  res.json({
    status: 'Backend is running ✅',
    mongoConnected: !!db,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test-mongo', async (req, res) => {
  try {
    const db = await connectToDatabase();

    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'MongoDB not connected'
      });
    }

    const count = await db.collection('properties').countDocuments();
    const sample = await db.collection('properties').findOne({});

    res.json({
      success: true,
      message: 'MongoDB connected ✅',
      dbName: mongoDbName,
      propertiesCount: count,
      sampleData: sample
    });
  } catch (err) {
    console.error('💥 Mongo test error:', err);
    res.status(500).json({
      success: false,
      message: 'MongoDB test failed',
      error: err.message
    });
  }
});

app.get('/api/debug', async (req, res) => {
  const db = await connectToDatabase();
  res.json({
    routes: ['/api/auth', '/api/properties', '/api/upload'],
    mongo: !!db,
    uploadsFolder: fs.existsSync(path.join(__dirname, 'uploads'))
  });
});

/* ============================= */
/* Admin Route */
/* ============================= */
app.get('/admin', (req, res) => {
  const loginPath = path.join(__dirname, 'admin', 'login.html');

  if (fs.existsSync(loginPath)) {
    res.sendFile(loginPath);
  } else {
    console.warn('⚠️ Admin login.html not found');
    res.status(404).send('Admin login page not found');
  }
});

/* ============================= */
/* Global Error Handler */
/* ============================= */
app.use((err, req, res, next) => {
  console.error('💥 GLOBAL ERROR:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

/* ============================= */
/* Start Server */
/* ============================= */
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
  });
} else {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Production server running on port ${PORT}`);
  });
}

/* ============================= */
/* Export (for Vercel) */
/* ============================= */
export default app;
