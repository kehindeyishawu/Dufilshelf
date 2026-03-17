import { Router } from 'express';
import { z } from 'zod';
import { protect } from '../middleware/auth.js';
import Item from '../models/Item.js';

const router = Router();

router.use(protect);

const itemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
});

router.get('/', async (req, res) => {
  const { search } = req.query;

  const filter = { createdBy: req.user.userId };
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const items = await Item.find(filter).sort({ createdAt: -1 });
  res.json(items);
});

router.post('/', async (req, res) => {
  const result = itemSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors[0].message });
  }

  const item = await Item.create({
    ...result.data,
    createdBy: req.user.userId,
  });

  res.status(201).json(item);
});

export default router;
