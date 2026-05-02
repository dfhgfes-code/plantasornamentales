import { AppDataSource } from './src/database/data-source';
import { User } from './src/modules/users/entities/user.entity';

async function makeAdmin() {
  const email = 'madridsystem@outlook.es';
  try {
    await AppDataSource.initialize();
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    
    if (user) {
      user.role = 'admin' as any;
      await userRepository.save(user);
      console.log(`✅ Usuario ${email} ahora es ADMINISTRADOR`);
    } else {
      console.log(`❌ No se encontró el usuario con email: ${email}`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

makeAdmin();
