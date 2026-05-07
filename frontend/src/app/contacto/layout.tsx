import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto | Janneth Acevedo',
  description: 'Contáctanos para consultas sobre pedidos, suscripciones o productos. Respondemos en menos de 24 horas.',
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
