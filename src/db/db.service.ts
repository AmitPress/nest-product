import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient } from 'pg'
import { ConfigService } from '@nestjs/config';
@Injectable()
export class DbService implements OnModuleDestroy{
    private readonly pool: Pool;
    constructor(private config: ConfigService) {
        this.pool = new Pool({
            host: config.get<string>("PRODUCTION_HOST"),
            port: config.get<number>("PG_PORT"),
            user: config.get<string>("PG_USER"),
            password: config.get<string>("PG_PASS"),
            database: config.get<string>("PG_DB"),
        });
    }
    async onModuleDestroy() {
        await this.pool.end;
    }
    async query<T>(text: string, parameters?: any[]): Promise<{rows:T[]}>{
        return await this.pool.query(text, parameters)
    }
}
