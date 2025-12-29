import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../users/users.repository';
import { UserService } from '../users/users.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UserRepository;
  let usersService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'uuid-123',
    email: 'test@example.com',
    password: 'hashedPassword',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest
              .fn()
              .mockImplementation(() => Promise.resolve(null)),
            create: jest
              .fn()
              .mockImplementation(() => Promise.resolve(mockUser)),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake-token'),
          },
        },
        {
          provide: UserService, // <--- Vérifie le nom ici
          useValue: { getByEmail: jest.fn() },
        },
        {
          provide: PasswordService,
          useValue: {
            compare: jest.fn(),
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    usersService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should throw ConflictException if user exists', async () => {
      jest
        .spyOn(userRepository, 'findByEmail')
        .mockResolvedValue(mockUser as any);

      await expect(
        service.register({ email: 'test@example.com', password: '123' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create a user, hash password and return a signed token', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(PasswordService, 'hash').mockResolvedValue('hashedPassword');

      const result = await service.register({
        email: 'test@example.com',
        password: '123',
      });

      // Vérification de l'utilisation de UserRepository
      expect(userRepository['create']).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashedPassword',
      });

      // VÉRIFICATION DE L'USAGE DU JWTSERVICE
      expect(jwtService['sign']).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });

      expect(result).toEqual({ access_token: 'fake-token' });
    });
  });

  describe('login', () => {
    it('should return a token and call jwtService.sign if credentials are valid', async () => {
      jest
        .spyOn(userRepository, 'findByEmail')
        .mockResolvedValue(mockUser as any);
      jest.spyOn(PasswordService, 'compare').mockResolvedValue(true);

      const result = await service.login({
        email: 'test@example.com',
        password: '123',
      });

      // Validation de l'appel au JwtService
      expect(jwtService['sign']).toHaveBeenCalled();
      expect(result).toEqual({ access_token: 'fake-token' });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      jest
        .spyOn(userRepository, 'findByEmail')
        .mockResolvedValue(mockUser as any);
      jest.spyOn(PasswordService, 'compare').mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const loginDto = { email: 'test@test.com', password: 'wrongpassword' };

      // Mock d'un utilisateur trouvé mais mot de passe différent
      jest.spyOn(usersService, 'getByEmail').mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        password: 'hashedPassword',
      } as any);

      // Mock de la comparaison qui échoue
      jest.spyOn(PasswordService, 'compare').mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
