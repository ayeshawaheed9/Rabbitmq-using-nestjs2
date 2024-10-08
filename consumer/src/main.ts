import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { rmqConfig } from './rmq.config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(rmqConfig('fanout_queue1'));  // Fanout Queue 1
  app.connectMicroservice(rmqConfig('fanout_queue2'));  // Fanout Queue 2
  app.connectMicroservice(rmqConfig('header_queue'));   // Header Queue
  await app.startAllMicroservices();
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import * as amqp from 'amqplib';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Connect to RabbitMQ server
//   const connection = await amqp.connect('amqp://localhost:5672');
//   const channel = await connection.createChannel();

//   const exchangeName = 'topic_exchange';  // Your exchange name
//   const queueName = 'topic_queue';        // Your queue name
//   const routingKey = 'order.*';           // Routing key for topic pattern

//   // Declare exchange
//   await channel.assertExchange(exchangeName, 'topic', { durable: true });

//   // Declare queue
//   await channel.assertQueue(queueName, { durable: true });

//   // Bind queue to the exchange with a pattern
//   await channel.bindQueue(queueName, exchangeName, routingKey);

//   console.log(`Queue ${queueName} bound to exchange ${exchangeName} with pattern ${routingKey}`);

//   // Connect the microservice
//   app.connectMicroservice<MicroserviceOptions>({
//     transport: Transport.RMQ,
//     options: {
//       urls: ['amqp://localhost:5672'],
//       queue: queueName,
//       queueOptions: {
//         durable: true,
//       },
//     },
//   });

//   await app.startAllMicroservices();
// }

// bootstrap();
