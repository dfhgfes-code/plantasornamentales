import { DataSource } from 'typeorm';
import { Product } from '../../modules/products/entities/product.entity';

export async function seedProducts(dataSource: DataSource) {
  const repo = dataSource.getRepository(Product);

  const count = await repo.count();
  if (count > 0) {
    console.log('✅ Productos ya existen, omitiendo seed');
    return;
  }

  const products = [
    {
      name: 'Rosas Rojas Premium',
      description: 'Docena de rosas rojas de tallo largo, perfectas para ocasiones especiales.',
      price: 85000,
      category: 'Rosas',
      sku: 'ROS-001',
      stock: 50,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=500',
      rating: 4.9,
      reviewsCount: 124,
    },
    {
      name: 'Girasoles Alegres',
      description: 'Ramo de 6 girasoles frescos que iluminan cualquier espacio.',
      price: 65000,
      category: 'Girasoles',
      sku: 'GIR-001',
      stock: 30,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=500',
      rating: 4.8,
      reviewsCount: 85,
    },
    {
      name: 'Orquídeas Blancas',
      description: 'Elegante arreglo de orquídeas blancas en maceta decorativa.',
      price: 120000,
      category: 'Orquídeas',
      sku: 'ORQ-001',
      stock: 20,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1566907225472-514215c9e6e4?w=500',
      rating: 5.0,
      reviewsCount: 42,
    },
    {
      name: 'Tulipanes Mixtos',
      description: 'Ramo de 10 tulipanes en colores variados, símbolo de amor perfecto.',
      price: 75000,
      category: 'Tulipanes',
      sku: 'TUL-001',
      stock: 40,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500',
      rating: 4.7,
      reviewsCount: 63,
    },
    {
      name: 'Lilies Rosados',
      description: 'Hermosos lilies rosados de fragancia suave y duradera.',
      price: 70000,
      category: 'Lilies',
      sku: 'LIL-001',
      stock: 25,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=500',
      rating: 4.9,
      reviewsCount: 29,
    },
    {
      name: 'Arreglo Primaveral',
      description: 'Mezcla colorida de flores de temporada en florero de vidrio.',
      price: 95000,
      category: 'Arreglos',
      sku: 'ARR-001',
      stock: 15,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1487530811015-780780169993?w=500',
      rating: 4.6,
      reviewsCount: 18,
    },
    {
      name: 'Rosas Rosadas Delicadas',
      description: 'Ramo de 12 rosas rosadas, ideales para expresar ternura y afecto.',
      price: 80000,
      category: 'Rosas',
      sku: 'ROS-002',
      stock: 45,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=500',
      rating: 4.8,
      reviewsCount: 94,
    },
    {
      name: 'Claveles Blancos',
      description: 'Docena de claveles blancos, símbolo de pureza y admiración.',
      price: 55000,
      category: 'Claveles',
      sku: 'CLA-001',
      stock: 60,
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=500',
      rating: 4.7,
      reviewsCount: 51,
    },

  ];

  for (const p of products) {
    const product = repo.create(p);
    await repo.save(product);
  }

  console.log(`🌸 ${products.length} productos creados exitosamente`);
}
