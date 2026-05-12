import { DataSource } from 'typeorm';
import { Plan } from '../../modules/plans/entities/plan.entity';
export async function seedPlans(dataSource: DataSource) {
  const repo = dataSource.getRepository(Plan);

  const count = await repo.count();
  if (count > 0) {
    console.log('✅ Planes ya existen, omitiendo seed');
    return;
  }

  const plans = [
    {
      name: 'Plan Semanal Básico',
      description: 'Recibe un ramo de flores frescas cada semana. Ideal para mantener tu hogar siempre florido.',
      price: 65000,
      intervalDays: 7,
      deliveryCount: 1,
      isActive: true,
      features: ['1 ramo semanal', 'Flores de temporada', 'Entrega a domicilio', 'Personalización básica'],
    },
    {
      name: 'Plan Semanal Premium',
      description: 'Flores premium seleccionadas cada semana. Ramos más grandes y exclusivos.',
      price: 95000,
      intervalDays: 7,
      deliveryCount: 1,
      isActive: true,
      features: ['1 ramo premium semanal', 'Flores importadas', 'Entrega prioritaria', 'Nota personalizada', 'Empaque especial'],
    },
    {
      name: 'Plan Mensual Esencial',
      description: 'Un hermoso arreglo floral cada mes. La opción perfecta para regalar.',
      price: 120000,
      intervalDays: 30,
      deliveryCount: 1,
      isActive: true,
      features: ['1 arreglo mensual', 'Flores de temporada', 'Entrega a domicilio', 'Tarjeta de regalo'],
    },
    {
      name: 'Plan Mensual Amor',
      description: 'Sorprende a alguien especial con flores cada mes. Incluye 2 entregas mensuales.',
      price: 180000,
      intervalDays: 30,
      deliveryCount: 2,
      isActive: true,
      features: ['2 entregas mensuales', 'Flores premium', 'Entrega a domicilio', 'Nota personalizada', 'Descuento en compras adicionales'],
    },
  ];

  for (const p of plans) {
    const plan = repo.create(p);
    await repo.save(plan);
  }

  console.log(`📋 ${plans.length} planes creados exitosamente`);
}
