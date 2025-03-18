import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
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
    async reservation(@Args('id', { type: () => Int }) id: number): Promise<Reservation> {
        return this.reservationService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => Reservation)
    async createReservation(
        @Args('user_id', { type: () => Int }) user_id: number,
        @Args('room_id', { type: () => Int }) room_id: number,
        @Args('start_time') start_time: string,
        @Args('end_time') end_time: string,
    ): Promise<Reservation> {
        const user = await this.userService.findOne(user_id);
        if (!user) throw new Error('User not found');

        const room = await this.roomService.findOne(room_id);
        if (!room) throw new Error('Room not found');

        return this.reservationService.create({ user_id, room_id, start_time, end_time });
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => Reservation)
    async updateReservationStatus(
        @Args('id', { type: () => Int }) id: number,
        @Args('status') status: ReservationStatus,
    ): Promise<Reservation> {
        return this.reservationService.updateStatus(id, status);
    }
}
