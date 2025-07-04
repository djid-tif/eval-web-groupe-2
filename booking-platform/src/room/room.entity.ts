import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'rooms' })
export class Room {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Field(() => Int)
    @Column({ type: 'int', nullable: false, default: 0 })
    capacity: number;

    @Field({ nullable: true })
    @Column({ type: 'varchar', length: 255, nullable: true })
    location?: string;

    @Field()
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
