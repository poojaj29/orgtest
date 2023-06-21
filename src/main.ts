import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import AllExceptionsFilter from './common/exceptionsFilter';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MyLogger } from '../lib/logger';
import { nkeyAuthenticator } from 'nats';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Main Logger');
  const app = await NestFactory.create(AppModule, {
    logger: new MyLogger()
  });
  const configService = app.get(ConfigService);
app.setGlobalPrefix('organization')
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: configService.get('nats').url,
      authenticator: nkeyAuthenticator(new TextEncoder().encode(configService.get('nats').NKEY_SEED))
    }
  });
  app.useGlobalPipes(new ValidationPipe());
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NDI Organization Service')
    .setDescription('testing CICD')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('/organization/swagger', app, document);
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT') || 3005, () => {
    logger.log(`Listening on Port:${configService.get('PORT')}` || 3000);
  });
}
bootstrap();
