import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { Feedback } from '../jobs/entities/feedback.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Job, Feedback])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
