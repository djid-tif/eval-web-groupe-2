import { ApiProperty } from '@nestjs/swagger';
import { Reservation, ReservationStatus } from '../reservation.entity';
import { UserResponseDto } from '../../user/dto/user-response.dto';
import { RoomResponseDto } from '../../room/dto/room-response.dto';

export class ReservationResponseDto {
    @ApiProperty({ example: 1, description: 'Reservation ID' })
    id: number;

    @ApiProperty({ type: UserResponseDto, description: 'User who made the reservation' })
    user: UserResponseDto;

    @ApiProperty({ type: RoomResponseDto, description: 'Reserved room' })
    room: RoomResponseDto;

    @ApiProperty({ example: '2024-03-19T14:00:00.000Z', description: 'Start time' })
    startTime: string;

    @ApiProperty({ example: '2024-03-19T16:00:00.000Z', description: 'End time' })
    endTime: string;

    @ApiProperty({ example: 'pending', enum: ReservationStatus, description: 'Status' })
    status: ReservationStatus;

    @ApiProperty({ example: '2024-03-18T12:00:00.000Z', description: 'Created at' })
    createdAt: string;

    constructor(reservation: Reservation) {
        this.id = reservation.id;
        this.user = new UserResponseDto(reservation.user);
        this.room = new RoomResponseDto(reservation.room);
        this.startTime = reservation.start_time.toISOString();
        this.endTime = reservation.end_time.toISOString();
        this.status = reservation.status;
        this.createdAt = reservation.created_at.toISOString();
    }
}
