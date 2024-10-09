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
import { AdminService } from './admin.service';
import { AdminDto } from './dto/admin.dto';
import { Request, Response } from 'express';
import { IToken } from './interfaces/token.interface';
import { AdminGuard } from './admin.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/register')
  async register(
    @Body() adminDto: AdminDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.adminService.register(adminDto);
    return res.status(response.status).send(response.getMetadata());
  }

  @Post('/login')
  async login(
    @Body() adminDto: AdminDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.adminService.login(adminDto);
    return response.data
      ? res
          .status(response.status)
          .cookie('adminToken', (response.data as IToken).token, { httpOnly: true })
          .send(response.getMetadata())
      : res.status(response.status).send(response.getMetadata());
  }

  @Get('/logout')
  async logout(@Res() res: Response): Promise<Response> {
    return res
      .status(HttpStatus.OK)
      .cookie('adminToken', 'logout', { httpOnly: true })
      .send();
  }

  @Get('/authenticate')
  async authenticate(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.adminService.authenticate(req);
    return res.status(response.status).send(response.getMetadata());
  }

  @UseGuards(AdminGuard)
  @Get('/qrcode')
  async generateQRCode(@Req() req: Request, @Res() res: Response) {
    const serviceData = await this.adminService.generateQRCode(req);
    return res.status(serviceData.status).send(serviceData.getMetadata());
  }

  @UseGuards(AdminGuard)
  @Get('/qrcode/status')
  async statusQRCode(@Req() req: Request, @Res() res: Response) {
    const serviceData = await this.adminService.statusQRCode(req);
    return res.status(serviceData.status).send(serviceData.getMetadata());
  }

  @UseGuards(AdminGuard)
  @Get('/qrcode/enable')
  async enableQRCode(@Req() req: Request, @Res() res: Response) {
    const serviceData = await this.adminService.enableQRCode(req);
    return res.status(serviceData.status).send(serviceData.getMetadata());
  }

  @UseGuards(AdminGuard)
  @Post('/qrcode/disable')
  async disableQRCode(
    @Body() adminDto: AdminDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const serviceData = await this.adminService.disableQRCode(adminDto, req);
    return res.status(serviceData.status).send(serviceData.getMetadata());
  }
}
