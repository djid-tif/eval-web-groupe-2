import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => [User])
    async listUsers(
        @Args('skip', { type: () => Int, nullable: true }) skip = 0,
        @Args('limit', { type: () => Int, nullable: true }) limit = 10,
    ): Promise<User[]> {
        return this.userService.findAll(skip, limit);
    }

    @Query(() => User)
    async user(@Args('id', { type: () => Int }) id: number): Promise<User> {
        return this.userService.findOne(id);
    }

    @Mutation(() => User)
    async createUser(
        @Args('keycloak_id') keycloak_id: string,
        @Args('email', { nullable: true }) email?: string,
    ): Promise<User> {
        return this.userService.create({ keycloak_id, email });
    }
}
