/**
 * Script para poblar la base de datos con datos iniciales
 * Uso: npx ts-node src/database/seeds/seed.ts
 */
import { AppDataSource } from '../data-source';
import { seedProducts } from './products.seed';
import { seedPlans } from './plans.seed';

async function runSeeds() {
  console.log('🌱 Iniciando seeds...\n');

  try {
    await AppDataSource.initialize();
    console.log('✅ Conexión a base de datos establecida\n');

    await seedProducts(AppDataSource);
    await seedPlans(AppDataSource);

    console.log('\n🎉 Seeds completados exitosamente');
  } catch (error) {
    console.error('❌ Error ejecutando seeds:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

runSeeds();
