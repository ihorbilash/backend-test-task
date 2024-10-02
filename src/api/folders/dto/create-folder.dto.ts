import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderDto {
  @ApiProperty({ example: 'Folder name' })
  name: string;
}
