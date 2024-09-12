import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './resources/admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './resources/admin/entities/admin.entity';
import { PersonModule } from './resources/person/person.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DS_HOST,
      port: +process.env.DS_PORT,
      username: process.env.DS_USERNAME,
      password: process.env.DS_PASSWORD,
      database: process.env.DS_DATABASE,
      schema: process.env.DS_SCHEMA,
      entities: [Admin],
      synchronize: true,
    }),
    AdminModule,
    PersonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
