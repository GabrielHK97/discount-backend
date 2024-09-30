import { Module } from '@nestjs/common';
import { CouponOfUserService } from './coupon-of-user.service';
import { CouponOfUserController } from './coupon-of-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponOfUser } from './entities/coupon-of-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CouponOfUser]),
  ],
  controllers: [CouponOfUserController],
  providers: [CouponOfUserService]
})
export class CouponOfUserModule {}
