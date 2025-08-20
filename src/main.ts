// src/main.ts (simplified alternative)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configure JSON middleware to exclude multipart/form-data requests
  app.use(
    express.json({
      limit: '50mb', // Increase payload limit for large requests
      type: (req) => {
        // Don't process as JSON if it's multipart/form-data
        const contentType = req.headers['content-type'] || '';
        return !contentType.includes('multipart/form-data');
      },
    }),
  );

  // Configure URL-encoded middleware with increased limit
  app.use(
    express.urlencoded({
      limit: '50mb',
      extended: true,
    }),
  );

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
    'http://localhost:3005',
    'http://localhost:64922',
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
