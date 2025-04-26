import express from 'express';
const router = express.Router();
import authMiddleware from '../middleWare/authMiddleware.js';
import { getMyMixDesigns, saveMixDesign } from '../controller/mixSaveController.js';

router.post('/save', authMiddleware, saveMixDesign);  // Save mix design
router.get('/my-designs', authMiddleware, getMyMixDesigns); // Fetch user's designs

export default router;
