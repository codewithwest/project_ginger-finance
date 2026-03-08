import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('mock_token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password if valid', async () => {
      const password = 'password123';
      const passwordHash = await bcrypt.hash(password, 10);
      const mockResult = {
        _id: '1',
        email: 'test@test.com',
        username: 'testuser',
        passwordHash,
        toObject: () => ({
          _id: '1',
          email: 'test@test.com',
          username: 'testuser',
        }),
      };
      
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.validateUser('test@test.com', password);
      expect(result).toBeDefined();
      expect(result.passwordHash).toBeUndefined();
      expect(result.email).toBe('test@test.com');
    });

    it('should return null if password invalid', async () => {
      const mockResult = { email: 'test@test.com', passwordHash: 'hash' };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.validateUser('test@test.com', 'wrongpassword');
      expect(result).toBeNull();
    });
  });
});
