import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@ObjectType()
@Entity({ name: 'users' })
@Unique(['keycloak_id'])
export class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ type: 'uuid', unique: true })
    keycloak_id: string;

    @Field({ nullable: true })
    @Column({ type: 'varchar', length: 255, nullable: true })
    email?: string;

    @Field({ nullable: true })
    @Column({ type: 'varchar', length: 255, nullable: true })
    username?: string;

    @Field({ nullable: true })
    @Column({ type: 'varchar', length: 255, nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    @Column({ type: 'varchar', length: 255, nullable: true })
    lastName?: string;

    @Field()
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
