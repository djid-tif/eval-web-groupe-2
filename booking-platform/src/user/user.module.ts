import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Reservation } from '../reservation/reservation.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User, Reservation])],
  providers: [UserService, UserResolver],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
