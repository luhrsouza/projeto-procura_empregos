import { Controller, Post, Get, Body, Param, UseGuards, Request, HttpCode, HttpStatus, ForbiddenException, Delete, Patch } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApplyJobDto } from './dto/apply-job.dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createJobDto: CreateJobDto) {
    if (req.user.role !== 'company') {
      throw new ForbiddenException({ message: 'Forbidden' });
    }
    await this.jobsService.create(createJobDto, req.user.userId);
    return {
      message: 'Created'
    };
  }

  @Post('search')
  @HttpCode(HttpStatus.OK)
  search(@Body() filters: any) {
    return this.jobsService.search(filters);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':job_id')
  findOne(@Param('job_id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Request() req, @Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    if (req.user.role !== 'company') {
        throw new ForbiddenException({ message: 'Forbidden' });
    }

    await this.jobsService.update(+id, updateJobDto, req.user.userId);

    return {
        message: 'Job updated successfully'
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Request() req, @Param('id') id: string) {
    if (req.user.role !== 'company') {
        throw new ForbiddenException({ message: 'Forbidden' });
    }

    await this.jobsService.remove(+id, req.user.userId);
    return {
        message: 'Job deleted successfully'
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id') 
  @HttpCode(HttpStatus.OK)
  async apply(@Request() req, @Param('id') id: string, @Body() applyJobDto: ApplyJobDto) {
    if (req.user.role !== 'user') {
        throw new ForbiddenException({ message: 'Forbidden' });
    }

    await this.jobsService.apply(+id, req.user.userId, applyJobDto);

    return {
        message: 'Applied successfully'
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/feedback')
  @HttpCode(HttpStatus.OK)
  async sendFeedback(@Request() req, @Param('id') id: string, @Body() createFeedbackDto: CreateFeedbackDto) {
    if (req.user.role !== 'company') {
        throw new ForbiddenException({ message: 'Forbidden' });
    }

    await this.jobsService.sendFeedback(+id, req.user.userId, createFeedbackDto);

    return {
        message: 'Feedback sent successfully'
    };
  }
}
