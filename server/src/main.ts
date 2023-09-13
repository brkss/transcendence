import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';


async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cors({
		origin: 'http://localhost:3000', 
		credentials: true, 
	}))
	app.use(cookieParser())
	app.useGlobalPipes(new ValidationPipe())
	await app.listen(8000);
}
bootstrap();
