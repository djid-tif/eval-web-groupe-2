import {
    Controller, Get, Post, Put, Param, Query, Body, ParseIntPipe, BadRequestException, NotFoundException
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { UserService } from '../user/user.service';
import { RoomService } from '../room/room.service';
import { Reservation, ReservationStatus } from './reservation.entity';

@Controller('api/reservations')
export class ReservationController {
    constructor(
        private readonly reservationService: ReservationService,
        private readonly userService: UserService,
        private readonly roomService: RoomService
    ) {}

    @Get()
    async getReservations(
        @Query('skip', ParseIntPipe) skip = 0,
        @Query('limit', ParseIntPipe) limit = 10,
    ): Promise<{ reservations: Reservation[] }> {
        if (skip < 0 || limit <= 0) {
            throw new BadRequestException('Skip and limit must be positive numbers');
        }
        const reservations = await this.reservationService.findAll(skip, limit);
        return { reservations };
    }

    @Get(':id')
    async getReservation(@Param('id', ParseIntPipe) id: number): Promise<Reservation> {
        return this.reservationService.findOne(id);
    }

    @Post()
    async createReservation(@Body() data: { user_id: number, room_id: number, start_time: string, end_time: string }): Promise<Reservation> {
        if (!data.user_id || !data.room_id || !data.start_time || !data.end_time) {
            throw new BadRequestException('All fields are required');
        }

        const user = await this.userService.findOne(data.user_id);
        if (!user) throw new NotFoundException('User not found');

        const room = await this.roomService.findOne(data.room_id);
        if (!room) throw new NotFoundException('Room not found');

        return this.reservationService.create({ user, room, start_time: new Date(data.start_time), end_time: new Date(data.end_time) });
    }

    @Put(':id/status')
    async updateReservationStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: ReservationStatus,
    ): Promise<Reservation> {
        return this.reservationService.updateStatus(id, status);
    }
}
