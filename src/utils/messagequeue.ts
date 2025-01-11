import { publishEvent, consumeEvent } from '../config/messagequeue';
import { SongSubmission } from '../middlewares/interfaces';
import { saveVectorToPinecone, saveVectorWithMetadataToPinecone } from './pinecone';


// Events to post



// Events to listen to
export async function listenToSongEmbeddedEvent() {
  await consumeEvent('song', 'DescriptionEmbedded', async (msg) => {
    if (msg) {
        console.log('A new song has been submitted, saving the song embedding');
        const songSubmission: SongSubmission = JSON.parse(msg.content.toString());
        const succes = await saveVectorWithMetadataToPinecone(songSubmission, "song");
        if (succes) {
          console.log('Song embedding has been saved');
        } else {
          console.error('Unable to save song embedding'); 
        }
      }
  });
}

export async function listenToUserEmbeddedEvent() {
    await consumeEvent('user', 'DescriptionEmbedded', async (msg) => {
      if (msg) {
          console.log('A user has updated their description, saving the user embedding');
          const { userId, userDescriptionEmbed } = JSON.parse(msg.content.toString());
          const succes = await saveVectorToPinecone(userId, userDescriptionEmbed, "user");
          if (succes) {
            console.log('Song embedding has been saved');
          } else {
            console.error('Unable to save song embedding'); 
          }
        }
    });
  }

