import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createRMQConnection } from './rmq.config'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const channel = await createRMQConnection();
  await app.listen(3000);
}
bootstrap();
