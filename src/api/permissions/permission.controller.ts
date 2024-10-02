import { Controller, Post, UseGuards, Body, Req } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilePermissionDto } from './dto/file-permission.dto';
import { FolderPermissionDto } from './dto/folder-permission.dto';

@ApiTags('Permissions')
@Controller('permissions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  constructor(private permissionService: PermissionService) {}

  @Post('file/permit')
  @ApiOperation({ summary: 'Set permission to file by user email' })
  @ApiBody({ type: FilePermissionDto })
  async setFilePermission(@Body() dto: FilePermissionDto, @Req() req) {
    const ownerId = req.user.userId;
    return this.permissionService.setFilePermission({ ownerId, ...dto });
  }

  @Post('folder/permit')
  @ApiOperation({ summary: 'Set permission to folder by user email' })
  @ApiBody({ type: FolderPermissionDto })
  async setFolderPermission(@Body() dto: FolderPermissionDto, @Req() req) {
    const ownerId = req.user.userId;
    return this.permissionService.setFolderPermission({ ownerId, ...dto });
  }
}
