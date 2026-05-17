import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';

const expressApp = express();

let isAppInitialized = false;
let nestApp: any;

async function bootstrap() {
  if (!isAppInitialized) {
    nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    nestApp.enableCors({
      origin: true,
      credentials: true,
    });

    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await nestApp.init();
    isAppInitialized = true;
  }
}

export default async (req: any, res: any) => {
  await bootstrap();
  expressApp(req, res);
};
