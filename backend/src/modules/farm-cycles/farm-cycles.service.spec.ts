import { Test, TestingModule } from '@nestjs/testing';
import { FarmCyclesService } from './farm-cycles.service';
import { getModelToken } from '@nestjs/mongoose';
import { FarmCycle } from './schemas/farm-cycle.schema';
import { Types } from 'mongoose';

describe('FarmCyclesService', () => {
  let service: FarmCyclesService;
  let model: any;

  beforeEach(async () => {
    model = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      constructor: jest.fn().mockImplementation((data) => ({
        ...data,
        save: jest.fn().mockResolvedValue(data),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmCyclesService,
        {
          provide: getModelToken(FarmCycle.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<FarmCyclesService>(FarmCyclesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return cycles for user', async () => {
      const userId = new Types.ObjectId().toHexString();
      const mockResult = [{ name: '2026 Maize' }];

      const findMock = {
        exec: jest.fn().mockResolvedValue(mockResult),
      };
      model.find.mockReturnValue(findMock);

      const result = await service.findAll(userId);
      expect(result).toEqual(mockResult);
      expect(model.find).toHaveBeenCalledWith({
        userId: new Types.ObjectId(userId),
      });
    });
  });

  describe('markAsCompleted', () => {
    it('should update cycle status', async () => {
      const cycleId = new Types.ObjectId().toHexString();
      const mockResult = { _id: cycleId, isCompleted: true };

      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResult),
      });

      const result = await service.markAsCompleted(cycleId);
      expect(result).toEqual(mockResult);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        cycleId,
        { isCompleted: true },
        { new: true },
      );
    });
  });
});
