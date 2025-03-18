import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsISO8601, IsEnum } from 'class-validator';
import { ReservationStatus } from '../reservation.entity';

export class CreateReservationDto {
    @ApiProperty({ example: 1, description: 'User ID' })
    @IsInt()
    user_id: number;

    @ApiProperty({ example: 2, description: 'Room ID' })
    @IsInt()
    room_id: number;

    @ApiProperty({ example: '2024-03-19T14:00:00.000Z', description: 'Start time (ISO 8601 format)' })
    @IsISO8601()
    start_time: string;

    @ApiProperty({ example: '2024-03-19T16:00:00.000Z', description: 'End time (ISO 8601 format)' })
    @IsISO8601()
    end_time: string;

    @ApiProperty({ example: 'pending', enum: ReservationStatus, description: 'Reservation status' })
    @IsEnum(ReservationStatus)
    status?: ReservationStatus;
}
