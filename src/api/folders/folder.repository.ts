import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ICreateFolder } from './interfaces/create-folder.interface';

@Injectable()
export class FolderRepository {
  constructor(private prisma: PrismaService) {}

  async createFolder(dto: ICreateFolder) {
    return this.prisma.folder.create({
      data: {
        name: dto.folderName,
        ownerId: dto.userId,
        folderpath: dto.folderPath,
        parentFolderId: dto.parentFolderId,
      },
    });
  }
  async editFolderName({ folderId, newFolderName, newFolderPath }) {
    return this.prisma.folder.update({
      where: { id: folderId },
      data: {
        folderpath: newFolderPath,
        name: newFolderName,
      },
    });
  }

  async getFolderWithSubfolders(folderId: number) {
    return this.prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        files: true,
        children: {
          include: {
            files: true,
            children: true,
          },
        },
      },
    });
  }
  async updateFolderPath(folderId: number, newFolderPath: string) {
    return this.prisma.folder.update({
      where: { id: folderId },
      data: {
        folderpath: newFolderPath,
      },
    });
  }

  async findFolderByName(folderName: string) {
    return await this.prisma.folder.findFirst({
      where: {
        name: folderName,
      },
    });
  }

  async findFolderByNameAndParentFolderId(
    folderName: string,
    parentFolderId: number,
  ) {
    parentFolderId = parentFolderId || null;
    return await this.prisma.folder.findFirst({
      where: {
        name: folderName,
        parentFolderId,
      },
    });
  }
  async getFolderById(folderId: number) {
    return await this.prisma.folder.findFirst({
      where: { id: folderId },
    });
  }

  async deleteFolder(folderId: number) {
    return this.prisma.folder.delete({
      where: { id: folderId },
    });
  }
}
