import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SeederService } from './seeder/seeder.service';
@Injectable()
export class AppService implements OnApplicationBootstrap{
    constructor(private readonly seeder: SeederService){}
    async onApplicationBootstrap() {
        if(await this.seeder.isNotAlreadyPopulated()){
            await this.seeder.populateUsers();
            await this.seeder.populateProducts();
            await this.seeder.populateOrderEntryForeachUser();
            await this.seeder.populateOrderItemsForeachOrder();
        }
    }
}
