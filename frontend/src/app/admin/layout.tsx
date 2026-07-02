'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  Calendar, 
  Settings, 
  ShoppingBag,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Flower2,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { href: '/admin',              label: 'Dashboard',     icon: LayoutDashboard },
    { href: '/admin/productos',    label: 'Productos',     icon: Package },
    { href: '/admin/planes',       label: 'Planes',        icon: Calendar },
    { href: '/admin/pedidos',      label: 'Pedidos',       icon: ShoppingBag },
    { href: '/admin/configuracion',label: 'Configuración', icon: Settings },
  ];

  if (user?.role === 'super_admin') {
    navItems.push({ href: '/admin/super', label: 'Super Admin', icon: ShieldCheck });
  }

  return (
    <div className="flex min-h-screen bg-[#f8f7f5]">

      {/* ── Mobile Menu Button ── */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-600 hover:text-rose-600 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* ── Mobile Overlay ── */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={cn(
        "w-60 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen z-40 shadow-sm transition-transform duration-300 ease-in-out",
        // Desktop: siempre visible
        "lg:translate-x-0",
        // Mobile: deslizable
        isMobileMenuOpen ? "fixed translate-x-0" : "fixed -translate-x-full lg:translate-x-0"
      )}>

        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-50">
          <Link href="/" className="flex flex-col items-start gap-1 group">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
                <Flower2 className="w-4 h-4 text-rose-600" />
              </div>
              <span
                className="text-gray-900 font-semibold text-base leading-none tracking-tight"
                style={{ fontFamily: "Georgia, serif", fontStyle: 'italic' }}
              >
                Janneth Acevedo
              </span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-rose-400 ml-10">
              Plantas Ornamentales
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {/* Label sección */}
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 px-3 pb-2 pt-1">
            Menú principal
          </p>

          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center transition-all',
                    isActive
                      ? 'bg-rose-100'
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  )}>
                    <item.icon className={cn(
                      'w-3.5 h-3.5',
                      isActive ? 'text-rose-600' : 'text-gray-400 group-hover:text-gray-600'
                    )} />
                  </div>
                  <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-rose-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer usuario */}
        <div className="px-3 py-4 border-t border-gray-50">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm shrink-0">
              {user?.firstName?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex flex-col overflow-hidden min-w-0">
              <span className="text-sm font-semibold text-gray-900 truncate leading-tight">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-[10px] text-gray-400 capitalize leading-tight">
                {user?.role === 'super_admin' ? 'Super Admin' : 'Administrador'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ── Contenido ── */}
      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="lg:hidden h-16" /> {/* Spacer for mobile menu button */}
        {children}
      </main>
    </div>
  );
}
