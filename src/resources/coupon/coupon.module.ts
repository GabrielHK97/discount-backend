import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Store } from '../store/entities/store.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coupon, Store]),
  ],
  controllers: [CouponController],
  providers: [CouponService]
})
export class CouponModule {}
