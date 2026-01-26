import express from 'express';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// API Routes

// Get all submissions (for admin)
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Create new submission
app.post('/api/submissions', async (req, res) => {
  try {
    const { content, socialHandle, email } = req.body;
    if (!content || !socialHandle) {
      return res.status(400).json({ error: 'Content and social handle are required' });
    }
    const submission = await prisma.submission.create({
      data: { content, socialHandle, email: email || null }
    });
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create submission' });
  }
});

// Update submission (admin)
app.patch('/api/submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response, responseUrl } = req.body;
    const submission = await prisma.submission.update({
      where: { id },
      data: { status, response, responseUrl }
    });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update submission' });
  }
});

// Get approved submissions (for voting)
app.get('/api/submissions/approved', async (req, res) => {
  try {
    const submissions = await prisma.submission.findMany({
      where: { status: 'approved' },
      orderBy: { votes: 'desc' }
    });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch approved submissions' });
  }
});

// Vote on submission
app.post('/api/submissions/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await prisma.submission.findUnique({ where: { id } });
    if (!submission || submission.status !== 'approved') {
      return res.status(400).json({ error: 'Can only vote on approved submissions' });
    }
    const updated = await prisma.submission.update({
      where: { id },
      data: { votes: { increment: 1 } }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to vote' });
  }
});

// Serve HTML pages
app.get('/', (req, res) => res.sendFile(join(__dirname, 'public', 'index.html')));
app.get('/vote', (req, res) => res.sendFile(join(__dirname, 'public', 'vote.html')));
app.get('/admin', (req, res) => res.sendFile(join(__dirname, 'public', 'admin.html')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
