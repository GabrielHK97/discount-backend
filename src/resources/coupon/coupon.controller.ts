import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Paginator } from 'src/utils/classes/Paginator.class';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('/create')
  async create(
    @Body() createCouponDto: CreateCouponDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.couponService.create(req, createCouponDto);
    return res.status(response.status).send(response.getMetadata());
  }

  @Post('/list')
  async findAll(@Res() res: Response, @Body() paginator: Paginator) {
    const response = await this.couponService.findAll(paginator);
    return res.status(response.status).send(response.getMetadata());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponService.update(+id, updateCouponDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponService.remove(+id);
  }
}
