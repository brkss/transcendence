import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import { IoAdapter } from '@nestjs/platform-socket.io';


async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cors({
		origin: 'http://localhost:3000', 
		credentials: true, 
	}))
	app.useGlobalPipes(new ValidationPipe())
	app.useWebSocketAdapter(new IoAdapter(app));
	app.use(cookieParser())
	await app.listen(8000);
}
bootstrap();
