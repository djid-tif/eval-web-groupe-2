import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { RoomService } from './room.service';
import { Room } from './room.entity';

@Resolver(() => Room)
export class RoomResolver {
    constructor(private readonly roomService: RoomService) {}

    @Query(() => [Room])
    async listRooms(
        @Args('skip', { type: () => Int, nullable: true }) skip = 0,
        @Args('limit', { type: () => Int, nullable: true }) limit = 10,
    ): Promise<Room[]> {
        return this.roomService.findAll(skip, limit);
    }

    @Query(() => Room)
    async room(@Args('id', { type: () => ID }) id: number): Promise<Room> {
        return this.roomService.findOne(id);
    }

    @Mutation(() => Room)
    async createRoom(
        @Args('name') name: string,
        @Args('capacity', { type: () => Int }) capacity: number,
        @Args('location', { nullable: true }) location?: string,
    ): Promise<Room> {
        return this.roomService.create({ name, capacity, location });
    }

    @Mutation(() => Room)
    async updateRoom(
        @Args('id', { type: () => ID }) id: number,
        @Args('name', { nullable: true }) name?: string,
        @Args('capacity', { type: () => Int, nullable: true }) capacity?: number,
        @Args('location', { nullable: true }) location?: string,
    ): Promise<Room> {
        return this.roomService.update(id, { name, capacity, location });
    }

    @Mutation(() => Boolean)
    async deleteRoom(@Args('id', { type: () => ID }) id: number): Promise<boolean> {
        await this.roomService.delete(id);
        return true;
    }
}
