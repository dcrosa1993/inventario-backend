import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBody, ApiConsumes, ApiOperation, ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@tuapp.com' })
  email: string;

  @ApiProperty({ example: 'TuPassSegura123' })
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Iniciar sesión y obtener JWT' })
  @ApiConsumes('application/json')
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req) {
    // Implementar lógica si usas lista de tokens o simplemente informar
    return { message: 'Sesión cerrada' };
  }
}