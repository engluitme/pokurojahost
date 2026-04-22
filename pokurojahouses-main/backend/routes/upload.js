import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { GridFSBucket, ObjectId } from 'mongodb';

const router = express.Router();
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

// Use memory storage - file stays in memory, we save to MongoDB
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const db = req.db;
    if (!db) {
      return res.status(500).json({ success: false, error: 'Database not connected' });
    }

    // Create GridFS bucket for storing files in MongoDB
    const bucket = new GridFSBucket(db);

    // Generate unique filename
    const timestamp = Date.now();
    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${safeName}`;

    // Create read stream from buffer and upload to GridFS
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: {
        uploadedAt: new Date(),
        originalName: req.file.originalname,
        userId: req.user?.id || null,
      }
    });

    uploadStream.on('error', (error) => {
      console.error('GridFS upload error:', error);
      res.status(500).json({ success: false, error: 'Upload failed' });
    });

    uploadStream.on('finish', (file) => {
      console.log(`✅ Image stored in MongoDB GridFS: ${file._id}`);
      res.json({ 
        success: true, 
        file: req.file, 
        url: `/api/uploads/${file._id}` 
      });
    });

    uploadStream.end(req.file.buffer);

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: 'Upload failed: ' + error.message });
  }
});

// Route to retrieve images from MongoDB GridFS
router.get('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const db = req.db;
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    // Validate ObjectId
    if (!ObjectId.isValid(fileId)) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }

    const bucket = new GridFSBucket(db);
    
    // Find the file metadata first
    const filesCollection = db.collection('fs.files');
    const file = await filesCollection.findOne({ _id: new ObjectId(fileId) });
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set proper headers
    res.set('Content-Type', file.contentType || 'application/octet-stream');
    res.set('Content-Length', file.length);
    
    // Create download stream from GridFS
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    
    downloadStream.on('error', (error) => {
      console.error('GridFS download error:', error);
      res.status(500).json({ error: 'Download failed' });
    });

    downloadStream.pipe(res);

  } catch (error) {
    console.error('Retrieve error:', error);
    res.status(500).json({ error: 'Retrieve failed: ' + error.message });
  }
});

export default router;

const upload = multer({ storage });

router.post('/', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, file: req.file, url: fileUrl });
});

export default router;
