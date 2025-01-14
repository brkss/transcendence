import { Module } from '@nestjs/common'
import { authController} from './auth.controller'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { auth42Strategy } from './strategies/auth42.strategy'
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserModule } from 'src/user/user.module'

@Module({
    imports: [
        UserModule,
        PassportModule.register({
            defaultStrategy: '42-auth2'
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get("JWT_REFRESH_SECRET"),
                //signOptions: { expiresIn: '15m' },
            }),
          }),
        ],

    controllers: [authController],
    providers: [AuthService, auth42Strategy],
    exports: [JwtModule]
})
export class AuthModule {

}
