import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({
    type: 'number',
    description: 'In which folder the file will be uploaded',
    required: true,
  })
  @IsNumber()
  folderId: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
