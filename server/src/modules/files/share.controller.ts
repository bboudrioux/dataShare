import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  StreamableFile,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { FilesService } from './files.service';

@ApiTags('Public Share')
@Controller('share')
export class ShareController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer les métadonnées publiques d’un fichier partagé',
  })
  @ApiParam({ name: 'id', description: 'ID unique du fichier (UUID)' })
  @ApiResponse({ status: 200, description: 'Métadonnées récupérées.' })
  @ApiResponse({ status: 401, description: 'Lien expiré.' })
  @ApiResponse({ status: 404, description: 'Fichier introuvable.' })
  async getMetadata(@Param('id') id: string) {
    const file = await this.filesService.findById(id);

    if (file.expiration_date < new Date()) {
      throw new UnauthorizedException('Ce lien a expiré');
    }

    return file;
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Télécharger un fichier via son lien public' })
  @ApiParam({ name: 'id', description: 'ID du fichier' })
  @ApiQuery({
    name: 'password',
    required: false,
    description: 'Mot de passe si requis',
  })
  @ApiResponse({ status: 200, description: 'Flux binaire du fichier.' })
  async download(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
    @Query('password') password?: string,
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
}
