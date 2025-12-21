import { Injectable } from '@nestjs/common';
import { Prisma, File } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class FileRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.FileCreateInput): Promise<File> {
    return this.prisma.file.create({ data });
  }
}
