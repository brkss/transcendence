import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import { IoAdapter } from '@nestjs/platform-socket.io';
import path = require('path')
import { JwtAuth } from './auth/guards/jwtauth.guard';


async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cors({
		origin: 'http://localhost:3000', 
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
