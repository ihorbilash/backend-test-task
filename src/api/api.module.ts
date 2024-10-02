import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PermissionsModule } from './permissions/permission.module';
import { FoldersModule } from './folders/folder.module';

@Module({
  imports: [
    FilesModule,
    AuthModule,
    UsersModule,
    PermissionsModule,
    FoldersModule,
  ],
})
export class ApiModule {}
