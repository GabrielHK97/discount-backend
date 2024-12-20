import { HttpStatus, Injectable } from '@nestjs/common';
import { ServiceData } from 'src/utils/classes/ServiceData.class';
import { toDataURL } from 'qrcode';
import * as speakeasy from 'speakeasy';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { extractTokenFromHeader } from 'src/utils/functions/extractTokenFromHeader.function';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Store } from './entities/store.entity';
import { LoginStoreDto } from './dto/login-store.dto';
import { IToken } from '../admin/interfaces/token.interface';
import { IQRCode } from '../admin/interfaces/qrcode.interface';
import { CreateStoreDto } from './dto/create-store.dto';
import { PersonalDataStoreDto } from './dto/personal-data-store.dto';
import { StoreConverter } from './converter/store.converter';

dotenv.config();

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    private jwtService: JwtService,
  ) {}

  async hasUsername(username: string): Promise<boolean> {
    return await this.storeRepository
      .findOneByOrFail({ username })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  equalPasswords(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  async register(createStoreDto: CreateStoreDto): Promise<ServiceData> {
    try {
      if (await this.hasUsername(createStoreDto.username)) {
        return new ServiceData(HttpStatus.BAD_REQUEST, 'Usuário já existente!');
      }
      if (
        !this.equalPasswords(
          createStoreDto.password,
          createStoreDto.confirmPassword,
        )
      ) {
        return new ServiceData(HttpStatus.BAD_REQUEST, 'Senhas não coincidem!');
      }
      bcrypt.hash(createStoreDto.password, 10, async (err, hash) => {
        createStoreDto.password = hash;
        const store = this.storeRepository.create(createStoreDto);
        store.qrcodeActive = false;
        store.createdAt = new Date();
        store.updatedAt = store.createdAt;
        await this.storeRepository.save(store);
      });
      return new ServiceData(HttpStatus.OK, 'Registrado com sucesso!');
    } catch (error) {
      return new ServiceData(
        HttpStatus.BAD_REQUEST,
        'Não foi possível registar usuário!',
      );
    }
  }

  async login(
    loginStoreDto: LoginStoreDto,
  ): Promise<ServiceData<IToken | IQRCode>> {
    try {
      const store = await this.storeRepository.findOneByOrFail({
        username: loginStoreDto.username,
      });
      const isPasswordValid = await bcrypt.compare(
        loginStoreDto.password,
        store.password,
      );
      const isTwoFARequired = store.qrcodeActive;
      const isTwoFAValid = isTwoFARequired
        ? speakeasy.totp.verify({
            secret: process.env.QRCODE_SECRET!,
            token: loginStoreDto.twofa,
            algorithm: 'sha1',
          })
        : true;
      if (!isPasswordValid) {
        return new ServiceData<IToken>(
          HttpStatus.BAD_REQUEST,
          'Credenciais inválidas!',
        );
      }
      if (isTwoFARequired && !loginStoreDto.twofa) {
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
          id: store.id,
          username: store.username,
        }),
      });
    } catch (error) {
      return new ServiceData<IToken>(
        HttpStatus.BAD_REQUEST,
        'Credenciais inválidas!',
      );
    }
  }

  async authenticate(req: Request): Promise<ServiceData<boolean>> {
    const token = extractTokenFromHeader('storeToken', req.headers.cookie);
    return await this.jwtService
      .verifyAsync(token)
      .then(() => {
        return new ServiceData(HttpStatus.OK, 'Autenticado!', true);
      })
      .catch(() => {
        return new ServiceData(
          HttpStatus.UNAUTHORIZED,
          'Não foi possível autenticar!',
          false,
        );
      });
  }

  async personalData(req: Request): Promise<ServiceData<PersonalDataStoreDto>> {
    const token = extractTokenFromHeader('storeToken', req.headers.cookie);
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
    const store = await this.storeRepository.findOneByOrFail({
      username: payload.username,
    });
    return await this.jwtService
      .verifyAsync(token)
      .then(() => {
        return new ServiceData<PersonalDataStoreDto>(
          HttpStatus.OK,
          'Dados pessoais trazidos!',
          StoreConverter.StoretoPersonalDataStoreDto(store),
        );
      })
      .catch((error) => {
        console.log(error);
        return new ServiceData(
          HttpStatus.UNAUTHORIZED,
          'Não foi possível trazer dados pessoais!',
        );
      });
  }

  async statusQRCode(req: Request): Promise<ServiceData<IQRCode>> {
    try {
      const token = extractTokenFromHeader('storeToken', req.headers.cookie);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const store = await this.storeRepository.findOneByOrFail({
        username: payload.username,
      });
      return new ServiceData(HttpStatus.OK, `QRCode ativado!`, {
        status: store.qrcodeActive,
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
      const token = extractTokenFromHeader('storeToken', req.headers.cookie);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const store = await this.storeRepository.findOneByOrFail({
        username: payload.username,
      });
      store.qrcodeActive = true;
      await this.storeRepository.save(store);
      return new ServiceData(HttpStatus.OK, `QRCode ativado!`);
    } catch (error) {
      return new ServiceData(
        HttpStatus.BAD_REQUEST,
        `Não foi possível ativar o QRCode!`,
      );
    }
  }

  async disableQRCode(
    loginStoreDto: LoginStoreDto,
    req: Request,
  ): Promise<ServiceData> {
    try {
      if (
        speakeasy.totp.verify({
          secret: process.env.QRCODE_SECRET!,
          token: loginStoreDto.twofa,
          algorithm: 'sha1',
        })
      ) {
        const token = extractTokenFromHeader('storeToken', req.headers.cookie);
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
        const store = await this.storeRepository.findOneByOrFail({
          username: payload.username,
        });
        store.qrcodeActive = false;
        await this.storeRepository.save(store);
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
      const token = extractTokenFromHeader('storeToken', req.headers.cookie);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const store = await this.storeRepository.findOneByOrFail({
        username: payload.username,
      });
      if (store.qrcodeActive) {
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
