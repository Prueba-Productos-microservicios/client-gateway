import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { ExceptionFilter } from './common/exceptions/rpc-exception.filter';

async function bootstrap() {
  const logger = new Logger('Main-Gateway');
  
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors();

  app.useGlobalPipes(  
    new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true, 
    }) 
  );

  app.useGlobalFilters(new ExceptionFilter());

  await app.listen(envs.port);
  logger.log(`Gateway running on port ${ envs.port }`);
}
bootstrap();
