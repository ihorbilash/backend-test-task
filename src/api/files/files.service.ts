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

@Injectable()
export class FilesService {
  constructor(
    private fileRepository: FilesRepository,
    private uploadService: UploadService,
    private folderService: FolderService,
    private permissionService: PermissionService,
  ) {}

  async saveFile(
    userId: number,
    file: Express.Multer.File,
    folderName: string,
  ): Promise<ISaveFile> {
    const folder: Folder =
      await this.folderService.findFolderByName(folderName);
    if (!folder) {
      throw new NotFoundException(`Folder '${folderName}' not found.`);
    }
    await this.permissionService.checkPermission({
      folderId: folder.id,
      ownerId: userId,
    });
    const filename: string = file.originalname;
    const existingFile = await this.fileRepository.findFileByNameAndFolder(
      filename,
      folderName,
    );

    if (existingFile) {
      throw new ForbiddenException(
        `File '${filename}' already exists in folder '${folderName}'.`,
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

  async createReadStream({ userId, fileName, folderName }) {
    const file = await this.fileRepository.findFileByNameAndFolder(
      fileName,
      folderName,
    );
    if (!file) {
      throw new NotFoundException(
        `File '${fileName}' not found. In folder '${folderName}'`,
      );
    }

    await this.permissionService.checkPermission({
      fileId: file.id,
      ownerId: userId,
    });

    return await this.uploadService.createReadStream(file.filepath);
  }
}
