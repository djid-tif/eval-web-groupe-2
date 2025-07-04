import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Keycloak user ID', required: false })
    @IsOptional()
    @IsString()
    keycloak_id?: string;

    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password', required: false })
    @IsOptional()
    @IsString()
    password?: string;

    @ApiProperty({ example: 'john_doe', description: 'Username', required: false })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({ example: 'John', description: 'First name', required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
    @IsOptional()
    @IsString()
    lastName?: string;
}
