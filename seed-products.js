/**
 * Script para poblar la tienda con productos reales
 * Uso: node seed-products.js
 */
const https = require('https');
const http = require('http');

const API_URL = 'https://janneth-acevedo-plantas-production.up.railway.app/api/v1';
const ADMIN_EMAIL = 'janneth@jannethplantas.com';
const ADMIN_PASSWORD = 'Janneth2024!';

const products = [
  // ── ROSAS ──────────────────────────────────────────────────
  {
    name: 'Rosas Rojas Premium',
    description: 'Docena de rosas rojas de tallo largo cultivadas en los mejores jardines. Perfectas para declaraciones de amor y ocasiones muy especiales. Frescura garantizada por 7 días.',
    price: 85000,
    category: 'Rosas',
    sku: 'ROS-001',
    stock: 50,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=600&q=85&auto=format&fit=crop',
  },
  {
    name: 'Rosas Rosadas Delicadas',
    description: 'Ramo de 12 rosas rosadas de tallo largo, ideales para expresar ternura, afecto y cariño. Un regalo que siempre enamora.',
    price: 80000,
    category: 'Rosas',
    sku: 'ROS-002',
    stock: 45,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=600&q=85&auto=format&fit=crop',
  },
  {
    name: 'Rosas Blancas Eternas',
    description: 'Docena de rosas blancas de pureza incomparable. Símbolo de elegancia y nuevos comienzos. Ideales para bodas y celebraciones.',
    price: 88000,
    category: 'Rosas',
    sku: 'ROS-003',
    stock: 35,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&q=85&auto=format&fit=crop',
  },
  {
    name: 'Rosas Amarillas Alegría',
    description: 'Ramo de 12 rosas amarillas que transmiten alegría, amistad y buenos deseos. Perfectas para cumpleaños y celebraciones.',
    price: 78000,
    category: 'Rosas',
    sku: 'ROS-004',
    stock: 40,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&q=85&auto=format&fit=crop',
  },
  {
    name: 'Bouquet Rosas Bicolor',
    description: 'Espectacular arreglo de rosas rojas y blancas combinadas. Un contraste elegante que representa la pasión y la pureza.',
    price: 95000,
    category: 'Rosas',
    sku: 'ROS-005',
    stock: 25,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=600&q=85&auto=format&fit=crop',
  },

  // ── GIRASOLES ──────────────────────────────────────────────
  {
    name: 'Girasoles Alegres',
    description: 'Ramo de 6 girasoles frescos y radiantes que iluminan cualquier espacio. Símbolo de felicidad y energía positiva.',
    price: 65000,
    category: 'Girasoles',
    sku: 'GIR-001',
    stock: 30,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&q=85&auto=format&fit=crop',
  },
  {
    name: 'Girasoles con Rosas',
    description: 'Combinación perfecta de girasoles y rosas rosadas. Un arreglo cálido y romántico que conquista corazones.',
    price: 90000,
    category: 'Girasoles',
    sku: 'GIR-002',
    stock: 20,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=600&q=85&auto=format&fit=crop',
  },

  // ── ORQUÍDEAS ──────────────────────────────────────────────
  {
    name: 'Orquídeas Blancas Elegantes',
    description: 'Elegante arreglo de orquídeas blancas Phalaenopsis en maceta decorativa. Duran semanas con cuidado mínimo. El regalo más sofisticado.',
    price: 120000,
    category: 'Orquídeas',
    sku: 'ORQ-001',
    stock: 20,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1566907225472-514215c9e6e4?w=600&q=85&auto=format&fit=crop',
  },
  {
    name: 'Orquídeas Moradas Exóticas',
    description: 'Orquídeas moradas de variedad exótica, símbolo de lujo y admiración. Presentadas en elegante maceta negra.',
    price: 135000,
    category: 'Orquídeas',
    sku: 'ORQ-002',
    stock: 12,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=85&auto=format&fit=crop',
  },

  // ── TULIPANES ──────────────────────────────────────────────
  {
    name: 'Tulipanes Mixtos Primavera',
    description: 'Ramo de 10 tulipanes en colores variados: rojo, rosa, amarillo y morado. Símbolo de amor perfecto y llegada de la primavera.',
    price: 75000,
    category: 'Tulipanes',
    sku: 'TUL-001',
    stock: 40,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600&q=85&auto=format&fit=crop',
  },
  {
    name: 'Tulipanes Rojos Pasión',
    description: '12 tulipanes rojos de tallo largo, frescos y vibrantes. Una declaración de amor apasionada y elegante.',
    price: 72000,
    category: 'Tulipanes',
    sku: 'TUL-002',
    stock: 30,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=600&q=85&auto=format&fit=crop',
  },

  // ── LILIES ─────────────────────────────────────────────────
  {
    name: 'Lilies Rosados Fragantes',
    description: 'Hermosos lilies rosados de fragancia suave y duradera. Su aroma llena el ambiente de frescura y elegancia.',
    price: 70000,
    category: 'Lilies',
    sku: 'LIL-001',
    stock: 25,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=600&q=85&auto=format&fit=crop',
  },
  {
    name: 'Lilies Blancos Pureza',
    description: 'Ramo de lilies blancos, símbolo de pureza y renovación. Perfectos para momentos solemnes y celebraciones especiales.',
    price: 68000,
    category: 'Lilies',
    sku: 'LIL-002',
    stock: 20,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&q=85&auto=format&fit=crop',
  },

  // ── ARREGLOS ───────────────────────────────────────────────
  {
    name: 'Arreglo Primaveral Colorido',
    description: 'Mezcla colorida de flores de temporada en florero de vidrio. Rosas, lilies, girasoles y follaje verde. Un jardín en tu hogar.',
    price: 95000,
    category: 'Arreglos',
    sku: 'ARR-001',
    stock: 15,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1487530811015-780780169993?w=600&q=85&auto=format&fit=crop',
  },
  {
    name: 'Arreglo Romántico Premium',
    description: 'Lujoso arreglo de rosas rojas, lilies blancos y orquídeas en caja de madera. El regalo más romántico y memorable.',
    price: 180000,
    category: 'Arreglos',
    sku: 'ARR-002',
    stock: 10,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=85&auto=format&fit=crop',
  },
  {
    name: 'Caja de Rosas Sorpresa',
    description: '25 rosas premium en caja de lujo con tapa. Disponible en rojo, rosa o blanco. Incluye tarjeta personalizada.',
    price: 150000,
    category: 'Arreglos',
    sku: 'ARR-003',
    stock: 18,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=85&auto=format&fit=crop',
  },
  {
    name: 'Arreglo Silvestre Natural',
    description: 'Composición de flores silvestres y follaje natural. Estilo boho-chic para quienes aman lo auténtico y natural.',
    price: 85000,
    category: 'Arreglos',
    sku: 'ARR-004',
    stock: 12,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=85&auto=format&fit=crop',
  },

  // ── PLANTAS ────────────────────────────────────────────────
  {
    name: 'Suculentas Decorativas',
    description: 'Set de 3 suculentas en macetas de cerámica artesanal. Plantas de bajo mantenimiento, perfectas para oficinas y hogares modernos.',
    price: 55000,
    category: 'Plantas',
    sku: 'PLA-001',
    stock: 35,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=85&auto=format&fit=crop',
  },
  {
    name: 'Planta Pothos Colgante',
    description: 'Hermosa planta Pothos en maceta colgante de macramé. Purifica el aire y decora cualquier rincón con su follaje verde brillante.',
    price: 45000,
    category: 'Plantas',
    sku: 'PLA-002',
    stock: 28,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&q=85&auto=format&fit=crop',
  },
  {
    name: 'Cactus Mini Colección',
    description: 'Set de 5 cactus mini en macetas de terracota pintadas a mano. Únicos, resistentes y llenos de personalidad.',
    price: 48000,
    category: 'Plantas',
    sku: 'PLA-003',
    stock: 40,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&q=85&auto=format&fit=crop',
  },

  // ── ESPECIALES ─────────────────────────────────────────────
  {
    name: 'Ramo de Novia Clásico',
    description: 'Elegante ramo de novia con rosas blancas, lilies y follaje verde. Diseñado por nuestras floristas expertas para el día más especial.',
    price: 250000,
    category: 'Especiales',
    sku: 'ESP-001',
    stock: 8,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=85&auto=format&fit=crop',
  },
  {
    name: 'Corona Floral Decorativa',
    description: 'Corona floral artesanal con flores secas y preservadas. Decoración única para el hogar que dura meses sin mantenimiento.',
    price: 110000,
    category: 'Especiales',
    sku: 'ESP-002',
    stock: 10,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&q=85&auto=format&fit=crop',
  },
];

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_URL + path);
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;

    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };

    const req = lib.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, data: raw }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  console.log('🌸 Iniciando carga de productos...\n');

  // 1. Login
  console.log('🔐 Autenticando...');
  const loginRes = await request('POST', '/auth/login', {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  if (loginRes.status !== 200 && loginRes.status !== 201) {
    console.error('❌ Error de autenticación:', loginRes.data);
    process.exit(1);
  }

  const token = loginRes.data?.data?.accessToken;
  if (!token) {
    console.error('❌ No se recibió token. Respuesta:', JSON.stringify(loginRes.data, null, 2));
    process.exit(1);
  }
  console.log('✅ Autenticado correctamente\n');

  // 2. Crear productos
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const product of products) {
    const res = await request('POST', '/admin/products', product, token);
    if (res.status === 201 || res.status === 200) {
      console.log(`  ✅ ${product.name}`);
      created++;
    } else if (res.status === 409 || (res.data?.message || '').includes('duplicate') || (res.data?.message || '').includes('SKU')) {
      console.log(`  ⏭️  ${product.name} (ya existe)`);
      skipped++;
    } else {
      console.log(`  ❌ ${product.name} — ${res.status}: ${JSON.stringify(res.data?.message || res.data)}`);
      errors++;
    }
  }

  console.log(`\n🎉 Listo!`);
  console.log(`   ✅ Creados: ${created}`);
  console.log(`   ⏭️  Omitidos: ${skipped}`);
  console.log(`   ❌ Errores: ${errors}`);
}

main().catch(console.error);
