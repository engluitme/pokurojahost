import express from 'express';

const router = express.Router();

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

router.get('/', (req, res) => {
  res.json(sampleBlogs);
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const item = sampleBlogs.find((blog) => blog.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Blog post not found' });
  }
  res.json(item);
});

export default router;
