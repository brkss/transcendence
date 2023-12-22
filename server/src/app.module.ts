import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TwofactorauthService } from './auth/twofactorauth/twofactorauth.service';
import { TwofactorauController } from './auth/twofactorauth/twofactorauth.controller';
import { AuthService } from './auth/auth.service';
import { UserController } from './user/user.controller';
import { ChatModule } from './chat/chat.module';
import { RoomController } from './chat/room/room.controller';
import { RoomService } from './chat/room/room.service';
import { GameModule } from './game/engine/game.module';
import path = require('path')
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { GameController } from './game/game.controller';
import { GameService } from './game/game.service';


export const app_root: string = process.cwd()

@Module({
	imports: [
		AuthModule,
		PrismaModule,
		UserModule,
		ConfigModule.forRoot(
			{
				isGlobal:
					true,
			},
		),
		ServeStaticModule.forRoot({
			rootPath: path.join(app_root, '/uploads/images'),
			serveRoot: '/user/avatar/'
		}),
		ServeStaticModule.forRoot({
			rootPath: path.join(app_root, '/uploads/badges'),
			serveRoot: '/user/uploads/badges/'
		}),
		ChatModule,
		GameModule,
	],
	controllers: [
		AppController,
		TwofactorauController,
		UserController,
		RoomController,
		GameController,
	],
	providers: [
		AppService,
		AuthService,
		TwofactorauthService,
		RoomService,
		GameService,
	],
})
export class AppModule {}
