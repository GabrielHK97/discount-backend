import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CouponOfUserService } from './coupon-of-user.service';
import { CreateCouponOfUserDto } from './dto/create-coupon-of-user.dto';
import { UpdateCouponOfUserDto } from './dto/update-coupon-of-user.dto';

@Controller('coupon-of-user')
export class CouponOfUserController {
  constructor(private readonly couponOfUserService: CouponOfUserService) {}

  @Post()
  create(@Body() createCouponOfUserDto: CreateCouponOfUserDto) {
    return this.couponOfUserService.create(createCouponOfUserDto);
  }

  @Get()
  findAll() {
    return this.couponOfUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponOfUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCouponOfUserDto: UpdateCouponOfUserDto) {
    return this.couponOfUserService.update(+id, updateCouponOfUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponOfUserService.remove(+id);
  }
}
