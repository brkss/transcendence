import { Module } from '@nestjs/common'
import { authController} from './auth.controller'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { auth42Strategy } from './strategies/auth42.strategy'
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
    imports: [
        ConfigModule.forRoot(),
        PassportModule.register({ defaultStrategy: '42-auth2'}),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get("JWT_SECRET"),
                signOptions: { expiresIn: '60s' },
            }),
          }),
        ],
    controllers: [authController],
    providers: [AuthService, auth42Strategy],
    exports: [JwtModule, ConfigModule]
})
export class AuthModule {

}
