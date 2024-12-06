import { Pinecone } from "@pinecone-database/pinecone";

export async function saveVectorToPinecone(songId: number, vector: number[], namespace:string): Promise<boolean> {
    // Initialize Pinecone client
    const apiKey = process.env.PINECONE_API_KEY;
    const indexName = process.env.PINECONE_INDEX_NAME;
    
    if (apiKey && indexName) {
        try {
            const pc = new Pinecone({ apiKey: apiKey});
        
            // Target the index where you'll store the vector embeddings
            const index = pc.index(indexName);

            // Upsert the vectors into the index
            await index.namespace(namespace || "").upsert([{
                id: songId.toString(),
                values: vector,
            }])

            return true;
        } catch (error) {
            console.error(error);
            
        }
        
    }
    return false;
};

export async function saveVectorWithMetadataToPinecone(songId: number, vector: number[], metadata: any, namespace: string): Promise<boolean> {
    // Initialize Pinecone client
    const apiKey = process.env.PINECONE_API_KEY;
    const indexName = process.env.PINECONE_INDEX_NAME;
    
    if (apiKey && indexName) {
        try {
            const pc = new Pinecone({ apiKey: apiKey});
        
            // Target the index where you'll store the vector embeddings
            const index = pc.index(indexName);

            // Upsert the vectors into the index
            await index.namespace(namespace || "").upsert([{
                id: songId.toString(),
                values: vector,
                metadata: metadata
            }])

            return true;
        } catch (error) {
            console.error(error);
            
        }
        
    }
    return false;
};


export async function searchForSimilarVectors(inputVector: number[], namespace: string): Promise<number[]> {
    // Initialize Pinecone client
    const apiKey = process.env.PINECONE_API_KEY;
    const indexName = process.env.PINECONE_INDEX_NAME;

    if (apiKey && indexName) {
        try {
            const pc = new Pinecone({ apiKey: apiKey });
        
            // Target the index where you'll store the vector embeddings
            const index = pc.index(indexName);

            // Perform similarity search
            const searchResults = await index.namespace(namespace || "").query({
                vector: inputVector,
                topK: 5,
                includeMetadata: true,
                
            });

            if (searchResults?.matches?.length > 0) {
                return searchResults.matches.map((match: any) => parseInt(match.id));
            }
            
        } catch (error) {
            console.error(error);
        }
    }
    return [];
}


export async function getVectorById(id: number, namespace: string): Promise<number[]> {
    // Initialize Pinecone client
    const apiKey = process.env.PINECONE_API_KEY;
    const indexName = process.env.PINECONE_INDEX_NAME;

    if (apiKey && indexName) {
        try {
            const pc = new Pinecone({ apiKey: apiKey });
        
            // Target the index where you'll store the vector embeddings
            const index = pc.index(indexName);

            // Perform similarity search
            const searchResults = await index.namespace(namespace || "").query({
                id: id.toString(),
                topK: 1,
                includeMetadata: true,
                
            });

            if (searchResults?.matches?.length > 0) {
                return searchResults.matches.map((match: any) => parseInt(match.id));
            }
            
        } catch (error) {
            console.error(error);
        }
    }
    return [];
}
