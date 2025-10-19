import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username } = createUserDto;

    const existingUser = await this.usersRepository.findOne({ where: { username } });

    if (existingUser) {
      throw new HttpException(
        { message: 'Username already exists' },
        HttpStatus.CONFLICT,
      );
    }
    const saltOrRounds = 10;
    
    
    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }

  async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersRepository.findOne({ where: { username } });
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

}
