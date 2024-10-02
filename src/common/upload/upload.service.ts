import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MyException } from '../exceptions/my.exception';

@Injectable()
export class UploadService {
  UPLOAD_FOLDER = 'uploads';
  UPLOAD_DIR = path.join('public', this.UPLOAD_FOLDER);

  constructor(private readonly configService: ConfigService) {
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists() {
    try {
      await fs.access(this.UPLOAD_DIR);
    } catch (err) {
      await fs.mkdir(this.UPLOAD_DIR, { recursive: true });
    }
  }

  generateFileName(file: Express.Multer.File): string {
    // const extension: string = path.parse(file.originalname).ext;
    // return `${uuid()}${extension}`;
    return file.originalname;
  }

  getFileName(file: Express.Multer.File): string {
    // const name: string = path.parse(file.originalname).name;
    return file.originalname;
  }
  // private generateFilePath(fileName: string): string {
  //   return path.resolve(this.UPLOAD_DIR, fileName);
  // }

  generateFilePublicPath(fileName: string, folderPath: string): string {
    const publicPath = `${this.configService.get('APP_URL')}/${this.UPLOAD_FOLDER}`;

    const publicFolderPath = folderPath
      ? path.join(publicPath, folderPath)
      : publicPath;
    return path.join(publicFolderPath, fileName);
  }
  generateFilePath(fileName: string, folderPath: string): string {
    // const folderPath = path.join(this.UPLOAD_DIR, folderName);
    return path.resolve(folderPath, fileName);
  }
  async createSubFolder({ parentFolderPath, folderName }): Promise<string> {
    try {
      const newFolderPath = path.join(parentFolderPath, folderName);
      await fs.mkdir(newFolderPath, { recursive: true });
      return newFolderPath;
    } catch (err) {
      throw new MyException(`Failed to create sub folder: ${err.message}`);
    }
  }

  async write(file: Express.Multer.File, folderPath: string) {
    const originalName = this.getFileName(file);
    const fileNameDir = this.generateFileName(file);
    const filepath = this.generateFilePath(fileNameDir, folderPath);
    const publicPath = this.generateFilePublicPath(fileNameDir, folderPath);
    try {
      await fs.access(folderPath)
      await fs.writeFile(filepath, file.buffer);
      return { originalName, filepath, publicPath };
    } catch (err) {
      throw new MyException(`Failed to write file: ${err.message}`);
    }
  }
  async getFilePath(fileName: string, folderName: string): Promise<string> {
    const filePath = folderName
      ? path.join(this.UPLOAD_DIR, folderName, fileName)
      : path.join(this.UPLOAD_DIR, fileName);

    try {
      await fs.access(filePath);
      return filePath;
    } catch (err) {
      throw new MyException(`File '${fileName}' not found:${err.message}`);
    }
  }
  async createReadStream(filePath: string) {
    try {
      await fs.access(filePath);
      return await fs.readFile(filePath);
    } catch (err) {
      console.log('Err:', err);
      throw new MyException(`Failed to read file: ${err.message}`);
    }
  }

  async createRootFolder(folderName: string): Promise<string> {
    const folderPath = path.join(this.UPLOAD_DIR, folderName);
    try {
      await fs.mkdir(folderPath, { recursive: true });
      return folderPath;
    } catch (err) {
      throw new MyException(`Failed to create folder: ${err.message}`);
    }
  }

  async renameFolderDir(
    oldFolderPath: string,
    newFolderName: string,
  ): Promise<string> {
    console.log(
      '🚀 ~ UploadService ~ renameFolderDir ~ oldFolderPath:',
      oldFolderPath,
    );
    try {
      const newFolderPath = path.join(
        path.dirname(oldFolderPath),
        newFolderName,
      );
      console.log(
        '🚀 ~ UploadService ~ renameFolderDir ~ newFolderPath:',
        newFolderPath,
      );
      await fs.rename(oldFolderPath, newFolderPath);
      console.log(`Folder renamed from ${oldFolderPath} to ${newFolderPath}`);
      return newFolderPath;
    } catch (error) {
      throw new MyException(`Error renaming folder: ${error.message}`);
    }
  }

  async updatePath(newFolderPath: string, name: string) {
    const newPath = path.join(newFolderPath, name);
    try {
      await fs.access(newPath);
      return newPath;
    } catch (error) {
      throw new MyException(
        `Error update path: ${newFolderPath} Error: ${error.message}`,
      );
    }
  }
}
