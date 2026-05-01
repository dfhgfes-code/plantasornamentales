import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async create(dto: CreatePlanDto) {
    const plan = this.planRepository.create({ ...dto, deliveryCount: dto.deliveryCount ?? 1 });
    await this.planRepository.save(plan);
    return { message: 'Plan creado exitosamente', data: plan };
  }

  async findAll(onlyActive = false) {
    const where = onlyActive ? { isActive: true } : {};
    const plans = await this.planRepository.find({
      where,
      order: { price: 'ASC' },
    });
    return { message: 'Planes obtenidos correctamente', data: plans };
  }

  async findOne(id: string) {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('Plan no encontrado');
    return { message: 'Plan encontrado', data: plan };
  }

  async update(id: string, dto: UpdatePlanDto) {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('Plan no encontrado');
    Object.assign(plan, dto);
    await this.planRepository.save(plan);
    return { message: 'Plan actualizado correctamente', data: plan };
  }

  async remove(id: string) {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('Plan no encontrado');
    await this.planRepository.softDelete(id);
    return { message: 'Plan eliminado correctamente' };
  }

  async toggleActive(id: string) {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('Plan no encontrado');
    plan.isActive = !plan.isActive;
    await this.planRepository.save(plan);
    return { message: `Plan ${plan.isActive ? 'activado' : 'desactivado'}`, data: plan };
  }
}
