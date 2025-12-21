import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GeneratedFileId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const fileId = (request as any).generatedFileId as string | undefined;

    return fileId!;
  },
);
