import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiProperty({ example: 'mon_mot_de_passe', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: '2025-12-30T00:00:00.000Z', required: false })
  @IsDateString()
  expiration_date?: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
