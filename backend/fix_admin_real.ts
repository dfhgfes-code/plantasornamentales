import { createConnection } from 'typeorm';
import { User } from './src/modules/users/entities/user.entity';

async function fixAdmin() {
  const url = "postgresql://postgres.pucdbmecnqduilhflppi:4eOuZtYAe4zzG6Qa@aws-1-us-west-1.pooler.supabase.com:5432/postgres";
  try {
    const connection = await createConnection({
      type: 'postgres',
      url: url,
      ssl: { rejectUnauthorized: false },
      entities: [User],
      synchronize: false,
    });
    
    const userRepository = connection.getRepository(User);
    const email = 'madridsystem@outlook.es';
    const user = await userRepository.findOne({ where: { email } });
    
    if (user) {
      user.role = 'admin' as any;
      await userRepository.save(user);
      console.log(`✅ EXITO: Usuario ${email} ahora es ADMINISTRADOR`);
    } else {
      console.log(`❌ No se encontró el usuario ${email}. Listando todos para verificar...`);
      const all = await userRepository.find();
      all.forEach(u => console.log(`- ${u.email} (${u.role})`));
    }
    
    await connection.close();
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
}

fixAdmin();
