import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RoomService } from './room.service';
import { Room } from './room.entity';

@Resolver(() => Room)
export class RoomResolver {
    constructor(private readonly roomService: RoomService) {}

    @Query(() => [Room])
    getAllRooms(): Promise<Room[]> {
        return this.roomService.findAll();
    }

    @Mutation(() => Room)
    createRoom(@Args('name') name: string, @Args('capacity') capacity: number): Promise<Room> {
        return this.roomService.create({ name, capacity });
    }
}
