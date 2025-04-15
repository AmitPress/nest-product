import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module'
import { UserController } from './user.controller';
import { JwtStrategy } from './user.jwtstrategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './user.guard';
import { AuthService } from './user.service';
@Module({
    imports: [
        DbModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject:[ConfigService],
            useFactory: async (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET') || "hello"
            }),
        })
    ],
    controllers: [UserController],
    providers: [JwtStrategy, JwtAuthGuard, AuthService]
})
export class UserModule {}
