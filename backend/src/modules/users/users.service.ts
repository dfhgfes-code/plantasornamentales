import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ─── ADMIN: listar todos los usuarios ───────────────────────
  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const [data, total] = await this.userRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      message: 'Usuarios obtenidos correctamente',
      data: paginate(data.map(this.sanitize), total, page, limit),
    };
  }

  // ─── ADMIN: obtener usuario por ID ──────────────────────────
  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return { message: 'Usuario encontrado', data: this.sanitize(user) };
  }

  // ─── Actualizar perfil propio ────────────────────────────────
  async update(id: string, dto: UpdateUserDto, requestingUser: User) {
    // Solo el propio usuario o un admin puede actualizar
    if (requestingUser.id !== id && requestingUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('No puedes modificar este perfil');
    }

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    Object.assign(user, dto);
    await this.userRepository.save(user);

    return { message: 'Perfil actualizado correctamente', data: this.sanitize(user) };
  }

  // ─── ADMIN: activar/desactivar usuario ──────────────────────
  async toggleActive(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.isActive = !user.isActive;
    await this.userRepository.save(user);

    return {
      message: `Usuario ${user.isActive ? 'activado' : 'desactivado'} correctamente`,
      data: this.sanitize(user),
    };
  }

  // ─── ADMIN: cambiar rol ──────────────────────────────────────
  async changeRole(id: string, role: UserRole) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.role = role;
    await this.userRepository.save(user);

    return { message: 'Rol actualizado correctamente', data: this.sanitize(user) };
  }

  // ─── Helper ─────────────────────────────────────────────────
  private sanitize(user: User) {
    const { password, ...result } = user as any;
    return result;
  }
}
