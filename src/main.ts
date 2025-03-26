// src/main.ts (simplified alternative)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Ensure uploads directory exists
  const uploadsDir = join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Configure static file serving with CORS
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads/',
    setHeaders: (res) => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const allowedOrigins = [
    'https://gestorimagen.amdc.hn',
    'https://gestorimg.amdc.hn',
    'https://welcometotegus.amdc.hn',
    'https://welcometotegus.netlify.app',
    'http://localhost:4200',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,Accept',
    exposedHeaders: 'Authorization',
    credentials: true,
    optionsSuccessStatus: 204,
  });

  const port = process.env.PORT || 3005;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}

bootstrap();
