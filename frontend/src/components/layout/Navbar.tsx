'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  const itemCount = useCartStore((s) => s.itemCount());
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  if (pathname?.startsWith('/admin')) return null;


  const handleLogout = () => { logout(); router.push('/'); };

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/tienda', label: 'Tienda' },
    { href: '/planes', label: 'Suscripciones' },
    { href: '/nosotros', label: 'Nosotros' },
  ];

  return (
    <nav className={cn(
      'sticky top-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-white shadow-[0_1px_20px_rgba(0,0,0,0.07)] border-b border-gray-100'
        : 'bg-white/95 backdrop-blur-md'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size="md" horizontal />
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-xl transition-all',
                  pathname === l.href
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50/60'
                )}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-1.5">
            {/* Carrito */}
            <Link href="/carrito"
              className="relative p-2.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] rounded-full w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center font-bold px-1">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {mounted && (
              isAuthenticated ? (
                <div className="hidden md:flex items-center gap-1">
                  {(user?.role === 'admin' || user?.role === 'super_admin') && (
                    <Link href="/admin" className="p-2.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Admin">
                      <LayoutDashboard className="w-5 h-5" />
                    </Link>
                  )}
                  <Link href="/perfil" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-rose-600" />
                    </div>
                    <span className="hidden lg:block">{user?.firstName}</span>
                  </Link>
                  <button onClick={handleLogout} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                    Ingresar
                  </Link>
                  <Link href="/registro" className="px-5 py-2 text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all shadow-pink hover:shadow-lg hover:-translate-y-px">
                    Registrarse
                  </Link>
                </div>
              )
            )}

            <button className="md:hidden p-2.5 text-gray-600 hover:bg-rose-50 rounded-xl transition-all" onClick={() => setOpen(!open)}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Móvil */}
        {open && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100 space-y-1 animate-slide-down">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className={cn('block px-4 py-3 text-sm font-medium rounded-xl transition-all',
                  pathname === l.href ? 'bg-rose-50 text-rose-600' : 'text-gray-700 hover:bg-rose-50/60')}>
                {l.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
              {mounted && (
                isAuthenticated ? (
                  <>
                    <Link href="/perfil" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 rounded-xl">
                      <User className="w-4 h-4" /> Mi perfil
                    </Link>
                    {(user?.role === 'admin' || user?.role === 'super_admin') && (
                      <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 rounded-xl">
                        <LayoutDashboard className="w-4 h-4" /> Panel Admin
                      </Link>
                    )}
                    <button onClick={() => { handleLogout(); setOpen(false); }} className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl">
                      <LogOut className="w-4 h-4" /> Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 rounded-xl">Ingresar</Link>
                    <Link href="/registro" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl">Registrarse</Link>
                  </>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

