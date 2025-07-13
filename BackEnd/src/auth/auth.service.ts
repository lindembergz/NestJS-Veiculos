import * as crypto from 'crypto';

import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<boolean> {
    const { username, email, password } = registerDto;

    const existingUser = await this.userRepository.findOne({ where: [{ username }, { email }] });
    if (existingUser) {
      throw new BadRequestException('Username or email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({ username, email, passwordHash });
    await this.userRepository.save(user);

    // Lógica de envio de e-mail de confirmação (a ser implementada)

    return true;
  }

  async login(loginDto: LoginDto): Promise<TokenDto> {
    const { username, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = crypto.randomUUID();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const refreshTokenExpires = new Date();
    refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 2);

    user.refreshToken = hashedRefreshToken;
    user.refreshTokenExpiryTime = refreshTokenExpires;
    await this.userRepository.save(user);

    return { accessToken, refreshToken, twoFactorRequired: false };
  }

  async getAntiforgeryToken(): Promise<{ token: string }> {
    // NOTA: Esta é uma implementação de exemplo. Você deve usar uma biblioteca
    // para gerar e validar tokens antifalsificação em um ambiente de produção.
    const token = 'dummy-antiforgery-token';
    return { token };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }
}