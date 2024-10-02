import {
  Controller,
  Post,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Body,
  ParseFilePipe,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UploadFileDto } from './dto/upload-file.dto';
import {
  MultipleFileTypeValidator,
  MultipleMaxFileSizeValidator,
} from '../../common/validators';

const TEN_MEGABYTES = 1e7;

@ApiTags('Files')
@Controller('files')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a file' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Req() req,
    @Body() dto: UploadFileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MultipleFileTypeValidator({
            fileType: /\/(jpg|jpeg|png|gif|pdf)$/i,
          }),
          new MultipleMaxFileSizeValidator({ maxSize: TEN_MEGABYTES }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const userId = req.user.userId;
    return this.filesService.saveFile(userId, file, dto.folderName);
  }

  @UseGuards(JwtAuthGuard)
  @Get('download/:fileName/:folderName')
  @ApiOperation({ summary: 'Download a file by folder name and file name' })
  async downloadFile(
    @Param('fileName') fileName: string,
    @Param('folderName') folderName: string,
    @Req() req,
    @Res() res,
  ) {
    const userId = req.user.userId;
    const fileStream = await this.filesService.createReadStream({
      userId,
      fileName,
      folderName,
    });
    res.set({
      'Content-Type': 'application/*',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': fileStream.length,
    });
    res.end(fileStream);
  }
}
