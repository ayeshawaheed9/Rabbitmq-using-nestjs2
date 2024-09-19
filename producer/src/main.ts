import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import amqp from 'amqp-connection-manager';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const connection = await amqp.connect('amqp://localhost:5672');
  const channel = await connection.createChannel();
  
  // const exchange = 'direct_exchange';
  // const exchangeType ='direct'; 
  // const queue= 'direct_queue';
  // const routingKey = 'direct_route';
  
  // await channel.assertExchange(exchange, exchangeType, { durable: true });
  // await channel.assertQueue(queue, { durable: true });
  // await channel.bindQueue(queue, exchange, routingKey);
  
  ///// Topic Exchange 

  const topicExchange = 'topic_exchange';
  const topicExchangeType = 'topic';
  const topicQueue = 'topic_queue';
  const topicRoutingKey = 'order.*'; // Example pattern to match
  
  await channel.assertExchange(topicExchange, topicExchangeType, { durable: true });
  const q = await channel.assertQueue(topicQueue, { durable: true });
  console.log(`Waiting for messages in queue: ${q.queue}`)
  await channel.bindQueue(topicQueue, topicExchange, topicRoutingKey);

  
  await app.listen(3000);
}
bootstrap();
