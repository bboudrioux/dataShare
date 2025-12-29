import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { UserRepository } from './users.repository';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  const mockUser = {
    id: 'user-uuid',
    email: 'test@example.com',
    password: 'hashed_password',
    created_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findById: jest
              .fn()
              .mockImplementation(() => Promise.resolve(mockUser)),
            findByEmail: jest
              .fn()
              .mockImplementation(() => Promise.resolve(mockUser)),
            delete: jest.fn().mockImplementation(() => Promise.resolve()),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  describe('getById', () => {
    it('should return a user if found', async () => {
      const result = await service.getById('user-uuid');
      expect(result).toEqual(mockUser);
      expect(repository['findById']).toHaveBeenCalledWith('user-uuid');
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);
      await expect(service.getById('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getByEmail', () => {
    it('should return a user if email exists', async () => {
      const result = await service.getByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(repository['findByEmail']).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should throw NotFoundException if email is not found', async () => {
      jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);
      await expect(service.getByEmail('wrong@test.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should call delete on repository if user exists', async () => {
      // On s'assure que getById (appelé en interne) trouve le user
      jest.spyOn(service, 'getById').mockResolvedValue(mockUser as any);

      await service.delete('user-uuid');

      expect(repository['delete']).toHaveBeenCalledWith('user-uuid');
    });

    it('should throw NotFoundException if user to delete does not exist', async () => {
      // On simule que le user n'existe pas lors du check initial
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      await expect(service.delete('unknown')).rejects.toThrow(
        NotFoundException,
      );
      expect(repository['delete']).not.toHaveBeenCalled();
    });
  });
});
