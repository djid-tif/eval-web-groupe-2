import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import * as dotenv from 'dotenv';
import { User } from '../user/user.entity';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        console.log(process.env.KEYCLOAK_URL);
        console.log(process.env.KEYCLOAK_REALM);

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            algorithms: ['RS256'],
            secretOrKeyProvider: jwksRsa.passportJwtSecret({
                jwksUri: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
                cache: true,
                rateLimit: true,
            }),
        });
    }

    async validate(payload: any) {
        let user = await this.userRepository.findOne({
            where: { keycloak_id: payload.sub },
        });

        if (!user) {
            user = this.userRepository.create({
                keycloak_id: payload.sub,
                email: payload.email || payload.preferred_username,
            });
            user = await this.userRepository.save(user);
        }

        return {
            userId: user.id,
            email: user.email,
            roles: payload.realm_access?.roles || [],
        };
    }
}
