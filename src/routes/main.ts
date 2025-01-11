// src/routes/users.ts
import { Router } from 'express';
import { saveSongVector, saveUserVector, SimilaritySearch, getMetrics} from '../controllers/mainController';

const router = Router();

router.post("/similarity", SimilaritySearch)
router.post("/savesong", saveSongVector)
router.post("/saveuser", saveUserVector)
router.get("/metrics", getMetrics)


export default router;
