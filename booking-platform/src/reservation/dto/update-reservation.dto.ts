import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ReservationStatus } from '../reservation.entity';

export class UpdateReservationDto {
    @ApiProperty({ example: 'approved', enum: ReservationStatus, description: 'New reservation status' })
    @IsEnum(ReservationStatus)
    status: ReservationStatus;
}
