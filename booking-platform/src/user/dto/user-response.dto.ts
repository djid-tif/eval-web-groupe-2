import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class UserResponseDto {
    @ApiProperty({ example: 1, description: 'User ID' })
    id: number;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Keycloak user ID' })
    keycloak_id: string;

    @ApiProperty({ example: 'user@example.com', description: 'User email', required: false })
    email?: string;

    @ApiProperty({ example: '2024-03-19T12:00:00.000Z', description: 'Date of creation' })
    created_at: string;

    constructor(user: User) {
        this.id = user.id;
        this.keycloak_id = user.keycloak_id;
        this.email = user.email;
        this.created_at = user.created_at.toISOString();
    }
}
