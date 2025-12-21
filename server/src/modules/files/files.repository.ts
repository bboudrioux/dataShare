import { Injectable } from '@nestjs/common';
import { Prisma, File } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class FileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<File | null> {
    return this.prisma.file.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  findByUser(userId: string): Promise<File[]> {
    return this.prisma.file.findMany({
      where: { user_id: userId },
      orderBy: { created_date: 'desc' },
    });
  }

  async findExpired(now: Date) {
    return this.prisma.file.findMany({
      where: {
        expiration_date: {
          lt: now,
        },
      },
    });
  }

  create(data: Prisma.FileCreateInput): Promise<File> {
    return this.prisma.file.create({ data });
  }

  delete(id: string): Promise<File> {
    return this.prisma.file.delete({
      where: { id },
    });
  }
}
