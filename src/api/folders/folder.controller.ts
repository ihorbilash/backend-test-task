import { FolderService } from './folder.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  Post,
  UseGuards,
  Controller,
  Body,
  Req,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EditFolderNameDto } from './dto/edit-folder-name.dto';
import { CreateFolderDto } from './dto/create-folder.dto';
import { CreateSubFolderDto } from './dto/create-sub-folder.dto';

@ApiTags('Folders')
@Controller('folders')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class FoldersController {
  constructor(private folderService: FolderService) {}

  @ApiOperation({ summary: 'create folder' })
  @Post('create')
  async createFolder(@Body() dto: CreateFolderDto, @Req() req) {
    const userId = req.user.userId;
    return this.folderService.createFolder(dto.name, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('create/subfolder')
  @ApiOperation({ summary: 'Create a folder inside an existing folder' })
  @ApiBody({ type: CreateSubFolderDto })
  async createSubFolder(@Body() dto: CreateSubFolderDto, @Req() req) {
    const userId = req.user.userId;
    return this.folderService.createSubFolder({ userId, ...dto });
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
    return this.folderService.deleteFolder(userId, folderId);
  }
}
