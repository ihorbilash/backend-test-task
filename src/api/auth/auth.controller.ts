import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication - Swagger Can`t Handle Google OAuth2 Redirects')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    return { msg: 'Google Auth' };
  }

  @ApiOperation({ summary: 'Google OAuth redirect callback to get JWT' })
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req) {
    return this.authService.generateJwt(req.user);
  }
}
