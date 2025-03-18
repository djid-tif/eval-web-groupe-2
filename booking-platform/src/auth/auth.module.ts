import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/user.entity";

@Module({
  imports: [
      PassportModule,
      TypeOrmModule.forFeature([User])
  ],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtStrategy, TypeOrmModule],
})
export class AuthModule {}

