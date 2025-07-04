import { ApiProperty } from '@nestjs/swagger';
import { Room } from '../room.entity';

export class RoomResponseDto {
    @ApiProperty({ example: 1, description: 'Room ID' })
    id: number;

    @ApiProperty({ example: 'Conference Room A', description: 'Room name' })
    name: string;

    @ApiProperty({ example: 20, description: 'Capacity of the room' })
    capacity: number;

    @ApiProperty({ example: '2nd Floor', description: 'Location of the room' })
    location?: string;

    @ApiProperty({ example: '2024-03-18T12:00:00.000Z', description: 'Creation date of the room' })
    createdAt: string;

    constructor(room: Room) {
        this.id = room.id;
        this.name = room.name;
        this.capacity = room.capacity;
        this.location = room.location;
        this.createdAt = room.created_at.toISOString();
    }
}
