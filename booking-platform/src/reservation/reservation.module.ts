import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { ReservationResolver } from './reservation.resolver';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    NotificationModule,
    UserModule,
    RoomModule
  ],
  providers: [ReservationService, ReservationResolver],
  controllers: [ReservationController],
  exports: [ReservationService],
})
export class ReservationModule {}
