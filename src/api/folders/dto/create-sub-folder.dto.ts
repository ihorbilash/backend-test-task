import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateSubFolderDto {
  @ApiProperty({ description: 'new folder name' })
  @IsString()
  folderName: string;
  @ApiProperty({ description: 'parent folder id' })
  @IsNumber()
  parentFolderId: number;
}
