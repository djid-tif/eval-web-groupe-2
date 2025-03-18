import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RoomResolver } from './room.resolver';
import {Room} from "./room.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  providers: [RoomService, RoomResolver],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
