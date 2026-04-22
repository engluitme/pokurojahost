import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

// Load environment variables
dotenv.config();

const app = express();

// Cache for MongoDB connection
let cachedDb = null;
let mongoClient = null;

const mongoUri = process.env.MONGO_URI;
const mongoDbName = process.env.MONGO_DB_NAME || 'pokuroja';

// Connect to MongoDB with caching
async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  if (!mongoUri) {
    console.error('❌ MONGO_URI not set');
    return null;
  }

  try {
    mongoClient = new MongoClient(mongoUri, {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
    });
    await mongoClient.connect();
    cachedDb = mongoClient.db(mongoDbName);
    console.log('✅ Connected to MongoDB');
    return cachedDb;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    throw err;
  }
}

// Middleware
app.use(cors({ origin: true, methods: ['GET','POST','PUT','DELETE','OPTIONS'], credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Attach DB to request
app.use(async (req, res, next) => {
  try {
    req.db = await connectToDatabase();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Root route for testing
app.get('/', (req, res) => {
  res.send('Pokuroja Houses API is running!');
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// ===== Import routes (Render-ready structure) =====
import propertyRoutes from '../routes/properties.js';
import authRoutes from '../routes/auth.js';
import uploadRoutes from '../routes/upload.js';
import blogRoutes from '../routes/blogs.js';

// Log to confirm imports
console.log('propertyRoutes:', propertyRoutes ? 'OK' : 'undefined');
console.log('authRoutes:', authRoutes ? 'OK' : 'undefined');
console.log('uploadRoutes:', uploadRoutes ? 'OK' : 'undefined');
console.log('blogRoutes:', blogRoutes ? 'OK' : 'undefined');

// Mount routes
app.use('/api/properties', propertyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/blogs', blogRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ===== Start server =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
