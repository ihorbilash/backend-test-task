import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './api/auth/guards/jwt-auth.guard';

@ApiTags('hello world')
@ApiBearerAuth('JWT-auth')
@Controller()
export class AppController {
  constructor() {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getHello(): Promise<string> {
    return 'Hello World!';
  }
}
