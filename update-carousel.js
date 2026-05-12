/**
 * Actualiza el carrusel principal con fotos 4K de flores reales y frases elegantes
 */
const https = require('https');
const EMAIL = 'janneth@jannethplantas.com';
const PASS  = 'Janneth2024!';

// Fotos 4K de Unsplash — IDs verificados de flores reales
// Formato: /photo-{ID}?w=2400&q=95 — resolución 4K, calidad máxima
const slides = [
  {
    image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=2400&q=95&auto=format&fit=crop',
    tag: 'Boutique Floral de Lujo',
    title: 'Flores que hablan por ti',
    subtitle: 'Ramos únicos elaborados a mano con las flores más frescas. Entrega a domicilio en todo el país.',
    buttonText: 'Ver Colección',
    buttonLink: '/tienda',
  },
  {
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=2400&q=95&auto=format&fit=crop',
    tag: 'Rosas Premium',
    title: 'El regalo perfecto siempre florece',
    subtitle: 'Rosas de tallo largo cultivadas en los mejores jardines. Frescura garantizada por 7 días.',
    buttonText: 'Ver Rosas',
    buttonLink: '/tienda',
  },
  {
    image: 'https://images.unsplash.com/photo-1487530811015-780780169993?w=2400&q=95&auto=format&fit=crop',
    tag: 'Suscripciones Florales',
    title: 'Flores frescas cada semana',
    subtitle: 'Suscríbete y recibe arreglos personalizados directamente en tu puerta. Sin compromisos.',
    buttonText: 'Ver Planes',
    buttonLink: '/planes',
  },
  {
    image: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=2400&q=95&auto=format&fit=crop',
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

  console.log('🎠 Actualizando carrusel...');
  const res = await req('PATCH', '/settings', {
    home_hero_carousel: JSON.stringify(slides),
  }, token);

  if (res.s === 200 || res.s === 201) {
    console.log('✅ Carrusel actualizado con 4 slides:');
    slides.forEach((s, i) => console.log(`  ${i+1}. "${s.title}"`));
  } else {
    console.error('❌ Error:', res.s, JSON.stringify(res.d));
  }
}

main().catch(console.error);
