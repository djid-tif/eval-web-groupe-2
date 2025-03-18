import { Controller, Get, Post, Body } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './room.entity';

@Controller('rooms')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Get()
    getAllRooms(): Promise<Room[]> {
        return this.roomService.findAll();
    }

    @Post()
    createRoom(@Body() roomData: Partial<Room>): Promise<Room> {
        return this.roomService.create(roomData);
    }
}
