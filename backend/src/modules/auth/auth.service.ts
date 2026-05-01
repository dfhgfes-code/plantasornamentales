import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // ─── REGISTRO ───────────────────────────────────────────────
  async register(dto: RegisterDto) {
    // Verificar si el email ya existe
    const existing = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('Ya existe una cuenta con este correo electrónico');
    }

    // Crear usuario (el hash de contraseña se hace en el @BeforeInsert de la entidad)
    const user = this.userRepository.create({
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      email: dto.email.toLowerCase().trim(),
      password: dto.password,
      phone: dto.phone,
    });

    await this.userRepository.save(user);

    const token = this.generateToken(user);

    return {
      message: 'Cuenta creada exitosamente',
      data: {
        user: this.sanitizeUser(user),
        accessToken: token,
      },
    };
  }

  // ─── LOGIN ──────────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tu cuenta está desactivada. Contacta al soporte.');
    }

    const isPasswordValid = await user.validatePassword(dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const token = this.generateToken(user);

    return {
      message: 'Sesión iniciada correctamente',
      data: {
        user: this.sanitizeUser(user),
        accessToken: token,
      },
    };
  }

  // ─── PERFIL ─────────────────────────────────────────────────
  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    return {
      message: 'Perfil obtenido correctamente',
      data: this.sanitizeUser(user),
    };
  }

  // ─── CAMBIAR CONTRASEÑA ─────────────────────────────────────
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const isValid = await user.validatePassword(dto.currentPassword);
    if (!isValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('La nueva contraseña debe ser diferente a la actual');
    }

    user.password = dto.newPassword;
    await this.userRepository.save(user);

    return { message: 'Contraseña actualizada correctamente' };
  }

  // ─── HELPERS ────────────────────────────────────────────────
  private generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: User) {
    const { password, ...result } = user as any;
    return result;
  }
}
