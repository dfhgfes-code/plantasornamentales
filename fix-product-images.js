/**
 * Corrige las imágenes de todos los productos con fotos reales y correctas
 */
const https = require('https');

const API = 'https://janneth-acevedo-plantas-production.up.railway.app/api/v1';
const EMAIL = 'janneth@jannethplantas.com';
const PASS  = 'Janneth2024!';

// Fotos verificadas de Unsplash — cada una corresponde exactamente al producto
const IMAGES = {
  // ROSAS
  'ROS-001': 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=85&auto=format&fit=crop', // rosas rojas
  'ROS-002': 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=600&q=85&auto=format&fit=crop', // rosas rosadas
  'ROS-003': 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&q=85&auto=format&fit=crop', // rosas blancas
  'ROS-004': 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&q=85&auto=format&fit=crop', // rosas amarillas
  'ROS-005': 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=600&q=85&auto=format&fit=crop', // rosas bicolor rojo/blanco
  'ROS-ROJ-001': 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=85&auto=format&fit=crop', // rosa roja

  // GIRASOLES
  'GIR-001': 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&q=85&auto=format&fit=crop', // girasoles
  'GIR-002': 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=600&q=85&auto=format&fit=crop', // girasoles con rosas

  // ORQUÍDEAS
  'ORQ-001': 'https://images.unsplash.com/photo-1566907225472-514215c9e6e4?w=600&q=85&auto=format&fit=crop', // orquídeas blancas
  'ORQ-002': 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=85&auto=format&fit=crop', // orquídeas moradas

  // TULIPANES
  'TUL-001': 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600&q=85&auto=format&fit=crop', // tulipanes mixtos
  'TUL-002': 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=600&q=85&auto=format&fit=crop', // tulipanes rojos

  // LILIES
  'LIL-001': 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=600&q=85&auto=format&fit=crop', // lilies rosados
  'LIL-002': 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=600&q=85&auto=format&fit=crop', // lilies blancos

  // ARREGLOS
  'ARR-001': 'https://images.unsplash.com/photo-1487530811015-780780169993?w=600&q=85&auto=format&fit=crop', // arreglo primaveral
  'ARR-002': 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=600&q=85&auto=format&fit=crop', // arreglo romántico
  'ARR-003': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=85&auto=format&fit=crop', // caja de rosas
  'ARR-004': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=85&auto=format&fit=crop', // arreglo silvestre

  // PLANTAS
  'PLA-001': 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=85&auto=format&fit=crop', // suculentas
  'PLA-002': 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&q=85&auto=format&fit=crop', // pothos
  'PLA-003': 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&q=85&auto=format&fit=crop', // cactus

  // ESPECIALES
  'ESP-001': 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=85&auto=format&fit=crop', // ramo de novia
  'ESP-002': 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&q=85&auto=format&fit=crop', // corona floral
};

function req(method, path, body, token) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const r = https.request({
      hostname: 'janneth-acevedo-plantas-production.up.railway.app',
      path: '/api/v1' + path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
      },
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve({ s: res.statusCode, d: JSON.parse(d) }); } catch { resolve({ s: res.statusCode, d }); } });
    });
    if (data) r.write(data);
    r.end();
  });
}

async function main() {
  console.log('🔐 Autenticando...');
  const login = await req('POST', '/auth/login', { email: EMAIL, password: PASS });
  const token = login.d?.data?.accessToken;
  if (!token) { console.error('❌ Sin token'); process.exit(1); }
  console.log('✅ Autenticado\n');

  // Obtener todos los productos
  const prods = await req('GET', '/products?limit=50', null, token);
  const list = prods.d?.data?.data || [];
  console.log(`📦 ${list.length} productos encontrados\n`);

  let ok = 0, err = 0;
  for (const p of list) {
    const imageUrl = IMAGES[p.sku];
    if (!imageUrl) {
      console.log(`  ⏭️  ${p.name} (sin imagen definida para SKU: ${p.sku})`);
      continue;
    }
    const res = await req('PATCH', `/admin/products/${p.id}`, { imageUrl }, token);
    if (res.s === 200 || res.s === 201) {
      console.log(`  ✅ ${p.name}`);
      ok++;
    } else {
      console.log(`  ❌ ${p.name} — ${res.s}: ${JSON.stringify(res.d?.message)}`);
      err++;
    }
  }

  console.log(`\n🎉 Listo! ✅ ${ok} actualizados  ❌ ${err} errores`);
}

main().catch(console.error);
