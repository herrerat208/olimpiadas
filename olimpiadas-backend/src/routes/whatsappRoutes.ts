import { Router } from 'express';
import { generarLink } from '../controllers/whatsappController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
router.use(authMiddleware);
router.post('/generar-link', generarLink);

export default router;