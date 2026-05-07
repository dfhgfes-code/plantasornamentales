import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Janneth Acevedo',
  description: 'Términos y condiciones de uso de Janneth Acevedo - Plantas Ornamentales.',
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#fdfaf7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-10">
          <p className="text-rose-600 text-xs font-semibold tracking-widest uppercase mb-2">Legal</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Términos y Condiciones
          </h1>
          <p className="text-gray-400 text-sm">Última actualización: enero 2025</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10 prose prose-gray max-w-none">
          <Section title="1. Aceptación de los términos">
            Al acceder y utilizar el sitio web de Janneth Acevedo - Plantas Ornamentales, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestros servicios.
          </Section>

          <Section title="2. Descripción del servicio">
            Janneth Acevedo ofrece la venta de flores, plantas ornamentales y suscripciones florales con entrega a domicilio en Colombia. Nos reservamos el derecho de modificar o discontinuar cualquier servicio sin previo aviso.
          </Section>

          <Section title="3. Pedidos y pagos">
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Los precios están expresados en pesos colombianos (COP) e incluyen IVA cuando aplica.</li>
              <li>El pago se procesa de forma segura a través de Wompi.</li>
              <li>Una vez confirmado el pago, recibirás un correo de confirmación.</li>
              <li>Nos reservamos el derecho de cancelar pedidos en caso de error en el precio o falta de stock.</li>
            </ul>
          </Section>

          <Section title="4. Política de envíos">
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Los envíos se realizan en las ciudades indicadas en nuestra plataforma.</li>
              <li>Los tiempos de entrega son estimados y pueden variar según la ubicación.</li>
              <li>No nos hacemos responsables por demoras causadas por factores externos (clima, orden público, etc.).</li>
            </ul>
          </Section>

          <Section title="5. Suscripciones">
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Las suscripciones se renuevan automáticamente según la frecuencia elegida.</li>
              <li>Puedes pausar o cancelar tu suscripción en cualquier momento desde tu perfil.</li>
              <li>Las cancelaciones aplican a partir del siguiente ciclo de facturación.</li>
              <li>No se realizan reembolsos por períodos ya facturados.</li>
            </ul>
          </Section>

          <Section title="6. Política de devoluciones">
            Dado que trabajamos con productos perecederos, no aceptamos devoluciones. Sin embargo, si recibes un producto en mal estado, contáctanos dentro de las 24 horas siguientes a la entrega con fotografías del producto y gestionaremos una solución.
          </Section>

          <Section title="7. Propiedad intelectual">
            Todo el contenido del sitio (imágenes, textos, logotipos, diseños) es propiedad de Janneth Acevedo y está protegido por las leyes de propiedad intelectual de Colombia. Queda prohibida su reproducción sin autorización expresa.
          </Section>

          <Section title="8. Limitación de responsabilidad">
            Janneth Acevedo no será responsable por daños indirectos, incidentales o consecuentes derivados del uso de nuestros servicios. Nuestra responsabilidad máxima se limita al valor del pedido en cuestión.
          </Section>

          <Section title="9. Modificaciones">
            Nos reservamos el derecho de actualizar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.
          </Section>

          <Section title="10. Contacto">
            Para cualquier consulta sobre estos términos, puedes contactarnos a través de nuestra{' '}
            <Link href="/contacto" className="text-rose-600 hover:underline">página de contacto</Link>.
          </Section>
        </div>

        <div className="mt-6 text-center">
          <Link href="/privacidad" className="text-sm text-rose-500 hover:text-rose-600 font-medium transition-colors">
            Ver Política de Privacidad →
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
