import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateRoomDto {
    @ApiProperty({ example: 'Conference Room A', description: 'Room name' })
    @IsString()
    name: string;

    @ApiProperty({ example: 20, description: 'Capacity of the room' })
    @IsInt()
    capacity: number;

    @ApiProperty({ example: '2nd Floor', description: 'Location of the room', required: false })
    @IsOptional()
    @IsString()
    location?: string;
}
