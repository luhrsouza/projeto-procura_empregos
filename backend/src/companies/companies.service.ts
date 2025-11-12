import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
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
}