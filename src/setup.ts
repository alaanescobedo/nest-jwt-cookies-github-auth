import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as cookieParser from 'cookie-parser'

export const setup = (app: INestApplication) => {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.use(cookieParser('secret'))
  app.enableCors({
    credentials: true,
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Credentials'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  })
} 