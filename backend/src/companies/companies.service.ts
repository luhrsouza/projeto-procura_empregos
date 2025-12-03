import { Injectable, HttpException, HttpStatus, NotFoundException, ForbiddenException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Job } from '../jobs/entities/job.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Job)
    private readonly jobsRepository: Repository<Job>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const { username, name, email } = createCompanyDto;

    const existingName = await this.companyRepository.findOne({ where: { name } });
    if (existingName) {
      throw new HttpException(
        { message: 'Company name already exists' },
        HttpStatus.CONFLICT,
      );
    }

    const existingUsername = await this.companyRepository.findOne({ where: { username } });
    if (existingUsername) {
      throw new HttpException(
        { message: 'Username already exists' },
        HttpStatus.CONFLICT,
      );
    }

    const newCompany = this.companyRepository.create(createCompanyDto);
    return await this.companyRepository.save(newCompany);
  }

  async validateCompany(username: string, pass: string): Promise<any> {
    const company = await this.companyRepository.findOne({ where: { username } });
    if (company && company.password === pass) {
      const { password, ...result } = company;
      return result;
    }
    return null;
  }

  async findOneById(id: number) {
    const company = await this.companyRepository.findOne({ where: { id } });

    if (!company) {
      throw new NotFoundException({ message: 'Company not found' });
    }

    const { password, ...result } = company;
    return {
        name: company.name,
        business: company.business,
        username: company.username,
        street: company.street,
        number: company.number,
        city: company.city,
        state: company.state,
        phone: company.phone,
        email: company.email,
    };
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException({ message: 'Company not found' });
    }

    Object.keys(updateCompanyDto).forEach(key => {
      if (updateCompanyDto[key] === '') {
        updateCompanyDto[key] = null;
      }
    });

    this.companyRepository.merge(company, updateCompanyDto);
    await this.companyRepository.save(company);
  }

  async remove(id: number) {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException({ message: 'Company not found' });
    }

    await this.companyRepository.remove(company);

    return { message: 'Company deleted successfully' };
  }

  async markOnline(id: number, status: boolean) {
    await this.companyRepository.update(id, { isOnline: status });
  }

  async findJobCandidates(companyId: number, jobId: number) {
    const job = await this.jobsRepository.findOne({
      where: { id: jobId },
      relations: ['company', 'candidates'],
    });

    if (!job) {
      throw new NotFoundException({ message: 'Job not found' });
    }

    if (job.company.id !== companyId) {
      throw new ForbiddenException({ message: 'Forbidden' });
    }

    return {
      items: job.candidates.map(user => ({
        user_id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        education: user.education,
        experience: user.experience
      }))
    };
  }
}