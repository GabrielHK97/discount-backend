import { Test, TestingModule } from '@nestjs/testing';
import { CouponOfUserController } from './coupon-of-user.controller';
import { CouponOfUserService } from './coupon-of-user.service';

describe('CouponOfUserController', () => {
  let controller: CouponOfUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponOfUserController],
      providers: [CouponOfUserService],
    }).compile();

    controller = module.get<CouponOfUserController>(CouponOfUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
