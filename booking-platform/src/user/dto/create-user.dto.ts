import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Keycloak user ID' })
    @IsString()
    keycloak_id: string;

    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    @IsEmail()
    email: string;
}
