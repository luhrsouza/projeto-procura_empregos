import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { Company } from '../companies/entities/company.entity';
import { User } from '../users/entities/user.entity';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApplyJobDto } from './dto/apply-job.dto';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Feedback) 
    private feedbackRepository: Repository<Feedback>,
  ) {}

  async create(createJobDto: CreateJobDto, companyId: number): Promise<Job> {
    const company = await this.companiesRepository.findOne({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');

    const job = this.jobsRepository.create({
      ...createJobDto,
      company: company,
    });
    return this.jobsRepository.save(job);
  }

  async search(filters: any): Promise<Job[]> {
    const where: any = {};

    if (filters.title) where.title = Like(`%${filters.title}%`);
    if (filters.area) where.area = filters.area;
    if (filters.state) where.state = filters.state;
    if (filters.city) where.city = filters.city;
    
    if (filters.salary_range) {
        const { min, max } = filters.salary_range;
        if (min !== undefined && max !== undefined) {
            where.salary = Between(min, max);
        }
    }

    return this.jobsRepository.find({
        where,
        relations: ['company'],
        order: { id: 'DESC' }
    });
  }

  async findOne(id: number) {
    const job = await this.jobsRepository.findOne({ 
        where: { id },
        relations: ['company'] 
    });

    if (!job) {
        throw new NotFoundException({ message: 'Job not found' });
    }

    return {
        job_id: job.id,
        title: job.title,
        area: job.area,
        description: job.description,
        company: job.company.name, 
        city: job.city,
        state: job.state,
        salary: job.salary,
        contact: job.company.email
    };
  }

  async update(id: number, updateJobDto: UpdateJobDto, companyId: number): Promise<void> {
    const job = await this.jobsRepository.findOne({ 
        where: { id },
        relations: ['company'] 
    });

    if (!job) {
        throw new NotFoundException({ message: 'Job not found' });
    }

    if (job.company.id !== companyId) {
        throw new ForbiddenException({ message: 'Forbidden' });
    }

    this.jobsRepository.merge(job, updateJobDto);
    await this.jobsRepository.save(job);
  }

  async remove(id: number, companyId: number): Promise<void> {
    const job = await this.jobsRepository.findOne({ 
        where: { id },
        relations: ['company'] 
    });

    if (!job) {
        throw new NotFoundException({ message: 'Job not found' });
    }

    if (job.company.id !== companyId) {
        throw new ForbiddenException({ message: 'Forbidden' });
    }

    await this.jobsRepository.remove(job);
  }

  async apply(jobId: number, userId: number, applyData: ApplyJobDto): Promise<void> {
    const job = await this.jobsRepository.findOne({ 
        where: { id: jobId },
        relations: ['candidates'] 
    });
    if (!job) throw new NotFoundException({ message: 'Job not found' });

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException({ message: 'User not found' });

    user.name = applyData.name;
    user.education = applyData.education;
    user.experience = applyData.experience;
    if (applyData.email) user.email = applyData.email;
    if (applyData.phone) user.phone = applyData.phone;
    
    await this.usersRepository.save(user);

    const isAlreadyCandidate = job.candidates.some(c => c.id === userId);
    if (isAlreadyCandidate) {
        return; 
    }

    job.candidates.push(user);
    await this.jobsRepository.save(job);
  }

  async sendFeedback(jobId: number, companyId: number, data: CreateFeedbackDto) {
    const job = await this.jobsRepository.findOne({ 
        where: { id: jobId },
        relations: ['company', 'candidates'] 
    });

    if (!job) throw new NotFoundException({ message: 'Job not found' });

    if (job.company.id !== companyId) {
        throw new ForbiddenException({ message: 'Forbidden' });
    }

    const isCandidate = job.candidates.some(c => c.id === data.user_id);
    if (!isCandidate) {
        throw new NotFoundException({ message: 'Candidate not found in this job' });
    }

    const feedback = this.feedbackRepository.create({
        message: data.message,
        job: { id: jobId } as Job,
        user: { id: data.user_id } as User
    });

    await this.feedbackRepository.save(feedback);
  }
}
