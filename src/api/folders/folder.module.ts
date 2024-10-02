import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderRepository } from './folder.repository';
import { FoldersController } from './folder.controller';
import { PrismaModule } from '@/infrastructure/prisma/prisma.module';
import { UploadModule } from '@/common/upload/upload.module';
import { PermissionsModule } from '../permissions/permission.module';
import { PermissionService } from '../permissions/permission.service';
import { PermissionRepository } from '../permissions/premission.repository';
import { UsersModule } from '../users/users.module';
import { FilesModule } from '../files/files.module';
import { FilesRepository } from '../files/files.repository';

@Module({
  imports: [
    PrismaModule,
    UploadModule,
    PermissionsModule,
    UsersModule,
    FilesModule,
  ],
  providers: [
    FolderService,
    FolderRepository,
    PermissionService,
    PermissionRepository,
    FilesRepository,
  ],
  controllers: [FoldersController],
})
export class FoldersModule {}
