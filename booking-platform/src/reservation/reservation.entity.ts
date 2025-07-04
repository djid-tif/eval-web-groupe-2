import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Room } from '../room/room.entity';

export enum ReservationStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled',
}

@ObjectType()
@Entity({ name: 'reservations' })
export class Reservation {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => ID)
    @Column({ name: 'user_id' })
    user_id: number;

    @Field(() => ID)
    @Column({ name: 'room_id' })
    room_id: number;

    @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    @Field(() => User)
    user: User;

    @ManyToOne(() => Room, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'room_id' })
    @Field(() => Room)
    room: Room;

    @Field()
    @Column({ type: 'timestamp', nullable: false })
    start_time: Date;

    @Field()
    @Column({ type: 'timestamp', nullable: false })
    end_time: Date;

    @Field()
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @Field()
    @Column({ type: 'enum', enum: ReservationStatus, default: ReservationStatus.PENDING })
    status: ReservationStatus;
}
