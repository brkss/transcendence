import { Module } from '@nestjs/common'
import { authController} from './auth.controller'
import { authService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { auth42Strategy } from './strategies/auth42.strategy'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
    imports: [ConfigModule.forRoot(), PassportModule.register({ defaultStrategy: '42-auth2'})],
    controllers: [authController],
    providers: [authService, auth42Strategy],
})
export class AuthModule {

}
