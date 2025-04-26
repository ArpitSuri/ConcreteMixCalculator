import express from 'express';
import { calculateMixDesign } from '../controller/mixController.js';
import authMiddleware from '../middleWare/authMiddleware.js';
const router = express.Router();

router.post('/calculate',authMiddleware, calculateMixDesign);

export default router;