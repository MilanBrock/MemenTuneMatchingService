import { createClient } from '@supabase/supabase-js'


export async function SaveSongVectorToSupabase(songId: string, songVector: number[]): Promise<boolean>{
    let succes = false;
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY
    if (supabaseUrl && supabaseKey){
        const supabase = createClient(supabaseUrl, supabaseKey)

        
        let { data: songs, error } = await supabase.from('songs').select('id').eq('songid',songId)
        if (songs && songs.length > 0){
            const { data, error } = await supabase.from('songs').update({ embedding: songVector }).eq('songid', songId).select()
            if (data){
                succes = true;
            }
        } else {
            const { data, error } = await supabase.from('songs').insert([{ embedding: songVector, songid: songId },]).select()
            if (data){
                succes = true;
            }
        }

        
    }
    return succes;
}

export async function SaveUserVectorToSupabase(userId: string, userVector: number[]): Promise<boolean>{
    let succes = false;
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY
    if (supabaseUrl && supabaseKey){
        const supabase = createClient(supabaseUrl, supabaseKey)

        let { data: users, error } = await supabase.from('users').select('id').eq('userid',userId)
        if (users && users.length > 0){
            const { data, error } = await supabase.from('users').update({ embedding: userVector }).eq('userid', userId).select()
            if (data){
                succes = true;
            }
        } else {
            const { data, error } = await supabase.from('users').insert([{ embedding: userVector, userid: userId },]).select()
            if (data){
                succes = true;
            }
        }
    }
    return succes;
}


export async function SimilaritySearchSupabase(userId: string){
    let results: number[] = []

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY
    if (supabaseUrl && supabaseKey){
        const supabase = createClient(supabaseUrl, supabaseKey)

        
        let { data: userEmbedding, error } = await supabase.from('users').select('embedding').eq('userid', userId)
 
        if (userEmbedding){
            const { data, error } = await supabase.rpc('similaritysearch', {
                query_vector: userEmbedding[0].embedding,
                limit_value: 3,
              });
            if (data){
                for (const song of data){
                    results.push(song.songid)
                }
                console.log(results)
            }
        }

    }

    return results
}