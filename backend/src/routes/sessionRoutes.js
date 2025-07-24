const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessionById,
  getSessionsByUser,
  updateSessionTitle,
  deleteSession,
} = require('../controllers/sessionController');

// Create a new session
router.post('/create', createSession);

// Get a specific session by ID (including ordered pages)
router.get('/:id', getSessionById);

// Get all sessions for a user
router.get('/user/:userId', getSessionsByUser);

// Update session title
router.put('/:id', updateSessionTitle);

// Delete session
router.delete('/:id', deleteSession);

module.exports = router;
// Save whiteboard content (pages)
router.post('/save', async (req, res) => {
  const { sessionId, pages } = req.body;

  try {
    // Delete existing pages before saving new ones (optional: could update instead)
    await prisma.page.deleteMany({ where: { sessionId } });

    // Create new pages in bulk
    const createdPages = await prisma.page.createMany({
      data: pages.map((page, index) => ({
        sessionId,
        content: page.content,
        order: index,
      })),
    });

    res.status(200).json({ message: 'Session saved', pages: createdPages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save session' });
  }
});

// Load whiteboard content
router.get('/load/:id', async (req, res) => {
  const sessionId = req.params.id;

  try {
    const pages = await prisma.page.findMany({
      where: { sessionId },
      orderBy: { order: 'asc' },
    });

    res.status(200).json(pages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load session' });
  }
});
