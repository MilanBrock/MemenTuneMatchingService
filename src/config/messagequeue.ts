import amqp from 'amqplib';
import { listenToSongEmbeddedEvent } from '../utils/messagequeue'; 


let channel: amqp.Channel;

// Connect to RabbitMQ and create a reusable channel
export async function connectMessageQueue() {
  try {
    const connection = await connectRabbitMQ();

    if (!connection) {
      console.error('Failed to connect to RabbitMQ');
      return;
    }

    channel = await connection.createChannel();
    listenToSongEmbeddedEvent();
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
}

// Helper to establish RabbitMQ connection with retry
async function connectRabbitMQ() {
  const maxRetries = 10;
  let retryDelay = 5000; // Start with 5 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const connection = await amqp.connect(
        `amqps://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}/${process.env.RABBITMQ_USER}`
      );
      return connection;
    } catch (error) {
      console.error(`Attempt ${attempt} to connect to RabbitMQ failed:`, error);
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retryDelay *= 2; // Exponential backoff
      } else {
        console.error('Max retries reached. Could not connect to RabbitMQ.');
        process.exit(1);
      }
    }
  }
}

// Publish a message to a specific event in a channel
export async function publishEvent(channelName: string, eventName: string, message: string) {
  if (!channel) {
    console.error('No RabbitMQ channel found');
    return;
  }

  const exchange = channelName; // Use channel name as the exchange name
  await channel.assertExchange(exchange, 'topic', { durable: true });
  const routingKey = `${channelName}.${eventName}`; // e.g., "user.created"

  channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
}

// Consume a message for a specific event in a channel
export async function consumeEvent(
  channelName: string,
  eventName: string,
  onMessage: (message: amqp.ConsumeMessage | null) => void
) {
  if (!channel) {
    console.error('No RabbitMQ channel found');
    return;
  }

  const exchange = channelName; // Use channel name as the exchange name
  await channel.assertExchange(exchange, 'topic', { durable: true });
  const queue = `${channelName}.${eventName}.queue`; // Create a queue specific to this event
  const routingKey = `${channelName}.${eventName}`; // e.g., "user.created"

  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, routingKey);

  channel.consume(queue, onMessage, { noAck: true });
  console.log(`Listening for ${routingKey} events on queue ${queue}`);
}
