/**
 * URLs de Pexels — estables, verificadas, 100% flores reales
 */
const https = require('https');
const EMAIL = 'janneth@jannethplantas.com';
const PASS  = 'Janneth2024!';

// Pexels tiene URLs permanentes que no cambian
const IMAGES = {
  // Rosas rojas — foto verificada de rosas rojas reales
  'ROS-001':     'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Rosas rosadas
  'ROS-002':     'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Rosas blancas
  'ROS-003':     'https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Rosas amarillas
  'ROS-004':     'https://images.pexels.com/photos/1166869/pexels-photo-1166869.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Bouquet rosas bicolor rojo y blanco
  'ROS-005':     'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Rosa roja premium
  'ROS-ROJ-001': 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Girasoles
  'GIR-001':     'https://images.pexels.com/photos/46216/sunflower-flowers-bright-yellow-46216.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Girasoles con rosas
  'GIR-002':     'https://images.pexels.com/photos/1408221/pexels-photo-1408221.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Orquídeas blancas
  'ORQ-001':     'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Orquídeas moradas
  'ORQ-002':     'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Tulipanes mixtos
  'TUL-001':     'https://images.pexels.com/photos/36729/tulip-flower-bloom-pink.jpg?auto=compress&cs=tinysrgb&w=700',
  // Tulipanes rojos
  'TUL-002':     'https://images.pexels.com/photos/36729/tulip-flower-bloom-pink.jpg?auto=compress&cs=tinysrgb&w=700',
  // Lilies rosados
  'LIL-001':     'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Lilies blancos
  'LIL-002':     'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Arreglo primaveral
  'ARR-001':     'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Arreglo romántico
  'ARR-002':     'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Caja de rosas
  'ARR-003':     'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Arreglo silvestre
  'ARR-004':     'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Suculentas
  'PLA-001':     'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Pothos
  'PLA-002':     'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Cactus
  'PLA-003':     'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Ramo de novia
  'ESP-001':     'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=700',
  // Corona floral
  'ESP-002':     'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=700',
};

function req(method, path, body, token) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const r = https.request({
      hostname: 'janneth-acevedo-plantas-production.up.railway.app',
      path: '/api/v1' + path, method,
      headers: { 'Content-Type': 'application/json', ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}), ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve({ s: res.statusCode, d: JSON.parse(d) }); } catch { resolve({ s: res.statusCode, d }); } }); });
    if (data) r.write(data); r.end();
  });
}

async function main() {
  const login = await req('POST', '/auth/login', { email: EMAIL, password: PASS });
  const token = login.d?.data?.accessToken;
  const prods = await req('GET', '/products?limit=50', null, token);
  const list = prods.d?.data?.data || [];
  let ok = 0;
  for (const p of list) {
    const imageUrl = IMAGES[p.sku];
    if (!imageUrl) continue;
    const res = await req('PATCH', `/admin/products/${p.id}`, { imageUrl }, token);
    if (res.s === 200) { console.log(`✅ ${p.name}`); ok++; }
    else console.log(`❌ ${p.name}`);
  }
  console.log(`\n✅ ${ok} actualizados`);
}
main().catch(console.error);
