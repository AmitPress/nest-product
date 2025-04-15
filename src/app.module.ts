import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { SeederService } from './seeder/seeder.service';
import { ApiModule } from './api/api.module';
@Module({
  imports: [
    UserModule, 
    DbModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ApiModule
  ],
  controllers: [],
  providers: [AppService, SeederService],
})
export class AppModule {}
