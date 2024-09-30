import { Test, TestingModule } from '@nestjs/testing';
import { CouponOfUserService } from './coupon-of-user.service';

describe('CouponOfUserService', () => {
  let service: CouponOfUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouponOfUserService],
    }).compile();

    service = module.get<CouponOfUserService>(CouponOfUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
