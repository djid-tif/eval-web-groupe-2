import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class UserResponseDto {
    @ApiProperty({ example: 1, description: 'User ID' })
    id: number;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Keycloak user ID' })
    keycloakId: string;

    @ApiProperty({ example: 'user@example.com', description: 'User email', required: false })
    email?: string;

    @ApiProperty({ example: 'john_doe', description: 'Username', required: false })
    username?: string;

    @ApiProperty({ example: 'John', description: 'First name', required: false })
    firstName?: string;

    @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
    lastName?: string;

    @ApiProperty({ example: '2024-03-19T12:00:00.000Z', description: 'Date of creation' })
    createdAt: string;

    constructor(user: User) {
        this.id = user.id;
        this.keycloakId = user.keycloak_id;
        this.email = user.email;
        this.username = user.username;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.createdAt = user.created_at.toISOString();
    }
}
