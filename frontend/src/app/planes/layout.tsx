import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Suscripciones Florales | Janneth Acevedo',
  description: 'Recibe flores frescas a domicilio cada semana o cada mes. Planes de suscripción flexibles, sin compromisos. Pausa o cancela cuando quieras.',
  keywords: 'suscripción flores, flores a domicilio, ramos semanales, flores mensuales, suscripción floral Colombia',
  openGraph: {
    title: 'Planes de Suscripción Floral | Janneth Acevedo',
    description: 'Flores frescas en tu puerta cada semana o mes. Elige tu plan y nosotros nos encargamos de todo.',
    images: ['/flowers/f-rosas-rosadas.jpg'],
    type: 'website',
  },
};

export default function PlanesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
