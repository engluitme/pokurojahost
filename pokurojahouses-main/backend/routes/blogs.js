import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../../data/blogs.json');
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

async function readBlogs() {
  try {
    const content = await fs.promises.readFile(DATA_FILE, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    return [];
  }
}

async function writeBlogs(data) {
  await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function normalizeId(id) {
  return String(id);
}

const sampleBlogs = [
  {
    id: '1',
    title: 'Welcome to PokuRoja',
    summary: 'A short introduction to PokuRoja Houses.',
    content: 'Welcome to the PokuRoja blog. Here you can find property updates, local market news, and real estate tips.',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'How to Find Your Next Home',
    summary: 'Tips for finding the right property in Harare.',
    content: 'Use search filters, inspect properties carefully, and verify ownership before committing.',
    created_at: new Date().toISOString()
  }
];

router.get('/', async (req, res) => {
  try {
    const db = req.db;
    if (db) {
      const items = await db.collection('blogs').find({}).toArray();
      return res.json(items.length > 0 ? items : sampleBlogs);
    }
    const items = await readBlogs();
    res.json(items.length > 0 ? items : sampleBlogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load blogs', details: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = normalizeId(req.params.id);
    const db = req.db;
    let item = null;
    if (db) {
      item = await db.collection('blogs').findOne({ id });
    }
    if (!item) {
      const items = await readBlogs();
      item = items.find((blog) => normalizeId(blog.id) === id);
    }
    if (!item) {
      item = sampleBlogs.find((blog) => blog.id === id);
    }
    if (!item) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load blog', details: err.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const db = req.db;
    const payload = req.body;
    payload.id = payload.id ? normalizeId(payload.id) : String(Date.now());
    payload.created_at = payload.created_at || new Date().toISOString();

    if (db) {
      await db.collection('blogs').insertOne(payload);
      return res.status(201).json(payload);
    }

    const items = await readBlogs();
    items.push(payload);
    await writeBlogs(items);
    res.status(201).json(payload);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create blog', details: err.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const id = normalizeId(req.params.id);
    const db = req.db;
    const updates = req.body;

    if (db) {
      const result = await db.collection('blogs').findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' });
      if (!result.value) return res.status(404).json({ error: 'Blog not found' });
      return res.json(result.value);
    }

    const items = await readBlogs();
    const index = items.findIndex((blog) => normalizeId(blog.id) === id);
    if (index === -1) return res.status(404).json({ error: 'Blog not found' });
    items[index] = { ...items[index], ...updates };
    await writeBlogs(items);
    res.json(items[index]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update blog', details: err.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = normalizeId(req.params.id);
    const db = req.db;

    if (db) {
      const result = await db.collection('blogs').deleteOne({ id });
      if (result.deletedCount === 0) return res.status(404).json({ error: 'Blog not found' });
      return res.json({ message: 'Blog deleted successfully' });
    }

    const items = await readBlogs();
    const index = items.findIndex((blog) => normalizeId(blog.id) === id);
    if (index === -1) return res.status(404).json({ error: 'Blog not found' });
    items.splice(index, 1);
    await writeBlogs(items);
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete blog', details: err.message });
  }
});

export default router;
