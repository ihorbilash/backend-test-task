import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class FolderPermissionDto {
  @ApiProperty({
    example: 'lqKf8@example.com',
    description: 'User email which we set permission',
  })
  @IsString()
  userEmail: string;

  @IsNumber()
  @ApiProperty({ example: 1, description: 'Folder id' })
  folderId: number;

  @ApiProperty({ example: true, description: 'Can edit folder' })
  canEdit: boolean;
}
