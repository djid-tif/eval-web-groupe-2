import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@ObjectType()
@Entity({ name: 'users' })
@Unique(['keycloak_id'])
export class User {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ type: 'uuid', unique: true })
    keycloak_id: string;

    @Field({ nullable: true })
    @Column({ type: 'varchar', length: 255, nullable: true })
    email?: string;

    @Field()
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
