import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// LOAD ENV FIRST - before anything else reads process.env
dotenv.config({ path: path.join(__dirname, '../.env') });

async function startServer() {
  // Import routes AFTER dotenv is loaded (using dynamic imports)
  const propertyRoutes = (await import('./routes/properties.js')).default;
  const authRoutes = (await import('./routes/auth.js')).default;
  const uploadRoutes = (await import('./routes/upload.js')).default;
  const blogRoutes = (await import('./routes/blogs.js')).default;

  console.log('🔍 Environment check:');
  console.log('   __dirname:', __dirname);
  console.log('   .env path:', path.join(__dirname, '../.env'));
  console.log('   CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET');
  console.log('   CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET');
  console.log('   CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET');

  const app = express();
  const PORT = process.env.PORT || 5000;

  /* ============================= */
  /* Environment - BETTER LOGGING */
  /* ============================= */
  console.log('🔍 Environment check:');
  console.log('   PORT:', process.env.PORT || 5000);
  console.log('   MONGO_URI:', process.env.MONGO_URI ? '✅ SET' : '❌ MISSING');
  console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ MISSING');

  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
  process.env.JWT_SECRET = JWT_SECRET;

  /* ============================= */
  /* MongoDB Connection with Caching for Serverless */
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

  // LOG ALL INCOMING REQUESTS
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
  });

  /* ============================= */
  /* Make DB available to routes */
  /* ============================= */
  app.use(async (req, res, next) => {
    try {
      req.db = await connectToDatabase();
    } catch (err) {
      console.error('❌ Failed to attach DB to request:', err.message || err);
      req.db = null;
    }
    next();
  });

  /* ============================= */
  /* Static Files (for Vercel, uploads folder may not persist) */
  /* ============================= */
  app.use(express.static(path.join(__dirname, '../')));
  // Serve legacy repo uploads folder for old property records
  app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
  // Also serve backend uploads folder for files stored by the backend instance
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Admin folder path resolution
  const adminPath = path.join(__dirname, '../../admin');
  console.log('🚀 Admin path:', adminPath);
  console.log('✅ Admin folder exists:', fs.existsSync(adminPath));
  console.log('✅ login.html exists:', fs.existsSync(path.join(adminPath, 'login.html')));

  app.use('/admin', express.static(adminPath, { dotfiles: 'allow' }));

  /* ============================= */
  /* API Routes */
  /* ============================= */
  app.use('/api/auth', authRoutes);
  app.use('/api/properties', propertyRoutes);
  app.use('/api/blogs', blogRoutes);
  app.use('/api/upload', uploadRoutes);

  /* ============================= */
  /* Health Check Routes */
  /* ============================= */
  app.get('/api/health', async (req, res) => {
    const db = await connectToDatabase();
    res.json({ 
      status: 'Backend is running on Vercel ✅', 
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
          message: 'MongoDB not connected',
          mongoUri: !!mongoUri
        });
      }
      
      // Test properties collection
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
  /* Error Handler - CATCH ALL */
  /* ============================= */
  app.use((err, req, res, next) => {
    console.error('💥 GLOBAL ERROR:', err.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  });

  /* ============================= */
  /* Admin Route - Explicit handler for / redirect */
  /* ============================= */
  app.get('/admin', (req, res) => {
    const loginPath = path.join(adminPath, 'login.html');
    console.log('📄 Serving admin page from:', loginPath);
    if (fs.existsSync(loginPath)) {
      res.sendFile(loginPath);
    } else {
      console.warn('⚠️ Admin login.html not found at:', loginPath);
      res.status(404).json({ error: 'login.html not found', path: loginPath });
    }
  });

  /* ============================= */
  /* Server Startup */
  /* ============================= */
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 API health: http://0.0.0.0:${PORT}/api/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch(err => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
