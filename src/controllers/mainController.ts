// src/controllers/userController.ts
import e, { Request, Response } from 'express';
import { getVectorById, saveVectorToPinecone, searchForSimilarVectors } from '../utils/pinecone';
import { SaveSongVectorToSupabase, SaveUserVectorToSupabase, SimilaritySearchSupabase } from '../utils/supabase';


export const SimilaritySearch = async (req: Request, res: Response) => {
    const { userId } = req.body;
    let searchResults: number[] = []

    // Perform actions with pinecone
    if (process.env.PINECONE_API_KEY){
        // Extract the user embedding with the userId
        const userVector = await getVectorById(userId, "user");

        if (!userVector) {
            res.status(500).json({message:"User embedding is not available"});
            return;
        }

        // Perform similarity search
        searchResults = await searchForSimilarVectors(userVector, "song");
    } else if (process.env.SUPABASE_URL){
        // Perform actions with supabase
        searchResults = await SimilaritySearchSupabase(userId)
    }
    

    if (searchResults.length > 0){
        res.status(201).json({message:"Similar songs found", data: searchResults});
    } else {
        res.status(500).json({message:"No similar songs found"});
    }
}

export const saveSongVector = async (req: Request, res: Response) => {
    console.log("Saving song vector")
    const {songId, songVector, namespace} = req.body

    let succes = false;
    // Perform actions with pinecone
    if (process.env.PINECONE_API_KEY){
        console.log("Saving to pinecone")
        succes = await saveVectorToPinecone(songId, songVector, namespace);
    } else if (process.env.SUPABASE_URL){
        // Perform actions with supabase
        console.log("Saving to Supabase")
        succes = await SaveSongVectorToSupabase(songId, songVector)
    }

    if (succes){
        res.status(201).json({message:"Song saved"});
    } else {
        res.status(500).json({message:"Unable to save song"});
    }
}


export const saveUserVector = async (req: Request, res: Response) => {
    const {songId, songVector, namespace} = req.body

    let succes = false;
    // Perform actions with pinecone
    if (process.env.PINECONE_API_KEY){
        succes = await saveVectorToPinecone(songId, songVector, namespace);
    } else if (process.env.SUPABASE_URL){
        // Perform actions with supabase
        succes = await SaveUserVectorToSupabase(songId, songVector)
    }

    if (succes){
        res.status(201).json({message:"User saved"});
    } else {
        res.status(500).json({message:"Unable to save user"});
    }
}