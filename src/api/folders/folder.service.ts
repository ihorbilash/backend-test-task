import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { FolderRepository } from './folder.repository';
import { UploadService } from '@/common/upload/upload.service';
import { MyException } from '@/common/exceptions/my.exception';
import { PermissionService } from '@/api/permissions/permission.service';
import { FilesRepository } from '../files/files.repository';
import { Folder } from '@prisma/client';

@Injectable()
export class FolderService {
  constructor(
    private folderRepository: FolderRepository,
    private uploadService: UploadService,
    private permissionService: PermissionService,
    private fileRepository: FilesRepository,
  ) {}

  async createFolders(
    userId: number,
    folderName: string,
    parentFolderId?: number,
  ) {
    console.log('🚀 ~ FolderService ~ parentFolderId:', parentFolderId);
    if (parentFolderId) {
      return await this.createSubFolder({ userId, folderName, parentFolderId });
    } else {
      return await this.createFolder(folderName, userId);
    }
  }

  async createFolder(folderName: string, userId: number) {
    const folder = await this.folderRepository.findFolderByName(folderName);
    if (folder) {
      throw new MyException(`Folder '${folderName}' already exists.`);
    }
    const folderPath = await this.uploadService.createRootFolder(folderName);
    const newFolder = await this.folderRepository.createFolder({
      folderName,
      userId,
      folderPath,
    });
    await this.permissionService.createFolderPermission({
      folderId: newFolder.id,
      userId,
      canEdit: true,
    });

    return { newFolder };
  }

  async createSubFolder({ userId, folderName, parentFolderId }) {
    const parentFolder =
      await this.folderRepository.getFolderById(+parentFolderId);
    if (!parentFolder) {
      throw new NotFoundException(
        `Parent folder with ID ${parentFolderId} not found.`,
      );
    }
    await this.checkFolderIsExist(folderName, parentFolder);
    await this.permissionService.checkPermission({
      ownerId: userId,
      folderId: parentFolder.id,
    });
    const subfolderPath = await this.uploadService.createSubFolder({
      parentFolderPath: parentFolder.folderpath,
      folderName,
    });
    const subfolder = await this.folderRepository.createFolder({
      folderName,
      userId,
      parentFolderId,
      folderPath: subfolderPath,
    });
    await this.permissionService.createFolderPermission({
      folderId: subfolder.id,
      userId,
      canEdit: true,
    });
    return subfolder;
  }

  async editFolderName({ userId, folderId, newFolderName }) {
    const folder = await this.folderRepository.getFolderById(+folderId);
    if (!folder) {
      throw new NotFoundException(`Folder with ID ${folderId} not found.`);
    }
    await this.permissionService.checkPermission({ ownerId: userId, folderId });
    const newFolderPath = await this.uploadService.renameFolderDir(
      folder.folderpath,
      newFolderName,
    );
    const editedFolder = await this.folderRepository.editFolderName({
      folderId,
      newFolderName,
      newFolderPath,
    });
    await this.updateSubfolderPaths({
      parentFolderId: folderId,
      newFolderPath,
    });

    return editedFolder;
  }

  async checkFolderIsExist(folderName: string, parentFolder: Folder) {
    const existingFolder =
      await this.folderRepository.findFolderByNameAndParentFolderId(
        folderName,
        parentFolder.id,
      );
    if (existingFolder) {
      throw new ForbiddenException(
        `Folder '${folderName}' already exists in parentFolder where id '${parentFolder.name}'.`,
      );
    }
  }

  async updateSubfolderPaths({ parentFolderId, newFolderPath }) {
    const folder =
      await this.folderRepository.getFolderWithSubfolders(parentFolderId);
    const updateFilesPathsPromises = folder.files.map(async (file) => {
      const newFilePath = await this.uploadService.updatePath(
        newFolderPath,
        file.filename,
      );
      return this.fileRepository.updateFilePath(file.id, newFilePath);
    });
    await Promise.all(updateFilesPathsPromises);

    for (const subfolder of folder.children) {
      const newSubfolderPath = await this.uploadService.updatePath(
        newFolderPath,
        subfolder.name,
      );
      await this.folderRepository.updateFolderPath(
        subfolder.id,
        newSubfolderPath,
      );
      await this.updateSubfolderPaths({
        parentFolderId: subfolder.id,
        newFolderPath: newSubfolderPath,
      });
    }
  }

  async findFolderByName(folderName: string) {
    return this.folderRepository.findFolderByName(folderName);
  }

  async deleteFolder(userId: number, folderId: number) {
    await this.permissionService.checkPermission({ ownerId: userId, folderId });
    return await this.folderRepository.deleteFolder(folderId);
  }

  async deleteFolderAndContent(userId: number, folderId: number) {
    const folder =
      await this.folderRepository.getFolderWithSubfolders(folderId);
    if (!folder) {
      throw new NotFoundException(`Folder with ID ${folderId} not found.`);
    }
    await this.permissionService.checkPermission({ ownerId: userId, folderId });
    await this.uploadService.deleteFolderAndFileRecursive(folder.folderpath);
    await this.folderRepository.deleteFolder(folderId);
    return { message: 'Folder and all its contents have been deleted.' };
  }

  async getFolderTree(folderId: number) {
    const folderTree =
      await this.folderRepository.getFolderWithSubfolders(folderId);
    if (!folderTree) {
      throw new NotFoundException(`Folder with ID ${folderId} not found.`);
    }

    return folderTree;
  }
}
