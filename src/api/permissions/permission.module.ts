import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionRepository } from './premission.repository';
import { PrismaModule } from '@/infrastructure/prisma/prisma.module';
import { PermissionsController } from './permission.controller';
import { UsersRepository } from '../users/users.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [PermissionService, PermissionRepository, UsersRepository],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
