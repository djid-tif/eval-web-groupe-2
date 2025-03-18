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
        const user = await this.userRepository.findOne({
            where: { keycloak_id: payload.sub },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return {
            userId: user.id,
            email: user.email,
            roles: payload.realm_access?.roles || [],
        };
    }
}
