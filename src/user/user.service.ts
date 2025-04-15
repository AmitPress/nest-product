import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from './user.jwtstrategy';

@Injectable()
export class AuthService {
  private redisClient: Redis;
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
    this.redisClient = new Redis({
      host: "redis",
      port: config.get<number>("REDIS_PORT"),
      connectTimeout: 10000,
      db: 5
    });
  }

  async login(user: UserPayload) {
    const accessToken = this.jwtService.sign(
        user.email
    );
    await this.redisClient.setex(user.email, 3600, accessToken);

    return { access_token: accessToken };
  }

  async validateUser(email: string, password: string) {
    if (email && password) {
      return { email };
    }
    return null;
  }
}
