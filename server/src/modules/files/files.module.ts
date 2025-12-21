import { Module } from '@nestjs/common';
import { FileOwnerGuard } from '../../common/guards/file-owner.guard';
import { FileRepository } from './files.repository';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ShareController } from './share.controller';

@Module({
  providers: [FilesService, FileRepository, FileOwnerGuard],
  controllers: [FilesController, ShareController],
})
export class FilesModule {}
