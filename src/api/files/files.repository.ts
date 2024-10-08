import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { SaveFileRepositoryDto } from './dto/save-file-repository.dto';

@Injectable()
export class FilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveFile(dto: SaveFileRepositoryDto) {
    return this.prisma.file.create({
      data: {
        filename: dto.filename,
        filepath: dto.filepath,
        folderId: dto.folderId,
        ownerId: dto.ownerId,
      },
    });
  }

  async findFileByIdAndFolderId(fileId: number, folderId: number) {
    return this.prisma.file.findFirst({
      where: { id: fileId, folder: { id: folderId } },
    });
  }

  async findFileByNameAndFolderId(fileName: string, folderId: number) {
    return this.prisma.file.findFirst({
      where: { filename: fileName, folder: { id: folderId } },
    });
  }

  async updateFilePath(fileId: number, newFilePath: string) {
    return await this.prisma.file.update({
      where: { id: fileId },
      data: { filepath: newFilePath },
    });
  }

  async findFileById(fileId: number) {
    return this.prisma.file.findUnique({
      where: { id: fileId },
    });
  }

  async deleteFile(fileId: number) {
    return this.prisma.file.delete({
      where: { id: fileId },
    });
  }
}
