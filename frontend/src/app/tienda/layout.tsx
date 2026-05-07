import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tienda | Janneth Acevedo - Flores y Plantas Ornamentales',
  description: 'Explora nuestra colección de flores frescas, ramos y arreglos florales. Rosas, girasoles, tulipanes, orquídeas y más. Entrega a domicilio en Colombia.',
  keywords: 'flores, ramos, arreglos florales, rosas, girasoles, tulipanes, orquídeas, plantas ornamentales, Bogotá, Colombia',
  openGraph: {
    title: 'Tienda de Flores | Janneth Acevedo',
    description: 'Flores frescas seleccionadas con entrega a domicilio. Ramos únicos para momentos inolvidables.',
    images: ['/flowers/f-rosas-rosadas.jpg'],
    type: 'website',
  },
};

export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
