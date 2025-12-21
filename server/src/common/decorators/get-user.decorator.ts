import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface UserPayload {
  userId: string;
  email: string;
}

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as UserPayload;

    if (!user) {
      return null;
    }

    return data ? user[data as keyof UserPayload] : user;
  },
);
