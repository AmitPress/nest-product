import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module'
import { UserController } from './user.controller';
@Module({
    imports: [DbModule],
    controllers: [UserController]
})
export class UserModule {}
