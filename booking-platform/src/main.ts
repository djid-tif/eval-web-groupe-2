import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import { join } from 'path';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', '..', 'exports'), {
    prefix: '/exports/',
  });

  const config = new DocumentBuilder()
      .setTitle('Booking API')
      .setDescription('API documentation for the Booking Platform')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Temporarily commented for testing
  /*
  const grpcApp = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'extracts',
      protoPath: join(__dirname, './proto/extract.proto'),
      url: '0.0.0.0:50051',
    },
  });

  await app.startAllMicroservices();
  */

  await app.listen(3000);
}
bootstrap();

