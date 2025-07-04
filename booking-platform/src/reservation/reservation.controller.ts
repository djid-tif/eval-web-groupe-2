import {
    Controller, Get, Post, Put, Delete, Param, Query, Body, ParseIntPipe, BadRequestException, HttpCode
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';

@ApiTags('Reservations')
@ApiBearerAuth()
@Controller('api/reservations')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @ApiOperation({ summary: 'Get all reservations' })
    @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of items to skip' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max number of items to return' })
    @ApiResponse({ status: 200, description: 'List of reservations', type: [ReservationResponseDto] })
    @Get()
    async getReservations(
        @Query('skip') skipParam?: string,
        @Query('limit') limitParam?: string,
    ): Promise<ReservationResponseDto[]> {
        const skip = skipParam ? parseInt(skipParam, 10) : 0;
        const limit = limitParam ? parseInt(limitParam, 10) : 10;
        
        if (skip < 0 || limit <= 0) {
            throw new BadRequestException('Skip and limit must be positive numbers');
        }
        const reservations = await this.reservationService.findAll(skip, limit);
        return reservations.map(reservation => new ReservationResponseDto(reservation));
    }

    @ApiOperation({ summary: 'Get a reservation by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Reservation ID' })
    @ApiResponse({ status: 200, description: 'Reservation found', type: ReservationResponseDto })
    @ApiResponse({ status: 404, description: 'Reservation not found' })
    @Get(':id')
    async getReservation(@Param('id', ParseIntPipe) id: number): Promise<ReservationResponseDto> {
        const reservation = await this.reservationService.findOne(id);
        return new ReservationResponseDto(reservation);
    }

    @ApiOperation({ summary: 'Create a new reservation' })
    @ApiResponse({ status: 201, description: 'Reservation created', type: ReservationResponseDto })
    @Post()
    async createReservation(@Body() data: CreateReservationDto): Promise<ReservationResponseDto> {
        const reservation = await this.reservationService.create(data);
        return new ReservationResponseDto(reservation);
    }

    @ApiOperation({ summary: 'Update reservation details' })
    @ApiParam({ name: 'id', type: Number, description: 'Reservation ID' })
    @ApiResponse({ status: 200, description: 'Reservation updated', type: ReservationResponseDto })
    @Put(':id')
    async updateReservation(@Param('id', ParseIntPipe) id: number, @Body() data: any): Promise<ReservationResponseDto> {
        const reservation = await this.reservationService.update(id, data);
        return new ReservationResponseDto(reservation);
    }

    @ApiOperation({ summary: 'Update reservation status' })
    @ApiParam({ name: 'id', type: Number, description: 'Reservation ID' })
    @ApiResponse({ status: 200, description: 'Reservation updated', type: ReservationResponseDto })
    @Put(':id/status')
    async updateReservationStatus(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateReservationDto): Promise<ReservationResponseDto> {
        const reservation = await this.reservationService.updateStatus(id, data.status);
        return new ReservationResponseDto(reservation);
    }

    @ApiOperation({ summary: 'Delete a reservation' })
    @ApiParam({ name: 'id', type: Number, description: 'Reservation ID' })
    @ApiResponse({ status: 204, description: 'Reservation deleted' })
    @ApiResponse({ status: 404, description: 'Reservation not found' })
    @HttpCode(204)
    @Delete(':id')
    async deleteReservation(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.reservationService.delete(id);
    }
}
