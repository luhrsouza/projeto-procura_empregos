import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  Length,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCompanyDto {
  @IsString()
  @MinLength(4)
  @MaxLength(150)
  @Transform(({ value }) => (value ? value.toUpperCase() : value))
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(4)
  @MaxLength(150)
  @IsOptional()
  business?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9!@#$%^&*]+$/)
  @IsOptional()
  password?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(150)
  @IsOptional()
  street?: string;

  @IsNumberString()
  @MinLength(1)
  @MaxLength(8)
  @IsOptional()
  number?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(150)
  @IsOptional()
  city?: string;

  @IsString()
  @Length(2, 2)
  @IsOptional()
  state?: string;

  @IsNumberString()
  @Length(10, 14)
  @IsOptional()
  phone?: string;

  @IsEmail()
  @MinLength(10)
  @MaxLength(150)
  @IsOptional()
  email?: string;
}