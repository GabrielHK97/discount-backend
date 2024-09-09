import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('/register')
  // async register(
  //   @Body() authDto: AuthDto,
  //   @Res() res: Response,
  // ): Promise<Response> {
  //   const response = await this.authService.register(authDto);
  //   return res.status(response.status).send(response.getMetadata());
  // }

  @Post('/login')
  async login(
    @Body() authDto: AuthDto,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.authService.login(authDto);
    return response.data
      ? res
          .status(response.status)
          .cookie('token', response.data.token, {httpOnly: true})
          .send(response.getMetadata())
      : res.status(response.status).send(response.getMetadata());
  }

  @Get('/logout')
  async logout(
    @Res() res: Response,
  ): Promise<Response> {
    return res.status(HttpStatus.OK).cookie('token', 'logout', {httpOnly: true}).send();
  }

  @Get()
  async authenticate(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.authService.authenticate(req);
    return res.status(response.status).send(response.getMetadata());
  }

  @UseGuards(AuthGuard)
  @Post('/qrcode')
  async generateQRCode(@Req() req: Request, @Res() res: Response) {
      const serviceData = await this.authService.generateQRCode(req);
      return res.status(serviceData.status).send(serviceData.getMetadata());
  }

  @UseGuards(AuthGuard)
  @Post('/qrcode/status')
  async statusQRCode(@Req() req: Request, @Res() res: Response) {
      const serviceData = await this.authService.statusQRCode(req);
      return res.status(serviceData.status).send(serviceData.getMetadata());
  }

  @UseGuards(AuthGuard)
  @Post('/qrcode/enable')
  async enableQRCode(@Req() req: Request, @Res() res: Response) {
      const serviceData = await this.authService.enableQRCode(req);
      return res.status(serviceData.status).send(serviceData.getMetadata());
  }

  @UseGuards(AuthGuard)
  @Post('/qrcode/disable')
  async disableQRCode(@Body() authDto: AuthDto, @Req() req: Request, @Res() res: Response) {
      const serviceData = await this.authService.disableQRCode(authDto, req);
      return res.status(serviceData.status).send(serviceData.getMetadata());
  }
}
