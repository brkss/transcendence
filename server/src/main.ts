import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import path = require('path')
import { API_URL_BASE } from './constants';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cors({
		origin: API_URL_BASE, 
		credentials: true, 
	}))
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
		forbidNonWhitelisted: true,
		disableErrorMessages: false,
	}))
	app.useWebSocketAdapter(new IoAdapter(app));
	app.use(cookieParser())
	await app.listen(8000);
}
bootstrap();
