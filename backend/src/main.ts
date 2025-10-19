import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, UnprocessableEntityException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

const validationExceptionFactory = (errors: ValidationError[]) => {
  const formattedErrors = errors.map((error) => {
    return {
      field: error.property,
      error: Object.values(error.constraints || {})[0] || 'invalid_format',
    };
  });

  return new UnprocessableEntityException({
    message: 'Validation error',
    code: 'UNPROCESSABLE',
    details: formattedErrors,
  });
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: validationExceptionFactory,
    }),
  );

  app.enableCors();

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
