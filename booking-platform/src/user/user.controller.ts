import {
    Controller, Get, Post, Put, Param, Query, Body, HttpCode,
    ParseIntPipe, BadRequestException, NotFoundException
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('api/users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getUsers(
        @Query('skip', ParseIntPipe) skip = 0,
        @Query('limit', ParseIntPipe) limit = 10,
    ): Promise<{ users: User[] }> {
        if (skip < 0 || limit <= 0) {
            throw new BadRequestException('Skip and limit must be positive numbers');
        }
        const users = await this.userService.findAll(skip, limit);
        return { users };
    }

    @Get(':id')
    async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.userService.findOne(id);
    }

    @Post()
    async createUser(@Body() data: Partial<User>): Promise<User> {
        return this.userService.create(data);
    }

    @Put(':id/extract')
    async extractUserReservations(@Param('id', ParseIntPipe) id: number): Promise<{ url: string }> {
        const url = await this.userService.generateCSVExtract(id);
        return { url };
    }
}
