import { Controller, Get } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Controller('user')
export class UserController {
    constructor(private readonly db : DbService){}
    @Get()
    async test() {
        const result = await this.db.query<any>("select 69 as Piledriver")
        return result.rows;
    }
}
