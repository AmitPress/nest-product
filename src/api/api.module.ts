import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [ApiController],
  providers: [DbService]
})
export class ApiModule {}
