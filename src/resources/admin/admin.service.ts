import { HttpStatus, Injectable } from '@nestjs/common';
import { ServiceData } from 'src/utils/classes/ServiceData.class';
import { toDataURL } from 'qrcode';
import * as speakeasy from 'speakeasy';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AdminDto } from './dto/admin.dto';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';
import { extractTokenFromHeader } from 'src/utils/functions/extractTokenFromHeader.function';
import { IToken } from './interfaces/token.interface';
import { IQRCode } from './interfaces/qrcode.interface';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async hasUsername(username: string): Promise<boolean> {
    return await this.adminRepository
      .findOneByOrFail({ username })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  async register(adminDto: AdminDto): Promise<ServiceData> {
    try {
      if (await this.hasUsername(adminDto.username)) {
        return new ServiceData(HttpStatus.BAD_REQUEST, 'Usuário já existente!');
      } else {
        bcrypt.hash(adminDto.password, 10, async (err, hash) => {
          adminDto.password = hash;
          const admin = this.adminRepository.create(adminDto);
          admin.qrcodeActive = false;
          await this.adminRepository.save(admin);
        });
        return new ServiceData(HttpStatus.OK, 'Registrado com sucesso!');
      }
    } catch (error) {
      return new ServiceData(
        HttpStatus.BAD_REQUEST,
        'Não foi possível registar usuário!',
      );
    }
  }

  async login(adminDto: AdminDto): Promise<ServiceData<IToken | IQRCode>> {
    try {
      const admin = await this.adminRepository.findOneByOrFail({
        username: adminDto.username,
      });
      const isPasswordValid = await bcrypt.compare(
        adminDto.password,
        admin.password,
      );
      const isTwoFARequired = admin.qrcodeActive;
      const isTwoFAValid = isTwoFARequired
        ? speakeasy.totp.verify({
            secret: process.env.QRCODE_SECRET!,
            token: adminDto.twofa,
            algorithm: 'sha1',
          })
        : true;
      if (!isPasswordValid) {
        return new ServiceData<IToken>(
          HttpStatus.BAD_REQUEST,
          'Credenciais inválidas!',
        );
      }
      if (isTwoFARequired && !adminDto.twofa) {
        return new ServiceData<IQRCode>(HttpStatus.OK, 'Pré-Logado!', {
          status: true,
        });
      }
      if (!isTwoFAValid) {
        return new ServiceData<IToken>(
          HttpStatus.BAD_REQUEST,
          'Credenciais inválidas!',
        );
      }
      return new ServiceData<IToken>(HttpStatus.OK, 'Logado!', {
        token: this.jwtService.sign({
          id: admin.id,
          username: admin.username,
        }),
      });
    } catch (error) {
      return new ServiceData<IToken>(
        HttpStatus.BAD_REQUEST,
        'Credenciais inválidas!',
      );
    }
  }

  async authenticate(req: Request): Promise<ServiceData> {
    const token = extractTokenFromHeader('adminToken', req.headers.cookie);
    return await this.jwtService
      .verifyAsync(token)
      .then(() => {
        return new ServiceData(HttpStatus.OK, 'Autenticado!');
      })
      .catch(() => {
        return new ServiceData(
          HttpStatus.UNAUTHORIZED,
          'Não foi possível autenticar!',
        );
      });
  }

  async statusQRCode(req: Request): Promise<ServiceData<IQRCode>> {
    try {
      const token = extractTokenFromHeader('adminToken', req.headers.cookie);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const admin = await this.adminRepository.findOneByOrFail({
        username: payload.username,
      });
      return new ServiceData(HttpStatus.OK, `QRCode ativado!`, {
        status: admin.qrcodeActive,
      });
    } catch (error) {
      return new ServiceData(
        HttpStatus.BAD_REQUEST,
        `Não foi possível ativar o QRCode!`,
      );
    }
  }

  async enableQRCode(req: Request): Promise<ServiceData> {
    try {
      const token = extractTokenFromHeader('adminToken', req.headers.cookie);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const admin = await this.adminRepository.findOneByOrFail({
        username: payload.username,
      });
      admin.qrcodeActive = true;
      await this.adminRepository.save(admin);
      return new ServiceData(HttpStatus.OK, `QRCode ativado!`);
    } catch (error) {
      return new ServiceData(
        HttpStatus.BAD_REQUEST,
        `Não foi possível ativar o QRCode!`,
      );
    }
  }

  async disableQRCode(adminDto: AdminDto, req: Request): Promise<ServiceData> {
    try {
      if (
        speakeasy.totp.verify({
          secret: process.env.QRCODE_SECRET!,
          token: adminDto.twofa,
          algorithm: 'sha1',
        })
      ) {
        const token = extractTokenFromHeader('adminToken', req.headers.cookie);
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
        const admin = await this.adminRepository.findOneByOrFail({
          username: payload.username,
        });
        admin.qrcodeActive = false;
        await this.adminRepository.save(admin);
        return new ServiceData(HttpStatus.OK, `QRCode desativado!`);
      } else {
        return new ServiceData(
          HttpStatus.BAD_REQUEST,
          `Não foi possível desativar o QRCode!`,
        );
      }
    } catch (error) {
      return new ServiceData(
        HttpStatus.BAD_REQUEST,
        `Não foi possível desativar o QRCode!`,
      );
    }
  }

  async generateQRCode(req: Request): Promise<ServiceData<any>> {
    try {
      const token = extractTokenFromHeader('adminToken', req.headers.cookie);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const admin = await this.adminRepository.findOneByOrFail({
        username: payload.username,
      });
      if (admin.qrcodeActive) {
        const otpAuth = speakeasy.otpauthURL({
          secret: process.env.QRCODE_SECRET!,
          label: process.env.APP_NAME!,
          algorithm: 'sha1',
        });
        const qrCode = await toDataURL(otpAuth);
        return new ServiceData(HttpStatus.OK, `QRCode gerado!`, {
          qrCode,
        });
      } else {
        return new ServiceData(
          HttpStatus.BAD_REQUEST,
          `Não foi possível gerar o QRCode!`,
        );
      }
    } catch (error) {
      return new ServiceData(
        HttpStatus.BAD_REQUEST,
        `Não foi possível gerar o QRCode!`,
      );
    }
  }
}
