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

dotenv.config({ path: path.join(__dirname, '.env') });

// Find the admin folder - it could be in different locations depending on deployment
let adminPath = path.join(__dirname, '../admin');
if (!fs.existsSync(adminPath)) {
  // Try looking in root of current working directory
  adminPath = path.join(process.cwd(), 'admin');
}
if (!fs.existsSync(adminPath)) {
  // Try looking up more levels
  adminPath = path.join(__dirname, '../../admin');
}

console.log('🚀 Server starting...');
console.log('__dirname:', __dirname);
console.log('process.cwd():', process.cwd());
console.log('Admin path:', adminPath);
console.log('Admin exists:', fs.existsSync(adminPath));
console.log('Port:', process.env.PORT || 5000);

const mongoUri = process.env.MONGO_URI || null;
const mongoDbName = process.env.MONGO_DB_NAME || 'pokuroja';

let cachedDb = null;
let mongoClient = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  if (!mongoUri) {
    return null;
  }
  try {
    mongoClient = new MongoClient(mongoUri, {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
    });
    await mongoClient.connect();
    cachedDb = mongoClient.db(mongoDbName);
    return cachedDb;
  } catch (err) {
    console.error('MongoDB error:', err.message);
    return null;
  }
}

app.use(cors({origin: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], credentials: true}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(async (req, res, next) => {
  req.db = await connectToDatabase();
  next();
});

app.use(express.static(path.join(__dirname, '../')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Admin static files with more detailed error handling
console.log('📁 Serving admin from:', adminPath);

app.use('/admin', express.static(adminPath, {
  dotfiles: 'allow'
}));

// Explicit route for admin login
app.get('/admin/login.html', (req, res) => {
  const loginFile = path.join(adminPath, 'login.html');
  console.log('📄 Serving login.html from:', loginFile);
  if (fs.existsSync(loginFile)) {
    res.sendFile(loginFile);
  } else {
    res.status(404).json({error: 'login.html not found at ' + loginFile});
  }
});

// Explicit route for any admin file
app.get('/admin/:file', (req, res) => {
  const file = req.params.file;
  const filePath = path.join(adminPath, file);
  console.log('📄 Serving admin file:', filePath);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({error: 'File not found: ' + file});
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    mongoConnected: !!cachedDb,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/debug', (req, res) => {
  const loginPath = path.join(adminPath, 'login.html');
  
  let adminFiles = [];
  try {
    adminFiles = fs.readdirSync(adminPath);
  } catch (e) {
    adminFiles = ['ERROR: ' + e.message];
  }
  
  let rootFiles = [];
  try {
    rootFiles = fs.readdirSync(path.join(__dirname, '../')).slice(0, 20);
  } catch (e) {
    rootFiles = ['ERROR: ' + e.message];
  }
  
  res.json({
    cwd: process.cwd(),
    dirname: __dirname,
    adminPath: adminPath,
    adminExists: fs.existsSync(adminPath),
    loginFileExists: fs.existsSync(loginPath),
    adminFiles: adminFiles.slice(0, 15),
    rootFilesCount: fs.readdirSync(path.join(__dirname, '../')).length,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      MONGO_URI: process.env.MONGO_URI ? '***SET***' : 'NOT SET'
    }
  });
});

// Fallback to index.html for client-side routing
app.use((req, res, next) => {
  // If not an API route, not an admin route, not a file with extension, serve index.html
  if (!req.path.startsWith('/api') && !req.path.startsWith('/admin') && !req.path.startsWith('/uploads') && !req.path.includes('.')) {
    res.sendFile(path.join(__dirname, '../index.html'));
  } else {
    next();
  }
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({error: 'Error'});
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server on ${PORT}`);
  });
} else {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Production Server on ${PORT}`);
  });
}
