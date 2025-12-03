import { IsString, IsNotEmpty, Length, IsOptional, IsNumber, IsIn } from 'class-validator';

const AREAS_VALIDAS = [
  'Administração', 'Agricultura', 'Artes', 'Atendimento ao Cliente',
  'Comercial', 'Comunicação', 'Construção Civil', 'Consultoria',
  'Contabilidade', 'Design', 'Educação', 'Engenharia', 'Finanças',
  'Jurídica', 'Logística', 'Marketing', 'Produção', 'Recursos Humanos',
  'Saúde', 'Segurança', 'Tecnologia da Informação', 'Telemarketing',
  'Vendas', 'Outros'
];

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 150, { message: 'Title must be between 3 and 150 characters' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 5000, { message: 'Description must be between 10 and 5000 characters' })
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(AREAS_VALIDAS, { message: 'Invalid area provided' })
  area: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber({}, { message: 'Salary must be a number' })
  @IsOptional()
  salary?: number;
}