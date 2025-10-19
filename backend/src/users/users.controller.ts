import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request, Delete, Param, Patch, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Define o status HTTP para 201 Created
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    return {
      message: 'Created',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':user_id')
  getProfile(@Request() req, @Param('user_id') userId: string) {
    if (req.user.userId !== +userId) {
      throw new ForbiddenException({ message: 'Forbidden' });
    }
    return this.usersService.findOneById(+userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':user_id')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Request() req,
    @Param('user_id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (req.user.userId !== +userId) {
      throw new ForbiddenException({ message: 'Forbidden' });
    }
    
    await this.usersService.update(+userId, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':user_id')
  @HttpCode(HttpStatus.OK)
  removeProfile(@Request() req, @Param('user_id') userId: string) {
    if (req.user.userId !== +userId) {
      throw new ForbiddenException({ message: 'Forbidden' });
    }
    return this.usersService.remove(+userId);
  }
}
