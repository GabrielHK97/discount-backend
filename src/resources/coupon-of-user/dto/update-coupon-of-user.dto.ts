import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponOfUserDto } from './create-coupon-of-user.dto';

export class UpdateCouponOfUserDto extends PartialType(CreateCouponOfUserDto) {}
