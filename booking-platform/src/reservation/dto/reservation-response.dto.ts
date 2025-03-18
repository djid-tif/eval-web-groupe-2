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
    start_time: string;

    @ApiProperty({ example: '2024-03-19T16:00:00.000Z', description: 'End time' })
    end_time: string;

    @ApiProperty({ example: 'pending', enum: ReservationStatus, description: 'Status' })
    status: ReservationStatus;

    @ApiProperty({ example: '2024-03-18T12:00:00.000Z', description: 'Created at' })
    created_at: string;

    constructor(reservation: Reservation) {
        this.id = reservation.id;
        this.user = new UserResponseDto(reservation.user);
        this.room = new RoomResponseDto(reservation.room);
        this.start_time = reservation.start_time.toISOString();
        this.end_time = reservation.end_time.toISOString();
        this.status = reservation.status;
        this.created_at = reservation.created_at.toISOString();
    }
}
