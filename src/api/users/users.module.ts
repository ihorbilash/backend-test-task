import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { PrismaModule } from '@/infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
