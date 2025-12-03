import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Company } from '../../companies/entities/company.entity';

@Injectable()
export class ActivityInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Company) private companiesRepo: Repository<Company>,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user) {
      const now = new Date();
      if (user.role === 'user') {
        this.usersRepo.update(user.userId, { lastActive: now });
      } else if (user.role === 'company') {
        this.companiesRepo.update(user.userId, { lastActive: now });
      }
    }

    return next.handle();
  }
}