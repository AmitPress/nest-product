import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy, ExtractJwt, StrategyOptionsWithRequest} from 'passport-jwt';
import {ConfigService} from '@nestjs/config';
import {Redis} from 'ioredis';

export interface UserPayload{
    email: string,
    password: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private redisClient: Redis;

    constructor(private config: ConfigService){
        super({
            jwtFromRequest: (req)=> req && req.headers ? req.headers['authorization']?.split(' ')[1] : null,
            secretOrKey: config.get<string>("JWT_TOKEN")
        } as StrategyOptionsWithRequest)
        this.redisClient = new Redis({
            host: "redis",
            port: config.get("REDIS_PORT"),
            connectTimeout: 10000,
            db: 2
        });
    }

    async validate(payload: UserPayload) {
        const tokenExists = await this.redisClient.exists(payload.email)
        if (!tokenExists) {
            throw new Error('Token not valid or expired');
        }
        const email = payload.email;
        return { email };
    }
}
