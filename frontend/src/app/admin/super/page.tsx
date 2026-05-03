'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { adminApi, settingsApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  ShieldCheck, 
  Layout, 
  Users, 
  Plus, 
  Trash2, 
  Save, 
  Image as ImageIcon, 
  Type, 
  Link as LinkIcon, 
  ToggleLeft, 
  ToggleRight,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function SuperAdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'content' | 'admins'>('content');
  
  // Settings State
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loadingSettings, setLoadingSettings] = useState(true);
  
  // Admins State
  const [admins, setAdmins] = useState<any[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'super_admin' && user?.role !== 'admin')) {
      router.push('/login');
      return;
    }
    // Note: Technically only super_admin should see this page, but I'll add a check inside
    if (user?.role !== 'super_admin') {
      router.push('/admin');
      return;
    }
    loadSettings();
    loadAdmins();
  }, [isAuthenticated, user]);

  const loadSettings = async () => {
    try {
      const res = await settingsApi.getAll();
      setSettings(res.data);
    } catch (error) {
      toast.error('Error al cargar configuraciones');
    } finally {
      setLoadingSettings(false);
    }
  };

  const loadAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const res = await adminApi.getUsers({ limit: 100 });
      // Filter only admins for this view
      const adminUsers = (res.data.data.data || []).filter((u: any) => u.role === 'admin');
      setAdmins(adminUsers);
    } catch (error) {
      toast.error('Error al cargar administradores');
    } finally {
      setLoadingAdmins(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await settingsApi.update(settings);
      toast.success('Cambios guardados con éxito 🌸');
    } catch (error) {
      toast.error('Error al guardar cambios');
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createAdmin(newAdmin);
      toast.success('Administrador creado correctamente');
      setShowCreateAdmin(false);
      setNewAdmin({ firstName: '', lastName: '', email: '', password: '', phone: '' });
      loadAdmins();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear administrador');
    }
  };

  const toggleUserActive = async (id: string) => {
    try {
      await adminApi.toggleUserActive(id);
      toast.success('Estado actualizado');
      loadAdmins();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  if (!isAuthenticated || user?.role !== 'super_admin') return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-3xl shadow-lg shadow-indigo-200">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel Super Administrador</h1>
            <p className="text-gray-500">Gestión técnica y de contenido global</p>
          </div>
        </div>

        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'content' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Layout className="w-4 h-4" /> Contenido
          </button>
          <button 
            onClick={() => setActiveTab('admins')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'admins' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Users className="w-4 h-4" /> Administradores
          </button>
        </div>
      </div>

      {activeTab === 'content' ? (
        <div className="space-y-8">
          {/* Banner de Festivos */}
          <Card className="overflow-hidden border-indigo-50">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ToggleRight className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-gray-900">Banner de Temporada (Home)</h2>
              </div>
              <button 
                onClick={() => setSettings(p => ({ ...p, home_holiday_banner_enabled: p.home_holiday_banner_enabled === 'true' ? 'false' : 'true' }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${settings.home_holiday_banner_enabled === 'true' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
              >
                {settings.home_holiday_banner_enabled === 'true' ? 'Activado' : 'Desactivado'}
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Texto del Banner</label>
                <input 
                  type="text"
                  value={settings.home_holiday_banner_text || ''}
                  onChange={(e) => setSettings(p => ({ ...p, home_holiday_banner_text: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                  placeholder="Ej: ¡Feliz Día de las Madres! 🌸"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link del botón</label>
                <input 
                  type="text"
                  value={settings.home_holiday_banner_link || ''}
                  onChange={(e) => setSettings(p => ({ ...p, home_holiday_banner_link: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                  placeholder="/tienda"
                />
              </div>
            </div>
          </Card>

          {/* Carrusel Principal */}
          <Card className="overflow-hidden border-indigo-50">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-gray-900">Carrusel Principal (Hero)</h2>
              </div>
              <Button size="sm" onClick={() => {
                const current = JSON.parse(settings.home_hero_carousel || '[]');
                current.push({ image: '', title: '', subtitle: '', buttonText: '', buttonLink: '' });
                setSettings(p => ({ ...p, home_hero_carousel: JSON.stringify(current) }));
              }}>
                <Plus className="w-4 h-4 mr-1" /> Añadir Slide
              </Button>
            </div>
            <div className="p-6 space-y-6">
              {JSON.parse(settings.home_hero_carousel || '[]').map((slide: any, idx: number) => (
                <div key={idx} className="p-6 bg-gray-50 rounded-3xl relative border border-gray-100">
                  <button 
                    onClick={() => {
                      const current = JSON.parse(settings.home_hero_carousel || '[]');
                      current.splice(idx, 1);
                      setSettings(p => ({ ...p, home_hero_carousel: JSON.stringify(current) }));
                    }}
                    className="absolute -top-2 -right-2 p-2 bg-white text-red-500 rounded-full shadow-md hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">URL Imagen</label>
                        <input 
                          type="text"
                          value={slide.image}
                          onChange={(e) => {
                            const current = JSON.parse(settings.home_hero_carousel || '[]');
                            current[idx].image = e.target.value;
                            setSettings(p => ({ ...p, home_hero_carousel: JSON.stringify(current) }));
                          }}
                          className="w-full mt-1 px-4 py-2.5 bg-white border-0 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Título</label>
                        <input 
                          type="text"
                          value={slide.title}
                          onChange={(e) => {
                            const current = JSON.parse(settings.home_hero_carousel || '[]');
                            current[idx].title = e.target.value;
                            setSettings(p => ({ ...p, home_hero_carousel: JSON.stringify(current) }));
                          }}
                          className="w-full mt-1 px-4 py-2.5 bg-white border-0 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Subtítulo</label>
                        <input 
                          type="text"
                          value={slide.subtitle}
                          onChange={(e) => {
                            const current = JSON.parse(settings.home_hero_carousel || '[]');
                            current[idx].subtitle = e.target.value;
                            setSettings(p => ({ ...p, home_hero_carousel: JSON.stringify(current) }));
                          }}
                          className="w-full mt-1 px-4 py-2.5 bg-white border-0 rounded-xl text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Texto Botón</label>
                          <input 
                            type="text"
                            value={slide.buttonText}
                            onChange={(e) => {
                              const current = JSON.parse(settings.home_hero_carousel || '[]');
                              current[idx].buttonText = e.target.value;
                              setSettings(p => ({ ...p, home_hero_carousel: JSON.stringify(current) }));
                            }}
                            className="w-full mt-1 px-4 py-2.5 bg-white border-0 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Link Botón</label>
                          <input 
                            type="text"
                            value={slide.buttonLink}
                            onChange={(e) => {
                              const current = JSON.parse(settings.home_hero_carousel || '[]');
                              current[idx].buttonLink = e.target.value;
                              setSettings(p => ({ ...p, home_hero_carousel: JSON.stringify(current) }));
                            }}
                            className="w-full mt-1 px-4 py-2.5 bg-white border-0 rounded-xl text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end sticky bottom-8">
            <Button size="lg" className="px-12 bg-indigo-600 hover:bg-indigo-700 shadow-indigo" onClick={handleSaveSettings}>
              <Save className="w-5 h-5 mr-2" /> Guardar todos los cambios
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Administradores del Sistema</h2>
            <Button onClick={() => setShowCreateAdmin(true)}>
              <UserPlus className="w-4 h-4 mr-2" /> Nuevo Administrador
            </Button>
          </div>

          {showCreateAdmin && (
            <Card className="p-8 border-indigo-100 bg-indigo-50/30">
              <h3 className="font-bold text-lg mb-6">Registrar nuevo administrador</h3>
              <form onSubmit={handleCreateAdmin} className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input 
                      required
                      value={newAdmin.firstName}
                      onChange={(e) => setNewAdmin(p => ({ ...p, firstName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-2xl border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email"
                      required
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-2xl border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                    <input 
                      required
                      value={newAdmin.lastName}
                      onChange={(e) => setNewAdmin(p => ({ ...p, lastName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-2xl border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input 
                      type="password"
                      required
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin(p => ({ ...p, password: e.target.value }))}
                      className="w-full px-4 py-3 rounded-2xl border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                  <Button variant="outline" type="button" onClick={() => setShowCreateAdmin(false)}>Cancelar</Button>
                  <Button type="submit">Crear Administrador</Button>
                </div>
              </form>
            </Card>
          )}

          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden text-black">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{admin.firstName} {admin.lastName}</p>
                      <p className="text-xs text-indigo-500 font-semibold uppercase">{admin.role}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{admin.email}</p>
                      <p className="text-xs text-gray-400">{admin.phone || 'Sin teléfono'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={admin.isActive ? 'paid' : 'cancelled'}>
                        {admin.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleUserActive(admin.id)}
                        className={`p-2 rounded-xl transition-all ${admin.isActive ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'}`}
                        title={admin.isActive ? 'Desactivar' : 'Activar'}
                      >
                        <ToggleLeft className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
