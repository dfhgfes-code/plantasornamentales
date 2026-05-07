import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Janneth Acevedo',
  description: 'Política de privacidad y tratamiento de datos personales de Janneth Acevedo.',
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#fdfaf7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-10">
          <p className="text-rose-600 text-xs font-semibold tracking-widest uppercase mb-2">Legal</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Política de Privacidad
          </h1>
          <p className="text-gray-400 text-sm">Última actualización: enero 2025</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
          <Section title="1. Responsable del tratamiento">
            Janneth Acevedo - Plantas Ornamentales, con domicilio en Bogotá, Colombia, es responsable del tratamiento de los datos personales recopilados a través de este sitio web, de conformidad con la Ley 1581 de 2012 y el Decreto 1377 de 2013.
          </Section>

          <Section title="2. Datos que recopilamos">
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li><strong>Datos de registro:</strong> nombre, apellido, correo electrónico.</li>
              <li><strong>Datos de pedido:</strong> dirección de entrega, ciudad, teléfono de contacto.</li>
              <li><strong>Datos de pago:</strong> procesados directamente por Wompi; no almacenamos datos de tarjetas.</li>
              <li><strong>Datos de navegación:</strong> cookies técnicas para el funcionamiento del sitio.</li>
            </ul>
          </Section>

          <Section title="3. Finalidad del tratamiento">
            Utilizamos tus datos para:
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mt-2">
              <li>Procesar y gestionar tus pedidos y suscripciones.</li>
              <li>Enviarte confirmaciones y actualizaciones de estado de pedidos.</li>
              <li>Mejorar nuestros servicios y experiencia de usuario.</li>
              <li>Enviarte comunicaciones comerciales (solo con tu consentimiento).</li>
              <li>Cumplir con obligaciones legales y fiscales.</li>
            </ul>
          </Section>

          <Section title="4. Base legal del tratamiento">
            El tratamiento de tus datos se basa en:
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mt-2">
              <li>La ejecución del contrato de compraventa o suscripción.</li>
              <li>Tu consentimiento explícito para comunicaciones de marketing.</li>
              <li>El cumplimiento de obligaciones legales aplicables.</li>
            </ul>
          </Section>

          <Section title="5. Compartición de datos">
            No vendemos ni cedemos tus datos a terceros. Podemos compartirlos únicamente con:
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mt-2">
              <li>Proveedores de servicios de pago (Wompi) para procesar transacciones.</li>
              <li>Servicios de mensajería para gestionar entregas.</li>
              <li>Autoridades competentes cuando sea requerido por ley.</li>
            </ul>
          </Section>

          <Section title="6. Conservación de datos">
            Conservamos tus datos mientras mantengas una cuenta activa o sea necesario para cumplir con obligaciones legales. Puedes solicitar la eliminación de tu cuenta en cualquier momento.
          </Section>

          <Section title="7. Tus derechos">
            De acuerdo con la Ley 1581 de 2012, tienes derecho a:
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mt-2">
              <li>Conocer, actualizar y rectificar tus datos personales.</li>
              <li>Solicitar la supresión de tus datos.</li>
              <li>Revocar la autorización para el tratamiento de datos.</li>
              <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
            </ul>
            Para ejercer estos derechos, contáctanos a través de nuestra{' '}
            <Link href="/contacto" className="text-rose-600 hover:underline">página de contacto</Link>.
          </Section>

          <Section title="8. Cookies">
            Utilizamos cookies técnicas esenciales para el funcionamiento del sitio. No utilizamos cookies de seguimiento de terceros sin tu consentimiento.
          </Section>

          <Section title="9. Seguridad">
            Implementamos medidas técnicas y organizativas para proteger tus datos contra acceso no autorizado, pérdida o alteración. Las transacciones de pago se realizan bajo protocolo HTTPS con cifrado SSL.
          </Section>

          <Section title="10. Cambios en esta política">
            Podemos actualizar esta política periódicamente. Te notificaremos de cambios significativos por correo electrónico o mediante un aviso destacado en el sitio.
          </Section>
        </div>

        <div className="mt-6 text-center">
          <Link href="/terminos" className="text-sm text-rose-500 hover:text-rose-600 font-medium transition-colors">
            Ver Términos y Condiciones →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h2>
      <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
    </div>
  );
}
