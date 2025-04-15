import { Controller, Post, Body } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { UserPayload } from './user.jwtstrategy';
import { AuthService } from './user.service';

@Controller('auth')
export class UserController {
    constructor(private readonly db : DbService, private readonly authService: AuthService){}
    @Post("/login")
    async login(@Body() credential: UserPayload) {
        const query = `
        select email
        from users
        where email = $1 and password = $2
        `
        const result = await this.db.query<any>(query, [credential.email, credential.password])
        if(result.rows.length == 0){
            return {
                message: "Login Failed"
            }
        }
        const user = await this.authService.validateUser(credential.email, credential.password)
        if(!user){
            return {
                message: "Credentials Does Not Match"
            }
        }
        return await this.authService.login(credential)
    }
}
