import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { Reservation, ReservationStatus } from './reservation.entity';
import { UserService } from '../user/user.service';
import { RoomService } from '../room/room.service';
import { JwtAuthGuard } from "../auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@Resolver(() => Reservation)
export class ReservationResolver {
    constructor(
        private readonly reservationService: ReservationService,
        private readonly userService: UserService,
        private readonly roomService: RoomService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Query(() => [Reservation])
    async listReservations(
        @Args('skip', { type: () => Int, nullable: true }) skip = 0,
        @Args('limit', { type: () => Int, nullable: true }) limit = 10,
    ): Promise<Reservation[]> {
        return this.reservationService.findAll(skip, limit);
    }

    @UseGuards(JwtAuthGuard)
    @Query(() => Reservation)
    async reservation(@Args('id', { type: () => ID }) id: number): Promise<Reservation> {
        return this.reservationService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => Reservation)
    async createReservation(
        @Args('user_id', { type: () => ID }) user_id: number,
        @Args('room_id', { type: () => ID }) room_id: number,
        @Args('start_time', { type: () => Date }) start_time: Date,
        @Args('end_time', { type: () => Date }) end_time: Date,
    ): Promise<Reservation> {
        const user = await this.userService.findOne(user_id);
        if (!user) throw new Error('User not found');

        const room = await this.roomService.findOne(room_id);
        if (!room) throw new Error('Room not found');

        return this.reservationService.create({ 
            user_id, 
            room_id, 
            start_time: start_time.toISOString(), 
            end_time: end_time.toISOString() 
        });
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => Reservation)
    async updateReservation(
        @Args('id', { type: () => ID }) id: number,
        @Args('start_time', { type: () => Date, nullable: true }) start_time?: Date,
        @Args('end_time', { type: () => Date, nullable: true }) end_time?: Date,
    ): Promise<Reservation> {
        const updateData: { start_time?: string; end_time?: string } = {};
        
        if (start_time) {
            updateData.start_time = start_time.toISOString();
        }
        if (end_time) {
            updateData.end_time = end_time.toISOString();
        }

        return this.reservationService.update(id, updateData);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => Boolean)
    async deleteReservation(@Args('id', { type: () => ID }) id: number): Promise<boolean> {
        await this.reservationService.delete(id);
        return true;
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => Reservation)
    async updateReservationStatus(
        @Args('id', { type: () => ID }) id: number,
        @Args('status') status: ReservationStatus,
    ): Promise<Reservation> {
        return this.reservationService.updateStatus(id, status);
    }
}
