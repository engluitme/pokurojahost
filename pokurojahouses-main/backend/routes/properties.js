import express from 'express';

const router = express.Router();

function normalizeId(id) {
  return String(id);
}

router.get('/', async (req, res) => {
  try {
    const db = req.db;
    if (!db) {
      return res.status(500).json({ error: 'MongoDB connection unavailable' });
    }
    const items = await db.collection('properties').find({}).toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load properties', details: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = normalizeId(req.params.id);
    const db = req.db;
    if (!db) {
      return res.status(500).json({ error: 'MongoDB connection unavailable' });
    }
    const item = await db.collection('properties').findOne({ id });
    if (!item) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load property', details: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = req.db;
    if (!db) {
      return res.status(500).json({ error: 'MongoDB connection unavailable' });
    }
    const payload = req.body;
    payload.id = payload.id ? normalizeId(payload.id) : String(Date.now());
    payload.created_at = payload.created_at || new Date().toISOString();

    await db.collection('properties').insertOne(payload);
    res.status(201).json(payload);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create property', details: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = normalizeId(req.params.id);
    const db = req.db;
    if (!db) {
      return res.status(500).json({ error: 'MongoDB connection unavailable' });
    }
    const updates = req.body;

    const result = await db.collection('properties').findOneAndUpdate({ id }, { $set: updates }, { returnDocument: 'after' });
    if (!result.value) return res.status(404).json({ error: 'Property not found' });
    res.json(result.value);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update property', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = normalizeId(req.params.id);
    const db = req.db;
    if (!db) {
      return res.status(500).json({ error: 'MongoDB connection unavailable' });
    }

    const result = await db.collection('properties').deleteOne({ id });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Property not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete property', details: err.message });
  }
});

export default router;
