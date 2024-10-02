import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { UploadModule } from '../../common/upload/upload.module';
import { FilesRepository } from './files.repository';
import { PrismaModule } from '@/infrastructure/prisma/prisma.module';
import { UploadService } from '@/common/upload/upload.service';
import { FolderService } from '../folders/folder.service';
import { PermissionService } from '../permissions/permission.service';
import { FolderRepository } from '../folders/folder.repository';
import { PermissionRepository } from '../permissions/premission.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UploadModule, PrismaModule, UsersModule],
  controllers: [FilesController],
  providers: [
    FilesService,
    FilesRepository,
    UploadService,
    FolderRepository,
    FolderService,
    PermissionService,
    PermissionRepository,
  ],
})
export class FilesModule {}
