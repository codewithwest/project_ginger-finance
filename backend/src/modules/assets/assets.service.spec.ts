import { Test, TestingModule } from '@nestjs/testing';
import { AssetsService } from './assets.service';
import { getModelToken } from '@nestjs/mongoose';
import { Asset } from './schemas/asset.schema';
import { Types } from 'mongoose';

describe('AssetsService', () => {
  let service: AssetsService;
  let model: any;

  beforeEach(async () => {
    model = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetsService,
        {
          provide: getModelToken(Asset.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<AssetsService>(AssetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return assets for user', async () => {
      const userId = new Types.ObjectId().toHexString();
      const mockResult = [{ name: 'Tractor' }];

      model.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResult),
      });

      const result = await service.findAll(userId);
      expect(result).toEqual(mockResult);
    });
  });
});
