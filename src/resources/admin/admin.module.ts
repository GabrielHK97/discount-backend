import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    JwtModule.register({
      global: true,
      secret:process.env.JWT_SECRET,
      // signOptions: {
      //     expiresIn: '3600s'
      // },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
