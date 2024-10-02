import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class PermissionRepository {
  constructor(private prisma: PrismaService) {}

  async setFilePermission({ fileId, userId, canEdit }) {
    return this.prisma.permission.upsert({
      where: {
        fileId_userId: {
          fileId: fileId,
          userId: userId,
        },
      },
      update: {
        canEdit: canEdit,
      },
      create: {
        fileId: fileId,
        userId: userId,
        canEdit: canEdit,
      },
    });
  }

  async createFolderPermission({ folderId, userId, canEdit }) {
    return this.prisma.permission.upsert({
      where: {
        folderId_userId: {
          folderId: folderId,
          userId: userId,
        },
      },
      update: {
        canEdit: canEdit,
      },
      create: {
        folderId: folderId,
        userId: userId,
        canEdit: canEdit,
      },
    });
  }

  async getFilePermissions(userId: number, fileId: number) {
    return this.prisma.permission.findFirst({
      where: { fileId, userId },
    });
  }

  async getFolderPermissions(userId: number, folderId: number) {
    return this.prisma.permission.findFirst({
      where: { folderId, userId },
    });
  }
}
