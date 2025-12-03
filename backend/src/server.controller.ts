import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Company } from './companies/entities/company.entity';
import { ActivityInterceptor } from './common/interceptors/activity.interceptor'; // Ajuste o import

@Controller()
export class AppController {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Company) private companiesRepo: Repository<Company>,
  ) {}

  @Get('server-status')
  async serverStatus() {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const activeUsers = await this.usersRepo.find({
      where: { lastActive: MoreThan(tenMinutesAgo) }
    });

    const activeCompanies = await this.companiesRepo.find({
      where: { lastActive: MoreThan(tenMinutesAgo) }
    });

    let html = `
      <html>
        <head>
            <style>
                body { font-family: sans-serif; padding: 20px; }
                table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                h1 { color: #333; }
                .badge { padding: 5px 10px; border-radius: 5px; color: white; font-weight: bold; }
                .user { background-color: #007bff; }
                .company { background-color: #28a745; }
            </style>
            <meta http-equiv="refresh" content="5"> </head>
        <body>
          <h1>Painel do Servidor - Usuários Online (Últimos 10min)</h1>
          
          <h2>Usuários Comuns (${activeUsers.length})</h2>
          <table>
            <tr><th>ID</th><th>Nome</th><th>Última Atividade</th><th>Status</th></tr>
            ${activeUsers.map(u => `
              <tr>
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td>${u.lastActive ? u.lastActive.toLocaleString() : 'N/A'}</td>
                <td><span class="badge user">Online</span></td>
              </tr>`).join('')}
          </table>

          <h2>Empresas (${activeCompanies.length})</h2>
          <table>
            <tr><th>ID</th><th>Nome</th><th>Última Atividade</th><th>Status</th></tr>
            ${activeCompanies.map(c => `
              <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.lastActive ? c.lastActive.toLocaleString() : 'N/A'}</td>
                <td><span class="badge company">Online</span></td>
              </tr>`).join('')}
          </table>
        </body>
      </html>
    `;

    return html;
  }
}