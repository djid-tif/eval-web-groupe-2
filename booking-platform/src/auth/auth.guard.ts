import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    if (!request) {
      throw new UnauthorizedException("No request found in GraphQL context");
    }
    return request;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException("Invalid or missing token");
    }
    return user;
  }
}
