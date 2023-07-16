import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  // server start
  const PORT = 8000;
  await app.listen(PORT);
}
bootstrap();