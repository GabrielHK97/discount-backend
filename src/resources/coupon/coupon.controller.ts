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
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Paginator } from 'src/utils/classes/Paginator.class';
import { StoreGuard } from '../store/store.guard';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @UseGuards(StoreGuard)
  @Post('/create')
  async create(
    @Body() createCouponDto: CreateCouponDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = await this.couponService.create(req, createCouponDto);
    return res.status(response.status).send(response.getMetadata());
  }

  @UseGuards(StoreGuard)
  @Post('/list')
  async findAll(@Res() res: Response, @Body() paginator: Paginator) {
    const response = await this.couponService.findAll(paginator);
    return res.status(response.status).send(response.getMetadata());
  }

  @UseGuards(StoreGuard)
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  @UseGuards(StoreGuard)
  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponService.update(+id, updateCouponDto);
  }

  @UseGuards(StoreGuard)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.couponService.remove(+id);
  }
}
