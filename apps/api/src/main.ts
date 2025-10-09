import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS - allow both production and development URLs
  const allowedOrigins = [
    process.env.FRONTEND_URL, // Production Cloudflare URL
    'http://localhost:3001',   // Local development
    'http://localhost:3000',   // Alternative local port
    'https://f25-cisc474-individual.danielmahler34.workers.dev', // Cloudflare Workers
  ].filter(Boolean); // Remove undefined values

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, or curl)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list or ends with workers.dev
      if (allowedOrigins.some(allowed => origin.startsWith(allowed)) ||
          origin.endsWith('.workers.dev')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
