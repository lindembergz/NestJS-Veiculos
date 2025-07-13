import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('antiforgery/token')
  async getAntiforgeryToken(): Promise<{ token: string }> {
    return this.authService.getAntiforgeryToken();
  }

  @Post('auth/register')
  async register(@Body() registerDto: RegisterDto): Promise<string> {
    const result = await this.authService.register(registerDto);
    if (!result) {
      return 'Registration failed.';
    }
    return 'Registration successful. Please confirm your email.';
  }

  @Post('auth/login')
  async login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    return this.authService.login(loginDto);
  }

  // TODO: Implementar confirm-email, refresh e verify-2fa
}