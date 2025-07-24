import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { UserRole } from './users/user.entity';

async function seedAdmin(app: INestApplication) {
  const usersService = app.get(UsersService);
  const adminEmail = process.env.ADMIN_EMAIL!;
  const adminPass = process.env.ADMIN_PASSWORD!;
  const existing = await usersService.findByEmail(adminEmail);
  if (!existing) {
    await usersService.create(adminEmail, adminPass, UserRole.ADMIN);
    console.log('Admin user created');
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API NestJS')
    .setDescription('Documentación de la API con JWT y Usuarios')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'jwt')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
