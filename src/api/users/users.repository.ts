import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AuthUserDto } from '../auth/dto/auth-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(authUser: AuthUserDto) {
    return await this.prisma.user.create({
      data: {
        email: authUser.email,
        name: authUser.name,
      },
    });
  }
}
