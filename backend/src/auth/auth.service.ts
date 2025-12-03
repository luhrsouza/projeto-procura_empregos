import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenBlocklist } from './entities/token-blocklist.entity';
import { Repository } from 'typeorm';
import { CompaniesService } from 'src/companies/companies.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(TokenBlocklist)
    private tokenBlocklistRepository: Repository<TokenBlocklist>,
    private companiesService: CompaniesService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;

    const user = await this.usersService.validateUser(username, password);
    
    let payload: any;

    if (user) {
      await this.usersService.markOnline(user.id, true);
      payload = { username: user.username, sub: user.id, role: 'user' };
    } else {
      const company = await this.companiesService.validateCompany(username, password);

      if (company) {
        await this.companiesService.markOnline(company.id, true);
        payload = { username: company.username, sub: company.id, role: 'company' };
      }
    }

    if (!payload) {
      throw new UnauthorizedException({ message: 'Invalid credentials' });
    }

    const token = this.jwtService.sign(payload);

    return {
      token: token,
      expires_in: 3600,
    };
  }

  async logout(token: string, userId: number, role: string) {
    const isBlocked = await this.tokenBlocklistRepository.findOne({ where: { token } });
    if (isBlocked) return;

    const newBlockedToken = this.tokenBlocklistRepository.create({ token });
    await this.tokenBlocklistRepository.save(newBlockedToken);

    if (role === 'user') {
        await this.usersService.markOnline(userId, false);
    } else if (role === 'company') {
        await this.companiesService.markOnline(userId, false);
    }
  }
}
