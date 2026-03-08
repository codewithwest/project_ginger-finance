import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { TransactionsService } from '../transactions/transactions.service';
import { AssetsService } from '../assets/assets.service';
import { SavingsService } from '../savings/savings.service';
import { FarmCyclesService } from '../farm-cycles/farm-cycles.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let transactionsService: Partial<TransactionsService>;

  beforeEach(async () => {
    transactionsService = {
      findAllByCycle: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: TransactionsService, useValue: transactionsService },
        { provide: AssetsService, useValue: {} },
        { provide: SavingsService, useValue: {} },
        { provide: FarmCyclesService, useValue: {} },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  describe('getFarmCycleProfitability', () => {
    it('should calculate profit correctly', async () => {
      const mockTransactions = [
        { type: 'expense', amount: 1000 },
        { type: 'expense', amount: 500 },
        { type: 'income', amount: 5000 },
      ];
      (transactionsService.findAllByCycle as jest.Mock).mockResolvedValue(mockTransactions);

      const result = await service.getFarmCycleProfitability('cycle123');
      expect(result.totalExpenses).toBe(1500);
      expect(result.totalIncome).toBe(5000);
      expect(result.netProfit).toBe(3500);
    });

    it('should handle cycles with zero revenue/expenses', async () => {
      (transactionsService.findAllByCycle as jest.Mock).mockResolvedValue([]);

      const result = await service.getFarmCycleProfitability('empty_cycle');
      expect(result.totalExpenses).toBe(0);
      expect(result.totalIncome).toBe(0);
      expect(result.netProfit).toBe(0);
    });
  });
});
