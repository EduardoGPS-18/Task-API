import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformerInterceptor } from './transform.interceptor';

//TODO: CONTINUE (LEASON 64: NESTJS ZERO TO HERO)
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger();
  const port = 3000;

  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(logger);
  app.useGlobalInterceptors(new TransformerInterceptor());

  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
