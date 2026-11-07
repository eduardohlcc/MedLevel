import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { ForgotPasswordDto, LoginDto, RefreshDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (!dto.termsAccepted) {
      throw new BadRequestException('É obrigatório aceitar os termos de uso e privacidade.');
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('E-mail já cadastrado na plataforma.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const targetDate = dto.targetExamDate ? new Date(dto.targetExamDate) : null;

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        passwordHash,
        targetExamDate: targetDate,
        weeklyHoursGoal: dto.weeklyHoursGoal || 15,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        targetExamDate: true,
        weeklyHoursGoal: true,
      },
    });

    if (targetDate) {
      await this.prisma.studyPlan.create({
        data: {
          userId: user.id,
          targetExamDate: targetDate,
          weeklyHoursGoal: dto.weeklyHoursGoal || 15,
        },
      });
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user,
      tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        targetExamDate: user.targetExamDate,
        weeklyHoursGoal: user.weeklyHoursGoal,
      },
      tokens,
    };
  }

  async refreshToken(dto: RefreshDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'medlevel_super_secret_refresh_jwt_key_change_in_production',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado.');
      }

      return this.generateTokens(user.id, user.email, user.role);
    } catch {
      throw new UnauthorizedException('Token de atualização expirado ou inválido.');
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    // Simulated e-mail recovery
    return {
      message: `Se o e-mail ${dto.email} estiver cadastrado, um link de recuperação foi enviado.`,
    };
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return { message: 'Conta e dados pessoais excluídos com sucesso (LGPD).' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const accessSecret =
      process.env.JWT_ACCESS_SECRET || 'medlevel_super_secret_access_jwt_key_change_in_production';
    const refreshSecret =
      process.env.JWT_REFRESH_SECRET || 'medlevel_super_secret_refresh_jwt_key_change_in_production';

    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
