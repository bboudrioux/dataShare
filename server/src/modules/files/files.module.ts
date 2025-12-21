import { Module } from '@nestjs/common';
import { FileRepository } from './files.repository';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Module({
  providers: [FilesService, FileRepository],
  controllers: [FilesController],
})
export class FilesModule {}
