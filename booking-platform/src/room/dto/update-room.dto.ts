import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateRoomDto {
    @ApiProperty({ example: 'Conference Room A', description: 'Room name', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ example: 20, description: 'Capacity of the room', required: false })
    @IsOptional()
    @IsInt()
    capacity?: number;

    @ApiProperty({ example: '2nd Floor', description: 'Location of the room', required: false })
    @IsOptional()
    @IsString()
    location?: string;
}
