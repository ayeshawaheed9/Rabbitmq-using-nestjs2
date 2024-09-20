
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export const rmqConfig = (queueName: string): MicroserviceOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'],
    queue: queueName,
    queueOptions: {
      durable: true,
    },
  },
});
