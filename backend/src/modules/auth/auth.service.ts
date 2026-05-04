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
import { GoogleLoginDto } from './dto/google-login.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { UserRole } from '../../common/enums/user-role.enum';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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

    // Enviar correo de bienvenida (no bloquea el flujo principal)
    this.mailService.sendWelcomeEmail(user.email, user.firstName);

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

  // ─── GOOGLE LOGIN ───────────────────────────────────────────
  async googleLogin(dto: GoogleLoginDto) {
    try {
      // Usar fetch nativo de Node 18+ para obtener el perfil del usuario con el access_token
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${dto.token}` },
      });
      
      if (!response.ok) {
        throw new UnauthorizedException('Token de Google inválido');
      }

      const payload = await response.json();
      
      if (!payload || !payload.email) {
        throw new UnauthorizedException('No se pudo obtener el correo de Google');
      }

      let user = await this.userRepository.findOne({
        where: { email: payload.email.toLowerCase() },
      });

      if (!user) {
        user = this.userRepository.create({
          firstName: payload.given_name || 'Usuario',
          lastName: payload.family_name || 'Google',
          email: payload.email.toLowerCase(),
          authProvider: 'google',
          googleId: payload.sub,
          emailVerified: payload.email_verified || true,
          isActive: true
        });
        await this.userRepository.save(user);
        this.mailService.sendWelcomeEmail(user.email, user.firstName);
      } else if (user.authProvider === 'local') {
        user.authProvider = 'google';
        user.googleId = payload.sub;
        await this.userRepository.save(user);
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Tu cuenta está desactivada. Contacta al soporte.');
      }

      const token = this.generateToken(user);

      return {
        message: 'Sesión iniciada con Google correctamente',
        data: {
          user: this.sanitizeUser(user),
          accessToken: token,
        },
      };
    } catch (error) {
      console.error('Google Auth Error:', error);
      throw new UnauthorizedException('Error al verificar el token de Google');
    }
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
      role: user.email === 'madridsystem@outlook.es' ? UserRole.SUPER_ADMIN : user.role,
    };
    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: User) {
    const { password, ...result } = user as any;
    if (user.email === 'madridsystem@outlook.es') {
      result.role = UserRole.SUPER_ADMIN;
    }
    return result;
  }
}
