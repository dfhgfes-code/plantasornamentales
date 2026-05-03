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
  UserPlus,
  Globe,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Link2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function SuperAdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'content' | 'config' | 'admins'>('content');
  
  // Settings State
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loadingSettings, setLoadingSettings] = useState(true);
  
  // Admins State
  const [admins, setAdmins] = useState<any[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user?.role !== 'super_admin') { router.push('/admin'); return; }
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
      toast.success('¡Cambios guardados! Recargando para aplicar cambios visuales... 🌸');
      setTimeout(() => window.location.reload(), 1500);
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
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* HEADER SIMPLIFICADO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase">Super Admin Panel</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Gestión del Sitio</h1>
        </div>

        <nav className="flex bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-200">
          {[
            { id: 'content', label: 'Home & Banners', icon: Layout },
            { id: 'config', label: 'Contacto & Redes', icon: Globe },
            { id: 'admins', label: 'Equipo Admin', icon: Users },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <tab.icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {loadingSettings ? (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <div className="w-12 h-12 bg-indigo-100 rounded-full mb-4" />
          <div className="h-4 bg-indigo-50 rounded w-48" />
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* TAB: HOME & BANNERS */}
          {activeTab === 'content' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                  Banner de Temporada
                </h3>
                <Card className="p-6 border-indigo-50/50 bg-indigo-50/5 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-1 w-full space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Texto del Anuncio</label>
                          <input 
                            type="text"
                            value={settings.home_holiday_banner_text || ''}
                            onChange={(e) => setSettings(p => ({ ...p, home_holiday_banner_text: e.target.value }))}
                            className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-100 transition-all text-sm shadow-sm"
                            placeholder="Ej: ¡10% OFF por el Día del Padre! 🎁"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Enlace (Ruta)</label>
                          <input 
                            type="text"
                            value={settings.home_holiday_banner_link || ''}
                            onChange={(e) => setSettings(p => ({ ...p, home_holiday_banner_link: e.target.value }))}
                            className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-100 transition-all text-sm shadow-sm"
                            placeholder="/tienda"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 pt-5">
                      <button 
                        onClick={() => setSettings(p => ({ ...p, home_holiday_banner_enabled: p.home_holiday_banner_enabled === 'true' ? 'false' : 'true' }))}
                        className={`group flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${settings.home_holiday_banner_enabled === 'true' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}
                      >
                        {settings.home_holiday_banner_enabled === 'true' ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        {settings.home_holiday_banner_enabled === 'true' ? 'Visible ahora' : 'Oculto'}
                      </button>
                    </div>
                  </div>
                </Card>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                    Carrusel Principal (Hero)
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => {
                    const current = JSON.parse(settings.home_hero_carousel || '[]');
                    current.push({ image: '', title: '', subtitle: '', buttonText: 'Ver catálogo', buttonLink: '/tienda' });
                    setSettings(p => ({ ...p, home_hero_carousel: JSON.stringify(current) }));
                  }}>
                    <Plus className="w-4 h-4 mr-1" /> Añadir Slide
                  </Button>
                </div>
                
                <div className="grid gap-6">
                  {JSON.parse(settings.home_hero_carousel || '[]').map((slide: any, idx: number) => (
                    <div key={idx} className="bg-white border border-gray-100 rounded-[2rem] p-8 relative shadow-sm hover:shadow-md transition-shadow">
                      <button 
                        onClick={() => {
                          if (confirm('¿Eliminar este slide?')) {
                            const current = JSON.parse(settings.home_hero_carousel || '[]');
                            current.splice(idx, 1);
                            setSettings(p => ({ ...p, home_hero_carousel: JSON.stringify(current) }));
                          }
                        }}
                        className="absolute top-4 right-4 p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      
                      <div className="grid lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-4 space-y-4">
                          <div className="aspect-video rounded-2xl bg-gray-100 overflow-hidden relative border border-gray-200">
                            {slide.image ? (
                              <img src={slide.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                <ImageIcon className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase">URL de la Imagen</label>
                            <input 
                              type="text"
                              value={slide.image}
                              onChange={(e) => {
                                const current = JSON.parse(settings.home_hero_carousel || '[]');
                                current[idx].image = e.target.value;
                                setSettings(p => ({ ...p, home_hero_carousel: JSON.stringify(current) }));
                              }}
                              className="w-full px-4 py-2 bg-gray-50 border-0 rounded-xl text-xs"
                              placeholder="https://..."
                            />
                          </div>
                        </div>

                        <div className="lg:col-span-8 grid gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase">Título Destacado</label>
                            <input 
                              type="text"
                              value={slide.title}
                              onChange={(e) => {
                                const current = JSON.parse(settings.home_hero_carousel || '[]');
                                current[idx].title = e.target.value;
                                setSettings(p => ({ ...p, home_hero_carousel: JSON.stringify(current) }));
                              }}
                              className="w-full px-5 py-3 bg-gray-50 border-0 rounded-2xl text-base font-bold"
                              placeholder="Ej: Flores frescas a domicilio"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase">Subtítulo / Descripción</label>
                            <textarea 
                              value={slide.subtitle}
                              rows={2}
                              onChange={(e) => {
                                const current = JSON.parse(settings.home_hero_carousel || '[]');
                                current[idx].subtitle = e.target.value;
                                setSettings(p => ({ ...p, home_hero_carousel: JSON.stringify(current) }));
                              }}
                              className="w-full px-5 py-3 bg-gray-50 border-0 rounded-2xl text-sm"
                              placeholder="Explica brevemente lo que ofreces..."
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-gray-400 uppercase">Texto Botón</label>
                              <input 
                                type="text"
                                value={slide.buttonText}
                                onChange={(e) => {
                                  const current = JSON.parse(settings.home_hero_carousel || '[]');
                                  current[idx].buttonText = e.target.value;
                                  setSettings(p => ({ ...p, home_hero_carousel: JSON.stringify(current) }));
                                }}
                                className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-gray-400 uppercase">Link Botón</label>
                              <input 
                                type="text"
                                value={slide.buttonLink}
                                onChange={(e) => {
                                  const current = JSON.parse(settings.home_hero_carousel || '[]');
                                  current[idx].buttonLink = e.target.value;
                                  setSettings(p => ({ ...p, home_hero_carousel: JSON.stringify(current) }));
                                }}
                                className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TAB: CONTACTO & REDES (Integrado) */}
          {activeTab === 'config' && (
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-500">
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-indigo-600" /> Datos de Contacto
                </h3>
                <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-5 shadow-sm">
                  {[
                    { key: 'shop_phone', label: 'Teléfono', icon: Phone, placeholder: '+57 300 000 0000' },
                    { key: 'shop_email', label: 'Email', icon: Mail, placeholder: 'hola@tienda.com' },
                    { key: 'shop_address', label: 'Dirección', icon: MapPin, placeholder: 'Bogotá, Colombia' },
                  ].map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">{field.label}</label>
                      <div className="relative">
                        <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input 
                          type="text"
                          value={settings[field.key] || ''}
                          onChange={(e) => setSettings(p => ({ ...p, [field.key]: e.target.value }))}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                          placeholder={field.placeholder}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-600" /> Redes Sociales
                </h3>
                <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-5 shadow-sm">
                  {[
                    { key: 'shop_whatsapp', label: 'WhatsApp (Solo números)', icon: MessageCircle, placeholder: '573000000000' },
                    { key: 'shop_instagram', label: 'Instagram URL', icon: Globe, placeholder: 'https://instagram.com/...' },
                    { key: 'shop_facebook', label: 'Facebook URL', icon: Link2, placeholder: 'https://facebook.com/...' },
                  ].map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">{field.label}</label>
                      <div className="relative">
                        <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input 
                          type="text"
                          value={settings[field.key] || ''}
                          onChange={(e) => setSettings(p => ({ ...p, [field.key]: e.target.value }))}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                          placeholder={field.placeholder}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TAB: ADMINS */}
          {activeTab === 'admins' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Equipo Administrativo</h2>
                <Button onClick={() => setShowCreateAdmin(true)} className="bg-indigo-600 hover:bg-indigo-700">
                  <UserPlus className="w-4 h-4 mr-2" /> Crear Acceso
                </Button>
              </div>

              {showCreateAdmin && (
                <Card className="p-8 border-indigo-100 bg-indigo-50/20 rounded-[2rem]">
                  <h3 className="font-bold text-lg mb-6">Nuevo Administrador</h3>
                  <form onSubmit={handleCreateAdmin} className="grid md:grid-cols-2 gap-6">
                    <input required value={newAdmin.firstName} onChange={(e) => setNewAdmin(p => ({ ...p, firstName: e.target.value }))} className="w-full px-5 py-3 rounded-2xl bg-white border border-gray-200" placeholder="Nombre" />
                    <input required value={newAdmin.lastName} onChange={(e) => setNewAdmin(p => ({ ...p, lastName: e.target.value }))} className="w-full px-5 py-3 rounded-2xl bg-white border border-gray-200" placeholder="Apellido" />
                    <input type="email" required value={newAdmin.email} onChange={(e) => setNewAdmin(p => ({ ...p, email: e.target.value }))} className="w-full px-5 py-3 rounded-2xl bg-white border border-gray-200" placeholder="Email" />
                    <input type="password" required value={newAdmin.password} onChange={(e) => setNewAdmin(p => ({ ...p, password: e.target.value }))} className="w-full px-5 py-3 rounded-2xl bg-white border border-gray-200" placeholder="Contraseña" />
                    <div className="md:col-span-2 flex justify-end gap-3">
                      <Button variant="outline" type="button" onClick={() => setShowCreateAdmin(false)}>Cancelar</Button>
                      <Button type="submit">Guardar Administrador</Button>
                    </div>
                  </form>
                </Card>
              )}

              <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                      <th className="px-8 py-5">Colaborador</th>
                      <th className="px-8 py-5">Contacto</th>
                      <th className="px-8 py-5 text-center">Estado</th>
                      <th className="px-8 py-5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {admins.map((admin) => (
                      <tr key={admin.id} className="group hover:bg-indigo-50/30 transition-all">
                        <td className="px-8 py-5">
                          <p className="font-bold text-gray-900">{admin.firstName} {admin.lastName}</p>
                          <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-lg font-black uppercase">{admin.role}</span>
                        </td>
                        <td className="px-8 py-5 text-sm text-gray-500 font-medium">{admin.email}</td>
                        <td className="px-8 py-5 text-center">
                          <Badge status={admin.isActive ? 'paid' : 'cancelled'}>
                            {admin.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => toggleUserActive(admin.id)}
                            className={`p-2.5 rounded-xl transition-all ${admin.isActive ? 'text-gray-300 hover:text-orange-500 hover:bg-white shadow-sm' : 'text-green-500 hover:bg-green-50'}`}
                          >
                            <ToggleLeft className="w-6 h-6" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BARRA DE GUARDADO GLOBAL */}
          <div className="sticky bottom-8 z-20 flex justify-center">
            <Button size="lg" className="px-16 py-7 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-300 transform active:scale-95 transition-all text-base font-black uppercase tracking-widest" onClick={handleSaveSettings}>
              <Save className="w-5 h-5 mr-3" /> Guardar Todo
            </Button>
          </div>

        </div>
      )}
    </div>
  );
}
