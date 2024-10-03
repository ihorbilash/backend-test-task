import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilesRepository } from './files.repository';
import { UploadService } from '@/common/upload/upload.service';
import { FolderService } from '../folders/folder.service';
import { PermissionService } from '../permissions/permission.service';
import { Folder } from '@prisma/client';
import { ISaveFile } from './interfaces/save-file.interface';
import { FolderRepository } from '../folders/folder.repository';

@Injectable()
export class FilesService {
  constructor(
    private fileRepository: FilesRepository,
    private uploadService: UploadService,
    private folderService: FolderService,
    private folderRepository: FolderRepository,
    private permissionService: PermissionService,
  ) {}

  async saveFile(
    userId: number,
    file: Express.Multer.File,
    folderId: number,
  ): Promise<ISaveFile> {
    const folder: Folder = await this.folderRepository.getFolderById(+folderId);
    if (!folder) {
      throw new NotFoundException(`Folder with ID'${folderId}' not found.`);
    }
    await this.permissionService.checkPermission({
      folderId: folder.id,
      ownerId: userId,
    });
    const filename: string = file.originalname;
    const existingFile = await this.fileRepository.findFileByNameAndFolderId(
      filename,
      +folderId,
    );

    if (existingFile) {
      throw new ForbiddenException(
        `File '${filename}' already exists in folder '${folder.name}'.`,
      );
    }
    const { originalName, filepath, publicPath } =
      await this.uploadService.write(file, folder.folderpath);

    const fileSaved = await this.fileRepository.saveFile({
      filename: originalName,
      filepath,
      folderId: folder.id,
      ownerId: userId,
    });
    await this.permissionService.createFilePermission({
      fileId: fileSaved.id,
      userId,
      canEdit: true,
    });

    return {
      fileId: fileSaved.id,
      filename: fileSaved.filename,
      filepath: fileSaved.filepath,
      publicPath: publicPath,
      ownerId: fileSaved.ownerId,
    };
  }

  async createReadStream({ userId, fileName, folderId }) {
    const file = await this.fileRepository.findFileByNameAndFolderId(
      fileName,
      +folderId,
    );
    if (!file) {
      throw new NotFoundException(
        `File '${fileName}' not found. In folder ID '${folderId}'`,
      );
    }

    await this.permissionService.checkPermission({
      fileId: file.id,
      ownerId: userId,
    });

    return await this.uploadService.createReadStream(file.filepath);
  }

  async deleteFile(fileId: number) {
    const file = await this.fileRepository.findFileById(+fileId);
    if (!file) {
      throw new NotFoundException(`File with ID ${fileId} not found.`);
    }
    await this.uploadService.deleteFilePath(file.filepath);
    await this.fileRepository.deleteFile(+fileId);
    return { message: `File ${file.filename} has been deleted.` };
  }
}
