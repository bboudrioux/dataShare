import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FileRepository } from './files.repository';
import { UploadFileDto } from './dtos/upload-file.dto';
import { PasswordService } from '../auth/password.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  private uploadDir = path.resolve('uploads');

  constructor(private readonly filesRepository: FileRepository) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file, dto: UploadFileDto, userId: string, fileId) {
    if (dto.password) {
      dto.password = await PasswordService.hash(dto.password);
    }

    const MAX_EXPIRATION_DAYS = 7;
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() + MAX_EXPIRATION_DAYS);

    let expirationDate: Date;

    if (dto.expiration_date) {
      const userDate = new Date(dto.expiration_date);

      if (userDate > limitDate || userDate < new Date()) {
        expirationDate = limitDate;
      } else {
        expirationDate = userDate;
      }
    } else {
      expirationDate = limitDate;
    }

    return this.filesRepository.create({
      id: fileId,
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
      password: dto.password,
      expiration_date: expirationDate,
      user: {
        connect: { id: userId },
      },
    });
  }

  async getDownloadableFile(id: string, password?: string) {
    const fileInfo = await this.findById(id);
    const filePath = path.join(process.cwd(), 'uploads', fileInfo.id);

    const now = new Date();
    if (fileInfo.expiration_date < now) {
      throw new UnauthorizedException(
        "Ce fichier a expiré et n'est plus disponible",
      );
    }

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(
        'Le fichier physique est introuvable sur le serveur',
      );
    }

    if (fileInfo.password) {
      if (!password) {
        throw new UnauthorizedException('Ce fichier nécessite un mot de passe');
      }

      const isPasswordValid = await PasswordService.compare(
        password,
        fileInfo.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Mot de passe incorrect');
      }
    }

    return {
      stream: fs.createReadStream(filePath),
      name: fileInfo.name,
      type: fileInfo.type,
    };
  }

  async findByUser(userId: string) {
    const files = await this.filesRepository.findByUser(userId);

    const now = new Date();

    return files.map((file) => ({
      id: file.id,
      name: file.name,
      size: file.size.toString(),
      created_date: file.created_date,
      expiration_date: file.expiration_date,
      status: file.expiration_date > now ? 'valide' : 'expiré',
      hasPassword: !!file.password,
    }));
  }

  async findById(id: string) {
    const file = await this.filesRepository.findById(id);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async delete(id: string) {
    const file = await this.findById(id);

    const filePath = path.join(process.cwd(), 'uploads', file.id);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.filesRepository.delete(id);

    return { message: 'Fichier supprimé avec succès' };
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleFileCleanup() {
    console.info('Lancement du nettoyage des fichiers expirés...');
    const now = new Date();

    const expiredFiles = await this.filesRepository.findExpired(now);

    for (const file of expiredFiles) {
      try {
        const filePath = path.join(process.cwd(), 'uploads', file.id);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        await this.filesRepository.setAsExpired(file.id);

        console.log(`Fichier expiré supprimé : ${file.name} (${file.id})`);
      } catch (error) {
        console.error(`Erreur lors du nettoyage du fichier ${file.id}:`, error);
      }
    }
  }
}
