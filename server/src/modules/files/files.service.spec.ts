import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { FileRepository } from './files.repository';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PasswordService } from '../auth/password.service';
import { UploadFileDto } from './dtos/upload-file.dto';
import * as fs from 'fs';

// Mock complet du module fs pour éviter de toucher au disque
jest.mock('fs');

// Mock du PasswordService pour resoudre le probleme d'import de bcrypt
jest.mock('../auth/password.service', () => {
  return {
    PasswordService: {
      hash: jest.fn().mockResolvedValue('hashed_mock'),
      compare: jest.fn().mockResolvedValue(true),
    },
  };
});

describe('FilesService', () => {
  let service: FilesService;
  let repository: FileRepository;

  const mockFile = {
    id: 'file-uuid',
    name: 'vacances.jpg',
    type: 'image/jpeg',
    size: 1024 * 1024,
    password: 'hashed_password',
    created_date: new Date(),
    expiration_date: new Date(Date.now() + 3600000), // Expire dans 1h
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: FileRepository,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((data) =>
                Promise.resolve({ ...mockFile, ...data }),
              ),
            findById: jest
              .fn()
              .mockImplementation(() => Promise.resolve(mockFile)),
            findByUser: jest
              .fn()
              .mockImplementation(() => Promise.resolve([mockFile])),
            delete: jest.fn().mockImplementation(() => Promise.resolve()),
            findExpired: jest
              .fn()
              .mockImplementation(() => Promise.resolve([])),
            setAsExpired: jest.fn().mockImplementation(() => Promise.resolve()),
          },
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    repository = module.get<FileRepository>(FileRepository);

    // Reset les mocks de fs avant chaque test
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should hash password and create file record', async () => {
      jest
        .spyOn(PasswordService, 'hash')
        .mockResolvedValue('new_hashed_password');

      const file = {
        originalname: 'test.txt',
        mimetype: 'text/plain',
        size: 500,
      };
      const dto = {
        password: 'password123',
        expiration_date: '',
      } as UploadFileDto;

      const result = await service.upload(file, dto, 'user-id', 'new-uuid');

      expect(PasswordService['hash']).toHaveBeenCalledWith('password123');
      expect(repository['create']).toHaveBeenCalled();
      expect(result.hasPassword).toBe(true);
    });

    it('should force max expiration if user date is too far', async () => {
      const farDate = new Date();
      farDate.setDate(farDate.getDate() + 20); // 20 jours au lieu de 7

      const file = {
        originalname: 'test.txt',
        mimetype: 'text/plain',
        size: 500,
      };
      const dto = { expiration_date: farDate.toISOString() } as UploadFileDto;

      const result = await service.upload(file, dto, 'user-id', 'new-uuid');

      const resDate = new Date(result.expiration_date);
      const diffDays = Math.ceil(
        (resDate.getTime() - Date.now()) / (1000 * 3600 * 24),
      );
      expect(diffDays).toBe(7);
    });
  });

  describe('getDownloadableFile', () => {
    it('should throw if password is required but missing', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true); // Simule fichier existant
      await expect(service.getDownloadableFile('file-uuid')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if file does not exist on disk', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false); // Simule fichier absent

      await expect(
        service.getDownloadableFile('file-uuid', 'password123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return stream if password is valid and file exists', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(PasswordService, 'compare').mockResolvedValue(true);
      (fs.createReadStream as jest.Mock).mockReturnValue('fake-stream');

      const result = await service.getDownloadableFile(
        'file-uuid',
        'password123',
      );

      expect(result.stream).toBe('fake-stream');
    });
  });

  describe('delete', () => {
    it('should delete from repository and remove physical file', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const unlinkSpy = jest.spyOn(fs, 'unlinkSync').mockImplementation();

      await service.delete('file-uuid');

      expect(unlinkSpy).toHaveBeenCalled();
      expect(repository['delete']).toHaveBeenCalledWith('file-uuid');
    });
  });

  describe('handleFileCleanup', () => {
    it('should clean multiple expired files', async () => {
      const expiredFiles = [
        { id: '1', name: 'f1.txt' },
        { id: '2', name: 'f2.txt' },
      ];
      jest
        .spyOn(repository, 'findExpired')
        .mockResolvedValue(expiredFiles as any);
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const unlinkSpy = jest.spyOn(fs, 'unlinkSync').mockImplementation();

      await service.handleFileCleanup();

      expect(unlinkSpy).toHaveBeenCalledTimes(2);
      expect(repository['setAsExpired']).toHaveBeenCalledTimes(2);
    });
  });
});
