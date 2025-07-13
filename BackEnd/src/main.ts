import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs'; // Importar o módulo 'fs'
import * as https from 'https'; // Importar o módulo 'https'
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  // Carregar os certificados SSL
  const httpsOptions = {
   key: fs.readFileSync('./ssl/key.pem'),
   cert: fs.readFileSync('./ssl/cert.pem'),
 };

  const app = await NestFactory.create(AppModule, {
    httpsOptions, // Passar as opções HTTPS
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
  });

  // Habilitar Helmet para segurança
  app.use(helmet());

  // Habilitar CORS para permitir requisições do frontend Angular
  app.enableCors({
    origin: 'https://localhost:4200', // Altere para HTTPS
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
   
      // Habilitar validação global de DTOs
      app.useGlobalPipes(new ValidationPipe({
        transform: true, // Transforma payloads de entrada em instâncias de DTO
        whitelist: true, // Remove propriedades que não estão definidas no DTO
        forbidNonWhitelisted: true, // Lança um erro se propriedades não definidas forem enviadas
      }));
   
      await app.listen(process.env.PORT ?? 3000);
    }
    bootstrap();
