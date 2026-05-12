/**
 * Actualiza productos con imágenes locales del servidor
 * Las imágenes están en /public/flowers/ del frontend
 */
const https = require('https');
const EMAIL = 'janneth@jannethplantas.com';
const PASS  = 'Janneth2024!';

// Rutas locales — servidas desde Vercel, nunca cambian
const BASE = 'https://janneth-acevedo-plantas.vercel.app';

const IMAGES = {
  // ROSAS
  'ROS-001':     `${BASE}/flowers/rosa-roja.jpg`,
  'ROS-002':     `${BASE}/flowers/rosas-rosadas.jpg`,
  'ROS-003':     `${BASE}/flowers/rosas-blancas.jpg`,
  'ROS-004':     `${BASE}/flowers/rosas-amarillas.jpg`,
  'ROS-005':     `${BASE}/flowers/rosas-rosadas.jpg`,
  'ROS-ROJ-001': `${BASE}/flowers/rosa-roja.jpg`,
  // GIRASOLES
  'GIR-001':     `${BASE}/flowers/girasoles.jpg`,
  'GIR-002':     `${BASE}/flowers/girasoles-rosas.jpg`,
  // ORQUÍDEAS
  'ORQ-001':     `${BASE}/flowers/orquideas-blancas.jpg`,
  'ORQ-002':     `${BASE}/flowers/orquideas-blancas.jpg`,
  // TULIPANES
  'TUL-001':     `${BASE}/flowers/tulipanes.jpg`,
  'TUL-002':     `${BASE}/flowers/tulipanes.jpg`,
  // LILIES
  'LIL-001':     `${BASE}/flowers/lilies.jpg`,
  'LIL-002':     `${BASE}/flowers/lilies.jpg`,
  // ARREGLOS
  'ARR-001':     `${BASE}/flowers/arreglo.jpg`,
  'ARR-002':     `${BASE}/flowers/arreglo.jpg`,
  'ARR-003':     `${BASE}/flowers/rosas-rosadas.jpg`,
  'ARR-004':     `${BASE}/flowers/arreglo.jpg`,
  // PLANTAS
  'PLA-001':     `${BASE}/flowers/suculentas.jpg`,
  'PLA-002':     `${BASE}/flowers/suculentas.jpg`,
  'PLA-003':     `${BASE}/flowers/suculentas.jpg`,
  // ESPECIALES
  'ESP-001':     `${BASE}/flowers/ramo-novia.jpg`,
  'ESP-002':     `${BASE}/flowers/rosas-rosadas.jpg`,
};

// Carrusel con imágenes locales
const CAROUSEL = [
  {
    image: `${BASE}/flowers/arreglo.jpg`,
    tag: 'Boutique Floral de Lujo',
    title: 'Flores que hablan por ti',
    subtitle: 'Ramos únicos elaborados a mano con las flores más frescas. Entrega a domicilio en todo el país.',
    buttonText: 'Ver Colección',
    buttonLink: '/tienda',
  },
  {
    image: `${BASE}/flowers/rosa-roja.jpg`,
    tag: 'Rosas Premium',
    title: 'El regalo perfecto siempre florece',
    subtitle: 'Rosas de tallo largo cultivadas en los mejores jardines. Frescura garantizada por 7 días.',
    buttonText: 'Ver Rosas',
    buttonLink: '/tienda',
  },
  {
    image: `${BASE}/flowers/girasoles.jpg`,
    tag: 'Suscripciones Florales',
    title: 'Flores frescas cada semana',
    subtitle: 'Suscríbete y recibe arreglos personalizados directamente en tu puerta. Sin compromisos.',
    buttonText: 'Ver Planes',
    buttonLink: '/planes',
  },
  {
    image: `${BASE}/flowers/rosas-rosadas.jpg`,
    tag: 'Momentos Especiales',
    title: 'Cada flor cuenta una historia',
    subtitle: 'Transforma cualquier momento en un recuerdo inolvidable con nuestros arreglos exclusivos.',
    buttonText: 'Explorar Tienda',
    buttonLink: '/tienda',
  },
];

function req(method, path, body, token) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const r = https.request({
      hostname: 'janneth-acevedo-plantas-production.up.railway.app',
      path: '/api/v1' + path, method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
      },
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { try { resolve({ s: res.statusCode, d: JSON.parse(d) }); } catch { resolve({ s: res.statusCode, d }); } });
    });
    if (data) r.write(data); r.end();
  });
}

async function main() {
  console.log('🔐 Autenticando...');
  const login = await req('POST', '/auth/login', { email: EMAIL, password: PASS });
  const token = login.d?.data?.accessToken;
  if (!token) { console.error('❌ Sin token'); process.exit(1); }
  console.log('✅ Autenticado\n');

  // Actualizar productos
  console.log('🌸 Actualizando imágenes de productos...');
  const prods = await req('GET', '/products?limit=50', null, token);
  const list = prods.d?.data?.data || [];
  let ok = 0;
  for (const p of list) {
    const imageUrl = IMAGES[p.sku];
    if (!imageUrl) { console.log(`  ⏭️  ${p.name} (sin imagen para SKU: ${p.sku})`); continue; }
    const res = await req('PATCH', `/admin/products/${p.id}`, { imageUrl }, token);
    if (res.s === 200) { console.log(`  ✅ ${p.name}`); ok++; }
    else console.log(`  ❌ ${p.name} — ${res.s}`);
  }

  // Actualizar carrusel
  console.log('\n🎠 Actualizando carrusel...');
  const carRes = await req('PATCH', '/settings', {
    home_hero_carousel: JSON.stringify(CAROUSEL),
  }, token);
  if (carRes.s === 200) console.log('✅ Carrusel actualizado con 4 slides de flores locales');
  else console.log('❌ Error carrusel:', carRes.s);

  console.log(`\n🎉 ${ok} productos actualizados`);
}

main().catch(console.error);
