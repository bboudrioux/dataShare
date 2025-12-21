import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UseFilters,
  UploadedFile,
  Body,
  Get,
  Param,
  Delete,
  Res,
  StreamableFile,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FileOwnerGuard } from '../../common/guards/file-owner.guard';
import { MulterExceptionFilter } from '../../common/filters/multer-exception.filter';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { GeneratedFileId } from '../../common/decorators/file-id.decorator';
import { UploadFileDto } from './dtos/upload-file.dto';
import { FilesService } from './files.service';
import * as crypto from 'crypto';
import path from 'path';
import fs from 'fs';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Uploader un nouveau fichier (Max 1 Go)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  @ApiResponse({ status: 201, description: 'Fichier uploadé avec succès.' })
  @ApiResponse({
    status: 413,
    description: 'Fichier trop volumineux (Max 1 Go).',
  })
  @UseFilters(MulterExceptionFilter)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, _, cb) => {
          const fileId = crypto.randomUUID();
          (req as any).generatedFileId = fileId;
          cb(null, fileId);
        },
      }),
      limits: { fileSize: 1024 * 1024 * 1024 }, // 1 GB
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadFileDto,
    @GetUser('userId') userId: string,
    @GeneratedFileId() fileId: string,
  ) {
    try {
      return await this.filesService.upload(file, dto, userId, fileId);
    } catch (error) {
      const filePath = path.join(process.cwd(), 'uploads', fileId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: "Liste des fichiers de l'utilisateur connecté" })
  @ApiResponse({ status: 200, description: 'Liste récupérée.' })
  getAll(@GetUser('userId') userId: string) {
    return this.filesService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: "Récupérer les métadonnées d'un fichier spécifique",
  })
  @ApiParam({ name: 'id', description: 'ID unique du fichier (UUID)' })
  @UseGuards(FileOwnerGuard)
  getOne(@Param('id') id: string) {
    return this.filesService.findById(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Télécharger le fichier physiquement' })
  @ApiParam({ name: 'id', description: 'ID du fichier' })
  @ApiQuery({
    name: 'password',
    required: false,
    description: 'Mot de passe si le fichier est protégé',
  })
  @ApiResponse({ status: 200, description: 'Le téléchargement commence.' })
  @ApiResponse({
    status: 403,
    description: 'Mot de passe incorrect ou accès refusé.',
  })
  @UseGuards(FileOwnerGuard)
  async download(
    @Param('id') id: string,
    @Query('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { stream, name, type } = await this.filesService.getDownloadableFile(
      id,
      password,
    );

    res.set({
      'Content-Type': type,
      'Content-Disposition': `attachment; filename="${name}"`,
    });

    return new StreamableFile(stream);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer manuellement un fichier' })
  @ApiResponse({ status: 200, description: 'Fichier supprimé.' })
  @UseGuards(FileOwnerGuard)
  delete(@Param('id') id: string) {
    return this.filesService.delete(id);
  }
}
