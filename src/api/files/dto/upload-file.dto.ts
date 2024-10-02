import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    description: 'In which folder the file will be uploaded',
    required: true,
  })
  @IsString()
  folderName: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
