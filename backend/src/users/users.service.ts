import { Injectable, HttpException, HttpStatus, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Job } from '../jobs/entities/job.entity';
import { Feedback } from '../jobs/entities/feedback.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Job) 
    private jobsRepository: Repository<Job>,
    @InjectRepository(Feedback) 
    private feedbackRepository: Repository<Feedback>,
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

  async findOneById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }
    const { password, ...result } = user;
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    Object.keys(updateUserDto).forEach(key => {
      if (updateUserDto[key] === '') {
        updateUserDto[key] = null;
      }
    });

    this.usersRepository.merge(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);

    const { password, ...result } = updatedUser;
    return result;
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }
    await this.usersRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

  async markOnline(id: number, status: boolean) {
    await this.usersRepository.update(id, { isOnline: status });
  }

  async findApplications(userId: number) {
    const jobs = await this.jobsRepository.find({
      where: {
        candidates: { id: userId }
      },
      relations: ['company']
    });

    const result = await Promise.all(jobs.map(async (job) => {
      const feedback = await this.feedbackRepository.findOne({
        where: {
          job: { id: job.id },
          user: { id: userId }
        }
      });

      return {
        job_id: job.id,
        title: job.title,
        company: job.company.name,
        state: job.state,
        city: job.city,
        status: "Candidatura enviada",
        feedback: feedback ? feedback.message : null
      };
    }));

    return { items: result };
  }

}
