import { Injectable } from '@nestjs/common';
import { PermissionRepository } from './premission.repository';
import { MyException } from '@/common/exceptions/my.exception';
import { UsersRepository } from '../users/users.repository';
import { User } from '@prisma/client';
import { IPermission } from './interfaces/permission.interface';

@Injectable()
export class PermissionService {
  constructor(
    private permissionRepository: PermissionRepository,
    private userRepository: UsersRepository,
  ) {}

  async createFilePermission({ fileId, userId, canEdit }) {
    return this.permissionRepository.setFilePermission({
      fileId,
      userId,
      canEdit,
    });
  }
  async createFolderPermission({ folderId, userId, canEdit }) {
    return this.permissionRepository.createFolderPermission({
      folderId,
      userId,
      canEdit,
    });
  }

  async setFilePermission({ fileId, ownerId, userEmail, canEdit }) {
    await this.checkPermission({ ownerId, fileId });
    const sharedUser: User =
      await this.userRepository.findUserByEmail(userEmail);
    if (!sharedUser) {
      throw new MyException('User not found');
    }
    return this.permissionRepository.setFilePermission({
      fileId,
      userId: sharedUser.id,
      canEdit,
    });
  }

  async setFolderPermission({ folderId, ownerId, userEmail, canEdit }) {
    await this.checkPermission({ ownerId, folderId });
    const sharedUser: User =
      await this.userRepository.findUserByEmail(userEmail);
    if (!sharedUser) {
      throw new MyException('User not found');
    }
    return this.permissionRepository.createFolderPermission({
      folderId,
      userId: sharedUser.id,
      canEdit,
    });
  }

  async checkPermission(data: IPermission) {
    if (data.ownerId && data.folderId) {
      const permission = await this.permissionRepository.getFolderPermissions(
        data.ownerId,
        data.folderId,
      );
      if (!permission || !permission.canEdit) {
        throw new MyException(`You do not have access to this folder .`);
      }
    }

    if (data.ownerId && data.fileId) {
      const permission = await this.permissionRepository.getFilePermissions(
        data.ownerId,
        data.fileId,
      );
      if (!permission || !permission.canEdit) {
        throw new MyException(`You do not have access to this file.`);
      }
    }
  }
}
