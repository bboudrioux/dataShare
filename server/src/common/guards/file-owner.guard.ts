import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { FileRepository } from '../../modules/files/files.repository';

@Injectable()
export class FileOwnerGuard implements CanActivate {
  constructor(private readonly filesRepository: FileRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user.userId;
    const fileId = req.params.id;

    const file = await this.filesRepository.findById(fileId);

    if (!file || file.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
