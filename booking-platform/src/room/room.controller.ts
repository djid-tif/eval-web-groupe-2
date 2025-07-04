import {
    Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException, UseGuards, HttpCode
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomResponseDto } from './dto/room-response.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('Rooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/rooms')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @ApiOperation({ summary: 'Get all rooms' })
    @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of items to skip' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max number of items to return' })
    @ApiResponse({ status: 200, description: 'List of rooms', type: [RoomResponseDto] })
    @Get()
    async getRooms(
        @Query('skip') skip?: string,
        @Query('limit') limit?: string,
    ): Promise<{ rooms: RoomResponseDto[] }> {
        const parsedSkip = skip ? parseInt(skip, 10) : 0;
        const parsedLimit = limit ? parseInt(limit, 10) : 10;

        if (isNaN(parsedSkip) || isNaN(parsedLimit) || parsedSkip < 0 || parsedLimit <= 0) {
            throw new BadRequestException('Skip and limit must be positive numbers');
        }

        return { rooms: (await this.roomService.findAll(parsedSkip, parsedLimit)).map(room => new RoomResponseDto(room)) };
    }

    @ApiOperation({ summary: 'Get a room by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Room ID' })
    @ApiResponse({ status: 200, description: 'Room found', type: RoomResponseDto })
    @ApiResponse({ status: 404, description: 'Room not found' })
    @Get(':id')
    async getRoom(@Param('id', ParseIntPipe) id: number): Promise<RoomResponseDto> {
        const room = await this.roomService.findOne(id);
        return new RoomResponseDto(room);
    }

    @ApiOperation({ summary: 'Create a new room' })
    @ApiResponse({ status: 201, description: 'Room created', type: RoomResponseDto })
    @Post()
    async createRoom(@Body() data: CreateRoomDto): Promise<RoomResponseDto> {
        const room = await this.roomService.create(data);
        return new RoomResponseDto(room);
    }

    @ApiOperation({ summary: 'Update room details' })
    @ApiParam({ name: 'id', type: Number, description: 'Room ID' })
    @ApiResponse({ status: 200, description: 'Room updated', type: RoomResponseDto })
    @Put(':id')
    async updateRoom(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateRoomDto): Promise<RoomResponseDto> {
        const room = await this.roomService.update(id, data);
        return new RoomResponseDto(room);
    }

    @ApiOperation({ summary: 'Delete a room' })
    @ApiParam({ name: 'id', type: Number, description: 'Room ID' })
    @ApiResponse({ status: 204, description: 'Room deleted' })
    @ApiResponse({ status: 404, description: 'Room not found' })
    @HttpCode(204)
    @Delete(':id')
    async deleteRoom(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.roomService.delete(id);
    }
}
