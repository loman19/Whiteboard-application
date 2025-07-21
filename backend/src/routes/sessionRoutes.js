const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new whiteboard session
router.post('/create', async (req, res) => {
  const { userId, title } = req.body;

  try {
    const session = await prisma.session.create({
      data: {
        userId,
        title,
      },
    });

    res.status(201).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a session with its pages in order
router.get('/:id', async (req, res) => {
  const sessionId = req.params.id;

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        pages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all sessions for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId: req.params.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Edit a session's title
router.put('/:id', async (req, res) => {
  const { title } = req.body;
  try {
    const updated = await prisma.session.update({
      where: { id: req.params.id },
      data: { title },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a session and its pages
router.delete('/:id', async (req, res) => {
  try {
    await prisma.page.deleteMany({ where: { sessionId: req.params.id } });
    await prisma.session.delete({ where: { id: req.params.id } });
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;