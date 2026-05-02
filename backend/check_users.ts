import { AppDataSource } from './src/database/data-source';
import { User } from './src/modules/users/entities/user.entity';

async function checkUser() {
  try {
    await AppDataSource.initialize();
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    console.log('--- USUARIOS REGISTRADOS ---');
    users.forEach(u => {
      console.log(`Email: ${u.email} | Rol: ${u.role}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

checkUser();
