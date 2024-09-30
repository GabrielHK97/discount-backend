import { Injectable } from '@nestjs/common';
import { CreateCouponOfUserDto } from './dto/create-coupon-of-user.dto';
import { UpdateCouponOfUserDto } from './dto/update-coupon-of-user.dto';

@Injectable()
export class CouponOfUserService {
  create(createCouponOfUserDto: CreateCouponOfUserDto) {
    return 'This action adds a new couponOfUser';
  }

  findAll() {
    return `This action returns all couponOfUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} couponOfUser`;
  }

  update(id: number, updateCouponOfUserDto: UpdateCouponOfUserDto) {
    return `This action updates a #${id} couponOfUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} couponOfUser`;
  }
}
