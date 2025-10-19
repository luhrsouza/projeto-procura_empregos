import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    const user = await this.usersService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException({ message: 'Invalid credentials' });
    }

    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      token: token,
      expires_in: 3600,
    };
  }
}
