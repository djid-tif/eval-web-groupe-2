import { Controller, Get, Post, Put, Param, Query, Body, ParseIntPipe, BadRequestException, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('Users')
@Controller('api/users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Get all users' })
    @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of items to skip' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max number of items to return' })
    @ApiResponse({ status: 200, description: 'List of users', type: [UserResponseDto] })
    @Get()
    async getUsers(
        @Query('skip') skipParam?: string,
        @Query('limit') limitParam?: string,
    ): Promise<{ users: UserResponseDto[] }> {
        const skip = skipParam ? parseInt(skipParam, 10) : 0;
        const limit = limitParam ? parseInt(limitParam, 10) : 10;
        
        if (skip < 0 || limit <= 0) {
            throw new BadRequestException('Skip and limit must be positive numbers');
        }
        const users = await this.userService.findAll(skip, limit);
        return { users: users.map(user => new UserResponseDto(user)) };
    }

    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Get(':id')
    async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
        const user = await this.userService.findOne(id);
        return new UserResponseDto(user);
    }

    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created', type: UserResponseDto })
    @Post()
    async createUser(@Body() data: CreateUserDto): Promise<UserResponseDto> {
        const user = await this.userService.create(data);
        return new UserResponseDto(user);
    }

    @ApiOperation({ summary: 'Generate user reservation extract as CSV' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({ status: 201, description: 'CSV file generated', schema: { example: { url: 'https://example.com/file.csv' } } })
    @HttpCode(201)
    @Post(':id/extract')
    async extractUserReservations(@Param('id', ParseIntPipe) id: number): Promise<{ url: string }> {
        const url = await this.userService.generateCSVExtract(id);
        return { url };
    }
}
