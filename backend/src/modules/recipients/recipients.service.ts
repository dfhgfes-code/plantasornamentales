import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipient } from './entities/recipient.entity';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { UpdateRecipientDto } from './dto/update-recipient.dto';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class RecipientsService {
  constructor(
    @InjectRepository(Recipient)
    private readonly recipientRepository: Repository<Recipient>,
  ) {}

  async create(userId: string, dto: CreateRecipientDto) {
    // Si se marca como default, quitar el default anterior
    if (dto.isDefault) {
      await this.recipientRepository.update(
        { userId, isDefault: true },
        { isDefault: false },
      );
    }

    const recipient = this.recipientRepository.create({ ...dto, userId });
    await this.recipientRepository.save(recipient);
    return { message: 'Destinatario creado exitosamente', data: recipient };
  }

  async findAllByUser(userId: string) {
    const recipients = await this.recipientRepository.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
    return { message: 'Destinatarios obtenidos correctamente', data: recipients };
  }

  async findOne(id: string, requestingUser: User) {
    const recipient = await this.recipientRepository.findOne({ where: { id } });
    if (!recipient) throw new NotFoundException('Destinatario no encontrado');
    this.checkOwnership(recipient, requestingUser);
    return { message: 'Destinatario encontrado', data: recipient };
  }

  async update(id: string, dto: UpdateRecipientDto, requestingUser: User) {
    const recipient = await this.recipientRepository.findOne({ where: { id } });
    if (!recipient) throw new NotFoundException('Destinatario no encontrado');
    this.checkOwnership(recipient, requestingUser);

    if (dto.isDefault) {
      await this.recipientRepository.update(
        { userId: recipient.userId, isDefault: true },
        { isDefault: false },
      );
    }

    Object.assign(recipient, dto);
    await this.recipientRepository.save(recipient);
    return { message: 'Destinatario actualizado correctamente', data: recipient };
  }

  async remove(id: string, requestingUser: User) {
    const recipient = await this.recipientRepository.findOne({ where: { id } });
    if (!recipient) throw new NotFoundException('Destinatario no encontrado');
    this.checkOwnership(recipient, requestingUser);
    await this.recipientRepository.softDelete(id);
    return { message: 'Destinatario eliminado correctamente' };
  }

  async setDefault(id: string, userId: string) {
    const recipient = await this.recipientRepository.findOne({ where: { id, userId } });
    if (!recipient) throw new NotFoundException('Destinatario no encontrado');

    await this.recipientRepository.update({ userId, isDefault: true }, { isDefault: false });
    recipient.isDefault = true;
    await this.recipientRepository.save(recipient);
    return { message: 'Destinatario marcado como predeterminado', data: recipient };
  }

  private checkOwnership(recipient: Recipient, user: User) {
    if (recipient.userId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('No tienes acceso a este destinatario');
    }
  }
}
