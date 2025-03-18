import { Controller, Get, Post, Put, Delete, Param, Query, Body, HttpCode, ParseIntPipe } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './room.entity';

@Controller('api/rooms')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Get()
    async getRooms(
        @Query('skip', ParseIntPipe) skip = 0,
        @Query('limit', ParseIntPipe) limit = 10,
    ): Promise<{ rooms: Room[] }> {
        const rooms = await this.roomService.findAll(skip, limit);
        return { rooms };
    }

    @Get(':id')
    async getRoom(@Param('id', ParseIntPipe) id: number): Promise<Room> {
        return this.roomService.findOne(id);
    }

    @Post()
    async createRoom(@Body() data: Partial<Room>): Promise<Room> {
        return this.roomService.create(data);
    }

    @Put(':id')
    async updateRoom(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<Room>): Promise<Room> {
        return this.roomService.update(id, data);
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteRoom(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.roomService.delete(id);
    }
}
