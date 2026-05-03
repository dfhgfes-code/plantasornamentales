import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Janneth Acevedo | Flores & Suscripciones',
  description: 'Flores frescas a domicilio. Suscripciones semanales y mensuales.',
  other: {
    'referrer': 'no-referrer-when-downgrade',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <Toaster

          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '12px',
              fontSize: '13px',
              background: '#1c1c1c',
              color: '#fff',
            },
            success: { iconTheme: { primary: '#f0436e', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
