import { ApiProperty } from '@nestjs/swagger';

export class EditFolderNameDto {
  @ApiProperty({ example: 1 })
  folderId: number;
  @ApiProperty({ example: 'My new folder' })
  newFolderName: string;
}
