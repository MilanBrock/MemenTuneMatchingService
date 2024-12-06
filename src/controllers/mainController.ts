// src/controllers/userController.ts
import e, { Request, Response } from 'express';
import { getVectorById, saveVectorToPinecone, searchForSimilarVectors } from '../utils/databaseCRUD';


export const SimilaritySearch = async (req: Request, res: Response) => {
    const { userId } = req.body;
    
    // Extract the user embedding with the userId
    const userVector = await getVectorById(userId, "user");

    if (!userVector) {
        res.status(500).json({message:"User embedding is not available"});
        return;
    }

    // Perform similarity search
    const searchResults = await searchForSimilarVectors(userVector, "song");

    if (searchResults.length > 0){
        res.status(201).json({message:"Similar songs found", data: searchResults});
    } else {
        res.status(500).json({message:"No similar songs found"});
    }
   
}