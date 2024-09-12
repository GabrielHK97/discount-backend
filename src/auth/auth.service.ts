import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ServiceData } from 'src/utils/classes/ServiceData.class';
import { extractTokenFromHeader } from 'src/utils/functions/extractTokenFromHeader.function';
import { Admin } from 'src/resources/admin/entities/admin.entity';
import { toDataURL } from 'qrcode';
import * as speakeasy from 'speakeasy';

export interface IToken {
  token: string;
}

export interface IQRCode {
  status: boolean;
}

@Injectable()
export class AuthService {
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

  async register(authDto: AuthDto): Promise<ServiceData> {
    try {
      if (await this.hasUsername(authDto.username)) {
        return new ServiceData(HttpStatus.BAD_REQUEST, 'Usuário já existente!');
      } else {
        bcrypt.hash(authDto.password, 10, async (err, hash) => {
          authDto.password = hash;
          const auth = this.adminRepository.create(authDto);
          auth.qrcodeActive = false;
          await this.adminRepository.save(auth);
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

  async login(authDto: AuthDto): Promise<ServiceData<IToken | IQRCode>> {
    try {
      const auth = await this.adminRepository.findOneByOrFail({
        username: authDto.username,
      });
      const isPasswordValid = await bcrypt.compare(
        authDto.password,
        auth.password,
      );
      const isTwoFARequired = auth.qrcodeActive;
      const isTwoFAValid = isTwoFARequired
        ? speakeasy.totp.verify({
            secret: process.env.QRCODE_SECRET!,
            token: authDto.twofa,
            algorithm: 'sha1',
          })
        : true;
      if (!isPasswordValid) {
        return new ServiceData<IToken>(
          HttpStatus.BAD_REQUEST,
          'Credenciais inválidas!',
        );
      }
      if (isTwoFARequired && !authDto.twofa) {
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
          id: auth.id,
          username: auth.username,
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
    const token = extractTokenFromHeader(req.headers.cookie);
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
      const token = extractTokenFromHeader(req.headers.cookie);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const auth = await this.adminRepository.findOneByOrFail({
        username: payload.username,
      });
      return new ServiceData(HttpStatus.OK, `QRCode ativado!`, {
        status: auth.qrcodeActive,
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
      const token = extractTokenFromHeader(req.headers.cookie);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const auth = await this.adminRepository.findOneByOrFail({
        username: payload.username,
      });
      auth.qrcodeActive = true;
      await this.adminRepository.save(auth);
      return new ServiceData(HttpStatus.OK, `QRCode ativado!`);
    } catch (error) {
      return new ServiceData(
        HttpStatus.BAD_REQUEST,
        `Não foi possível ativar o QRCode!`,
      );
    }
  }

  async disableQRCode(authDto: AuthDto, req: Request): Promise<ServiceData> {
    try {
      if (
        speakeasy.totp.verify({
          secret: process.env.QRCODE_SECRET!,
          token: authDto.twofa,
          algorithm: 'sha1',
        })
      ) {
        const token = extractTokenFromHeader(req.headers.cookie);
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
        const auth = await this.adminRepository.findOneByOrFail({
          username: payload.username,
        });
        auth.qrcodeActive = false;
        await this.adminRepository.save(auth);
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
      const token = extractTokenFromHeader(req.headers.cookie);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const auth = await this.adminRepository.findOneByOrFail({
        username: payload.username,
      });
      if (auth.qrcodeActive) {
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
      console.log(error);
      return new ServiceData(
        HttpStatus.BAD_REQUEST,
        `Não foi possível gerar o QRCode!`,
      );
    }
  }
}
