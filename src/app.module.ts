import { Module } from '@nestjs/common';

import { AuthModule } from './api/auth/auth.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';


@Module({
  imports: [
    PrismaModule,
    ApiModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
