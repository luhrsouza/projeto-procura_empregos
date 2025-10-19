import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenBlocklist } from './entities/token-blocklist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(TokenBlocklist)
    private tokenBlocklistRepository: Repository<TokenBlocklist>,
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

  async logout(token: string) {
    const isBlocked = await this.tokenBlocklistRepository.findOne({ where: { token } });
    if (isBlocked) {
      return; // Token já está na lista, não faz nada
    }

    const newBlockedToken = this.tokenBlocklistRepository.create({ token });
    await this.tokenBlocklistRepository.save(newBlockedToken);
  }
}
