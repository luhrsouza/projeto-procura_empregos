import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
  Patch,
  Delete,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    const newCompany = await this.companiesService.create(createCompanyDto);

    return {
      message: 'Created',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':company_id')
  async findOne(
    @Request() req,
    @Param('company_id') companyId: string,
  ) {
    if (
      req.user.role !== 'company' ||
      req.user.userId !== +companyId
    ) {
      throw new ForbiddenException({ message: 'Forbidden' });
    }

    return this.companiesService.findOneById(+companyId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':company_id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Request() req,
    @Param('company_id') companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    if (
      req.user.role !== 'company' ||
      req.user.userId !== +companyId
    ) {
      throw new ForbiddenException({ message: 'Forbidden' });
    }

    await this.companiesService.update(+companyId, updateCompanyDto);

    return { message: 'Updated' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':company_id')
  @HttpCode(HttpStatus.OK)
    async remove(
      @Request() req,
      @Param('company_id') companyId: string,
  ) {
      if (
        req.user.role !== 'company' ||
        req.user.userId !== +companyId
      ) {
        throw new ForbiddenException({ message: 'Forbidden' });
      }
      return this.companiesService.remove(+companyId);
 }

 @UseGuards(AuthGuard('jwt'))
  @Get(':company_id/jobs/:job_id')
  async findCandidates(
    @Request() req,
    @Param('company_id') companyId: string,
    @Param('job_id') jobId: string
  ) {
    if (req.user.role !== 'company' || req.user.userId !== +companyId) {
      throw new ForbiddenException({ message: 'Forbidden' });
    }

    return this.companiesService.findJobCandidates(+companyId, +jobId);
  }
}
