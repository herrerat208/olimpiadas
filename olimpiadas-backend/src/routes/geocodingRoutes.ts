import { Router } from 'express';
import { geocodeAddress } from '../controllers/geocodingController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/search', geocodeAddress);

export default router;
