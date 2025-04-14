import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { SeederService } from './seeder/seeder.service';
@Module({
  imports: [
    UserModule, 
    DbModule,
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [],
  providers: [AppService, SeederService],
})
export class AppModule {}
