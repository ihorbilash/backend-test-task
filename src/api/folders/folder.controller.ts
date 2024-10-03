import { FolderService } from './folder.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  Post,
  UseGuards,
  Controller,
  Body,
  Req,
  Param,
  Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { EditFolderNameDto } from './dto/edit-folder-name.dto';
// import { CreateFolderDto } from './dto/create-folder.dto';
// import { CreateSubFolderDto } from './dto/create-sub-folder.dto';

@ApiTags('Folders')
@Controller('folders')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class FoldersController {
  constructor(private folderService: FolderService) {}

  @ApiOperation({ summary: 'Create folder' })
  @Post('create-folders/:folderName/:parentFolderId')
  @ApiParam({
    name: 'parentFolderId',
    required: false,
    description:
      'If parentFolderId doesn`t exist, that means the folderName is the root folder.',
  })
  async createFolders(
    @Param('folderName') folderName: string,
    @Req() req,
    @Param('parentFolderId') parentFolderId?: number,
  ) {
    const userId = req.user.userId;
    return this.folderService.createFolders(
      userId,
      folderName,
      +parentFolderId,
    );
  }

  @ApiOperation({ summary: 'edit folder name by id' })
  @Post(':folderId/editFolderName')
  @ApiBody({ type: EditFolderNameDto })
  async editFolderName(@Body() dto: EditFolderNameDto, @Req() req) {
    const userId = req.user.userId;
    return this.folderService.editFolderName({
      userId,
      folderId: dto.folderId,
      newFolderName: dto.newFolderName,
    });
  }

  @ApiOperation({ summary: 'delete folder by id' })
  @Post(':folderId/delete')
  async deleteFolder(@Param('folderId') folderId: number, @Req() req) {
    const userId = req.user.userId;
    return this.folderService.deleteFolderAndContent(userId, +folderId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get folder tree' })
  @Get('folder-tree/:folderId')
  async getFolderTree(@Param('folderId') folderId: number) {
    return this.folderService.getFolderTree(+folderId);
  }

  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @Post('create/subfolder')
  // @ApiOperation({ summary: 'Create a folder inside an existing folder' })
  // @ApiBody({ type: CreateSubFolderDto })
  // async createSubFolder(@Body() dto: CreateSubFolderDto, @Req() req) {
  //   const userId = req.user.userId;
  //   return this.folderService.createSubFolder({ userId, ...dto });
  // }

  // @ApiOperation({ summary: 'create folder' })
  // @Post('create')
  // async createFolder(@Body() dto: CreateFolderDto, @Req() req) {
  //   const userId = req.user.userId;
  //   return this.folderService.createFolder(dto.name, userId);
  // }
}
