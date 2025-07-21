const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new page and link it to the previous one (if provided)
router.post('/pages', async (req, res) => {
  const { sessionId, content, prevPageId } = req.body;

  try {
    let newPage;

    if (prevPageId) {
      const prevPage = await prisma.page.findUnique({ where: { id: prevPageId } });

      if (!prevPage) {
        return res.status(404).json({ message: 'Previous page not found' });
      }

      // Create new page and set its prevPageId
      newPage = await prisma.page.create({
        data: {
          sessionId,
          content,
          prevPageId,
        },
      });

      // Update previous page's nextPageId
      await prisma.page.update({
        where: { id: prevPageId },
        data: { nextPageId: newPage.id },
      });
    } else {
      // If no prevPageId provided, create the first page
      newPage = await prisma.page.create({
        data: {
          sessionId,
          content,
        },
      });
    }

    res.status(201).json(newPage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a page by ID
router.get('/pages/:id', async (req, res) => {
  try {
    const page = await prisma.page.findUnique({
      where: { id: req.params.id },
      include: {
        nextPage: true,
        prevPage: true,
      },
    });

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json(page);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Edit a page's content
router.put('/pages/:id', async (req, res) => {
  const { content } = req.body;

  try {
    const updatedPage = await prisma.page.update({
      where: { id: req.params.id },
      data: { content },
    });

    res.json(updatedPage);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a page and update its neighbors
router.delete('/pages/:id', async (req, res) => {
  const pageId = req.params.id;

  try {
    const page = await prisma.page.findUnique({ where: { id: pageId } });
    if (!page) return res.status(404).json({ message: 'Page not found' });

    if (page.prevPageId) {
      await prisma.page.update({
        where: { id: page.prevPageId },
        data: { nextPageId: page.nextPageId },
      });
    }

    if (page.nextPageId) {
      await prisma.page.update({
        where: { id: page.nextPageId },
        data: { prevPageId: page.prevPageId },
      });
    }

    await prisma.page.delete({ where: { id: pageId } });
    res.json({ message: 'Page deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
