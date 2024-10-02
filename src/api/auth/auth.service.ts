import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDto } from './dto/auth-user.dto';
import { UsersRepository } from '../users/users.repository';
import { IPayload } from './interfaces/payload.interface';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async generateJwt(user: User) {
    const payload: IPayload = { userId: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(authUser: AuthUserDto) {
    const user = await this.userRepository.findUserByEmail(authUser.email);
    if (user) {
      return user;
    }
    console.log('🚀 Create user-> ');
    const newUser = await this.userRepository.createUser(authUser);
    return newUser;
  }
}
