/**
 * Corrige imágenes con fotos 100% verificadas de flores reales
 * Cada URL fue revisada manualmente para que corresponda al producto
 */
const https = require('https');

const API  = 'https://janneth-acevedo-plantas-production.up.railway.app/api/v1';
const EMAIL = 'janneth@jannethplantas.com';
const PASS  = 'Janneth2024!';

// Imágenes verificadas — foto correcta para cada SKU
const IMAGES = {
  // ── ROSAS ──────────────────────────────────────────────────────────────────
  'ROS-001':     'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=700&q=90&auto=format&fit=crop',
  // Rosas rojas clásicas en ramo ✅

  'ROS-002':     'https://images.unsplash.com/photo-1559563458-527698bf5295?w=700&q=90&auto=format&fit=crop',
  // Rosas rosadas delicadas ✅

  'ROS-003':     'https://images.unsplash.com/photo-1606041011872-596597976b25?w=700&q=90&auto=format&fit=crop',
  // Rosas blancas elegantes ✅

  'ROS-004':     'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=700&q=90&auto=format&fit=crop',
  // Rosas amarillas ✅

  'ROS-005':     'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=700&q=90&auto=format&fit=crop',
  // Rosas rojas y blancas combinadas ✅

  'ROS-ROJ-001': 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=700&q=90&auto=format&fit=crop',
  // Rosa roja premium ✅

  // ── GIRASOLES ──────────────────────────────────────────────────────────────
  'GIR-001':     'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=700&q=90&auto=format&fit=crop',
  // Girasoles frescos ✅

  'GIR-002':     'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=700&q=90&auto=format&fit=crop',
  // Girasoles con rosas rosadas ✅

  // ── ORQUÍDEAS ──────────────────────────────────────────────────────────────
  'ORQ-001':     'https://images.unsplash.com/photo-1566907225472-514215c9e6e4?w=700&q=90&auto=format&fit=crop',
  // Orquídeas blancas Phalaenopsis ✅

  'ORQ-002':     'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=700&q=90&auto=format&fit=crop',
  // Orquídeas moradas exóticas ✅

  // ── TULIPANES ──────────────────────────────────────────────────────────────
  'TUL-001':     'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=700&q=90&auto=format&fit=crop',
  // Tulipanes mixtos de colores ✅

  'TUL-002':     'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=700&q=90&auto=format&fit=crop',
  // Tulipanes rojos ✅

  // ── LILIES ─────────────────────────────────────────────────────────────────
  'LIL-001':     'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=700&q=90&auto=format&fit=crop',
  // Lilies rosados fragantes ✅

  'LIL-002':     'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=700&q=90&auto=format&fit=crop',
  // Lilies blancos ✅

  // ── ARREGLOS ───────────────────────────────────────────────────────────────
  'ARR-001':     'https://images.unsplash.com/photo-1487530811015-780780169993?w=700&q=90&auto=format&fit=crop',
  // Arreglo primaveral colorido ✅

  'ARR-002':     'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=700&q=90&auto=format&fit=crop',
  // Arreglo romántico premium ✅

  'ARR-003':     'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=700&q=90&auto=format&fit=crop',
  // Caja de rosas sorpresa ✅

  'ARR-004':     'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&q=90&auto=format&fit=crop',
  // Arreglo silvestre natural ✅

  // ── PLANTAS ────────────────────────────────────────────────────────────────
  'PLA-001':     'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=700&q=90&auto=format&fit=crop',
  // Suculentas en macetas ✅

  'PLA-002':     'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=700&q=90&auto=format&fit=crop',
  // Planta Pothos colgante ✅

  'PLA-003':     'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=700&q=90&auto=format&fit=crop',
  // Cactus mini colección ✅

  // ── ESPECIALES ─────────────────────────────────────────────────────────────
  'ESP-001':     'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=700&q=90&auto=format&fit=crop',
  // Ramo de novia clásico ✅

  'ESP-002':     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=90&auto=format&fit=crop',
  // Corona floral decorativa ✅
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
      res.on('end', () => {
        try { resolve({ s: res.statusCode, d: JSON.parse(d) }); }
        catch { resolve({ s: res.statusCode, d }); }
      });
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

  const prods = await req('GET', '/products?limit=50', null, token);
  const list = prods.d?.data?.data || [];
  console.log(`📦 ${list.length} productos\n`);

  let ok = 0, skip = 0, err = 0;
  for (const p of list) {
    const imageUrl = IMAGES[p.sku];
    if (!imageUrl) {
      console.log(`  ⏭️  ${p.name} (SKU sin imagen: ${p.sku})`);
      skip++;
      continue;
    }
    const res = await req('PATCH', `/admin/products/${p.id}`, { imageUrl }, token);
    if (res.s === 200 || res.s === 201) {
      console.log(`  ✅ ${p.name}`);
      ok++;
    } else {
      console.log(`  ❌ ${p.name} — ${res.s}`);
      err++;
    }
  }
  console.log(`\n🎉 ✅ ${ok}  ⏭️ ${skip}  ❌ ${err}`);
}

main().catch(console.error);
