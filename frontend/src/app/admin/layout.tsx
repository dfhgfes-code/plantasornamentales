'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  Calendar, 
  Settings, 
  Users, 
  ShoppingBag,
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/productos', label: 'Productos', icon: Package },
    { href: '/admin/planes', label: 'Planes', icon: Calendar },
    { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
    { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
  ];

  if (user?.role === 'super_admin') {
    navItems.push({ href: '/admin/super', label: 'Super Admin', icon: ShieldCheck });
  }

  return (
    <div className="flex min-h-screen bg-[#fcfcfd]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen z-40">
        <div className="p-6">
          <Logo size="md" horizontal />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-rose-50 text-rose-600 shadow-sm" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-5 h-5", isActive ? "text-rose-600" : "text-gray-400 group-hover:text-gray-600")} />
                  {item.label}
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold">
              {user?.firstName?.[0] || 'A'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-gray-900 truncate">{user?.firstName}</span>
              <span className="text-xs text-gray-400 truncate">Administrador</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
