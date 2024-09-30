import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StoreService } from './store.service';
import { StoreDto } from './dto/store.dto';
import { IToken } from '../admin/interfaces/token.interface';
import { StoreGuard } from './store.guard';
import { CreateStoreDto } from './dto/create-store.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('/register')
  async register(
    @Body() createStoreDto: CreateStoreDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.storeService.register(createStoreDto);
    return res.status(response.status).send(response.getMetadata());
  }

  @Post('/login')
  async login(
    @Body() storeDto: StoreDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.storeService.login(storeDto);
    return response.data
      ? res
          .status(response.status)
          .cookie('storeToken', (response.data as IToken).token, { httpOnly: true })
          .send(response.getMetadata())
      : res.status(response.status).send(response.getMetadata());
  }

  @Get('/logout')
  async logout(@Res() res: Response): Promise<Response> {
    return res
      .status(HttpStatus.OK)
      .cookie('storeToken', 'logout', { httpOnly: true })
      .send();
  }

  @Get('/authenticate')
  async authenticate(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.storeService.authenticate(req);
    return res.status(response.status).send(response.getMetadata());
  }

  @UseGuards(StoreGuard)
  @Get('/qrcode')
  async generateQRCode(@Req() req: Request, @Res() res: Response) {
    const serviceData = await this.storeService.generateQRCode(req);
    return res.status(serviceData.status).send(serviceData.getMetadata());
  }

  @UseGuards(StoreGuard)
  @Get('/qrcode/status')
  async statusQRCode(@Req() req: Request, @Res() res: Response) {
    const serviceData = await this.storeService.statusQRCode(req);
    return res.status(serviceData.status).send(serviceData.getMetadata());
  }

  @UseGuards(StoreGuard)
  @Get('/qrcode/enable')
  async enableQRCode(@Req() req: Request, @Res() res: Response) {
    const serviceData = await this.storeService.enableQRCode(req);
    return res.status(serviceData.status).send(serviceData.getMetadata());
  }

  @UseGuards(StoreGuard)
  @Post('/qrcode/disable')
  async disableQRCode(
    @Body() storeDto: StoreDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const serviceData = await this.storeService.disableQRCode(storeDto, req);
    return res.status(serviceData.status).send(serviceData.getMetadata());
  }
}
