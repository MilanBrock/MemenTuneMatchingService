// src/routes/users.ts
import { Router } from 'express';
import { SimilaritySearch, } from '../controllers/mainController';

const router = Router();

router.post("/similarity", SimilaritySearch)


export default router;
