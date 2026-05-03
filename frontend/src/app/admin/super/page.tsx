'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { adminApi, settingsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import { ShieldCheck, Layout, Users, Globe, BarChart2, Save, Plus, Trash2, Image as Img, ToggleLeft, ToggleRight, UserPlus, TrendingUp, TrendingDown, DollarSign, ShoppingBag, Phone, Mail, MapPin, MessageCircle, Link2, Wrench, Bell, Smile } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

type Tab = 'analytics' | 'content' | 'config' | 'admins';

export default function SuperAdminPage() {
  const { authorized, user } = useAuthGuard(['super_admin']);
  const { user: storeUser } = useAuthStore();
  const [tab, setTab] = useState<Tab>('analytics');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ firstName: '', lastName: '', email: '', password: '' });

  useEffect(() => {
    if (!authorized) return;
    loadAll();
  }, [authorized]);

  const loadAll = async () => {
    try {
      const [sRes, aRes, anRes] = await Promise.allSettled([
        settingsApi.getAll(),
        adminApi.getUsers({ limit: 100 }),
        adminApi.getSuperAnalytics(),
      ]);
      if (sRes.status === 'fulfilled') setSettings(sRes.value.data);
      if (aRes.status === 'fulfilled') setAdmins((aRes.value.data.data?.data || []).filter((u: any) => u.role === 'admin'));
      if (anRes.status === 'fulfilled') setAnalytics(anRes.value.data.data);
    } finally { setLoading(false); }
  };

  const save = async () => {
    const id = toast.loading('Guardando cambios...');
    try {
      await settingsApi.update(settings);
      toast.success('¡Guardado correctamente! Aplicando cambios...', { id });
      // Reload after 1.5s so Footer/Navbar/Popup pick up the new values
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error desconocido';
      toast.error(`Error al guardar: ${msg}`, { id });
      console.error('[SuperAdmin save]', err?.response?.data || err);
    }
  };

  const createAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createAdmin(newAdmin);
      toast.success('Administrador creado');
      setShowCreate(false);
      setNewAdmin({ firstName: '', lastName: '', email: '', password: '' });
      loadAll();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const setSetting = (k: string, v: string) => setSettings(p => ({ ...p, [k]: v }));

  const toggleSetting = (k: string) => setSetting(k, settings[k] === 'true' ? 'false' : 'true');

  const getCarousel = () => { try { return JSON.parse(settings.home_hero_carousel || '[]'); } catch { return []; } };
  const setCarousel = (arr: any[]) => setSetting('home_hero_carousel', JSON.stringify(arr));

  if (!authorized) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'analytics', label: 'Analíticas', icon: BarChart2 },
    { id: 'content', label: 'Contenido', icon: Layout },
    { id: 'config', label: 'Contacto & Popup', icon: Globe },
    { id: 'admins', label: 'Equipo', icon: Users },
  ];

  const pct = analytics ? (analytics.summary.lastMonthRevenue > 0
    ? ((analytics.summary.thisMonthRevenue - analytics.summary.lastMonthRevenue) / analytics.summary.lastMonthRevenue * 100).toFixed(1)
    : 100) : 0;
  const up = Number(pct) >= 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-600 font-bold text-xs tracking-widest uppercase">Super Admin</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900">Control del Sitio</h1>
        </div>
        <nav className="flex bg-gray-100 p-1 rounded-2xl gap-1 flex-wrap">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${tab === t.id ? 'bg-white text-indigo-600 shadow' : 'text-gray-500 hover:text-gray-800'}`}>
              <t.icon className="w-3.5 h-3.5" />{t.label}
            </button>
          ))}
        </nav>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-3xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-10">

          {/* ANALYTICS */}
          {tab === 'analytics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Ingresos Totales', value: formatCurrency(analytics?.summary.totalRevenue || 0), icon: DollarSign, color: 'bg-green-50 text-green-600' },
                  { label: 'Este Mes', value: formatCurrency(analytics?.summary.thisMonthRevenue || 0), icon: up ? TrendingUp : TrendingDown, color: up ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-600', sub: `${up ? '+' : ''}${pct}% vs mes ant.` },
                  { label: 'Pedidos', value: analytics?.summary.totalOrders || 0, icon: ShoppingBag, color: 'bg-orange-50 text-orange-600' },
                  { label: 'Suscripciones', value: analytics?.summary.activeSubscriptions || 0, icon: TrendingUp, color: 'bg-pink-50 text-pink-600' },
                ].map(s => (
                  <Card key={s.label} className="p-5">
                    <div className={`inline-flex p-2 rounded-xl ${s.color} mb-3`}><s.icon className="w-4 h-4" /></div>
                    <p className="text-2xl font-black text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                    {s.sub && <p className={`text-[10px] font-bold mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{s.sub}</p>}
                  </Card>
                ))}
              </div>

              <Card className="p-6">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-indigo-500" /> Ingresos últimos 30 días</h3>
                {analytics?.revenueByDay?.length > 0 ? (
                  <div className="flex items-end gap-1 h-32 overflow-x-auto pb-2">
                    {(() => {
                      const max = Math.max(...analytics.revenueByDay.map((d: any) => Number(d.total)));
                      return analytics.revenueByDay.map((d: any, i: number) => (
                        <div key={i} className="flex flex-col items-center gap-1 min-w-[28px] group">
                          <div className="relative w-5 bg-indigo-500 rounded-t-md hover:bg-indigo-600 transition-all cursor-pointer"
                            style={{ height: `${max > 0 ? (Number(d.total) / max) * 100 : 4}%`, minHeight: 4 }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10">
                              {formatCurrency(Number(d.total))}
                            </div>
                          </div>
                          <span className="text-[8px] text-gray-400 rotate-45 origin-left">{d.day}</span>
                        </div>
                      ));
                    })()}
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-gray-400 text-sm">Sin datos de ventas aún</div>
                )}
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Suscripciones por Estado</h3>
                  <div className="space-y-3">
                    {analytics?.subscriptionStats?.length > 0 ? analytics.subscriptionStats.map((s: any) => (
                      <div key={s.status} className="flex items-center justify-between">
                        <Badge status={s.status}>{s.status}</Badge>
                        <span className="font-bold text-gray-900">{s.count}</span>
                      </div>
                    )) : <p className="text-sm text-gray-400">Sin suscripciones aún</p>}
                  </div>
                </Card>
                <Card className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Nuevos Usuarios (4 semanas)</h3>
                  <div className="space-y-3">
                    {analytics?.newUsersPerWeek?.length > 0 ? analytics.newUsersPerWeek.map((w: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Semana {w.week}</span>
                        <span className="font-bold text-indigo-600">{w.count} usuarios</span>
                      </div>
                    )) : <p className="text-sm text-gray-400">Sin datos aún</p>}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* CONTENIDO */}
          {tab === 'content' && (
            <div className="space-y-8">
              {/* Banner Temporada */}
              <section>
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-indigo-500" /> Banner de Temporada</h3>
                <Card className="p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Mostrar en la página principal</span>
                    <button onClick={() => toggleSetting('home_holiday_banner_enabled')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${settings.home_holiday_banner_enabled === 'true' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                      {settings.home_holiday_banner_enabled === 'true' ? <><ToggleRight className="w-4 h-4" /> Activo</> : <><ToggleLeft className="w-4 h-4" /> Inactivo</>}
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Texto del Banner</label>
                      <input value={settings.home_holiday_banner_text || ''} onChange={e => setSetting('home_holiday_banner_text', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm border-0 focus:ring-2 focus:ring-indigo-200" placeholder="¡Oferta especial! 🌸" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Enlace</label>
                      <input value={settings.home_holiday_banner_link || ''} onChange={e => setSetting('home_holiday_banner_link', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm border-0 focus:ring-2 focus:ring-indigo-200" placeholder="/tienda" />
                    </div>
                  </div>
                </Card>
              </section>

              {/* Modo Mantenimiento */}
              <section>
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2"><Wrench className="w-5 h-5 text-orange-500" /> Modo Mantenimiento</h3>
                <Card className="p-6 space-y-4 border-orange-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Poner sitio en mantenimiento</p>
                      <p className="text-xs text-gray-400">Los visitantes verán una pantalla de "Próximamente". Tú seguirás teniendo acceso.</p>
                    </div>
                    <button onClick={() => toggleSetting('maintenance_mode')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${settings.maintenance_mode === 'true' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                      {settings.maintenance_mode === 'true' ? <><ToggleRight className="w-4 h-4" /> ACTIVO</> : <><ToggleLeft className="w-4 h-4" /> Desactivado</>}
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Título</label>
                      <input value={settings.maintenance_title || ''} onChange={e => setSetting('maintenance_title', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm border-0" placeholder="Estamos renovando nuestro jardín 🌱" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Fecha de Regreso</label>
                      <input value={settings.maintenance_eta || ''} onChange={e => setSetting('maintenance_eta', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm border-0" placeholder="Ej: Lunes 6 de mayo" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Mensaje</label>
                      <input value={settings.maintenance_subtitle || ''} onChange={e => setSetting('maintenance_subtitle', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm border-0" placeholder="Volvemos muy pronto con novedades hermosas." />
                    </div>
                  </div>
                </Card>
              </section>

              {/* Carrusel */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2"><Img className="w-5 h-5 text-indigo-500" /> Carrusel Principal</h3>
                  <Button variant="outline" size="sm" onClick={() => {
                    const arr = getCarousel();
                    arr.push({ image: '', title: '', subtitle: '', buttonText: 'Ver catálogo', buttonLink: '/tienda' });
                    setCarousel(arr);
                  }}><Plus className="w-4 h-4 mr-1" /> Slide</Button>
                </div>
                <div className="space-y-4">
                  {getCarousel().map((slide: any, idx: number) => (
                    <Card key={idx} className="p-6">
                      <div className="flex justify-end mb-3">
                        <button onClick={() => { if (confirm('¿Eliminar?')) { const a = getCarousel(); a.splice(idx, 1); setCarousel(a); } }}
                          className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { k: 'image', label: 'URL Imagen', placeholder: 'https://...' },
                          { k: 'title', label: 'Título', placeholder: 'Flores frescas para ti' },
                          { k: 'subtitle', label: 'Subtítulo', placeholder: 'Descripción breve' },
                          { k: 'buttonText', label: 'Texto Botón', placeholder: 'Ver catálogo' },
                          { k: 'buttonLink', label: 'Link Botón', placeholder: '/tienda' },
                        ].map(f => (
                          <div key={f.k}>
                            <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">{f.label}</label>
                            <input value={slide[f.k] || ''} onChange={e => { const a = getCarousel(); a[idx][f.k] = e.target.value; setCarousel(a); }}
                              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm border-0" placeholder={f.placeholder} />
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* CONTACTO & POPUP */}
          {tab === 'config' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <section className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2"><Phone className="w-5 h-5 text-indigo-500" /> Datos de Contacto</h3>
                  <Card className="p-6 space-y-4">
                    {[
                      { k: 'shop_phone', label: 'Teléfono', icon: Phone, ph: '+57 300 000 0000' },
                      { k: 'shop_email', label: 'Email', icon: Mail, ph: 'hola@tienda.com' },
                      { k: 'shop_address', label: 'Dirección', icon: MapPin, ph: 'Bogotá, Colombia' },
                      { k: 'shop_whatsapp', label: 'WhatsApp (solo números)', icon: MessageCircle, ph: '573000000000' },
                      { k: 'shop_instagram', label: 'Instagram URL', icon: Globe, ph: 'https://instagram.com/...' },
                      { k: 'shop_facebook', label: 'Facebook URL', icon: Link2, ph: 'https://facebook.com/...' },
                    ].map(f => (
                      <div key={f.k}>
                        <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">{f.label}</label>
                        <div className="relative">
                          <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                          <input value={settings[f.k] || ''} onChange={e => setSetting(f.k, e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-2xl text-sm border-0 focus:ring-2 focus:ring-indigo-100" placeholder={f.ph} />
                        </div>
                      </div>
                    ))}
                  </Card>
                </section>

                <section className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2"><Smile className="w-5 h-5 text-pink-500" /> Popup de Bienvenida</h3>
                  <Card className="p-6 space-y-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Mostrar popup al entrar</span>
                      <button onClick={() => toggleSetting('popup_enabled')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${settings.popup_enabled !== 'false' ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                        {settings.popup_enabled !== 'false' ? <><ToggleRight className="w-4 h-4" /> Activo</> : <><ToggleLeft className="w-4 h-4" /> Inactivo</>}
                      </button>
                    </div>
                    {[
                      { k: 'popup_title', label: 'Título', ph: '¡Bienvenida a nuestra familia floral!' },
                      { k: 'popup_subtitle', label: 'Subtítulo', ph: 'Únete y obtén 10% de descuento' },
                      { k: 'popup_discount_label', label: 'Etiqueta de Descuento', ph: '10% en tu primera compra' },
                      { k: 'popup_cta_text', label: 'Texto del Botón', ph: 'Quiero unirme ahora' },
                      { k: 'popup_cta_link', label: 'Link del Botón', ph: '/registro' },
                    ].map(f => (
                      <div key={f.k}>
                        <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">{f.label}</label>
                        <input value={settings[f.k] || ''} onChange={e => setSetting(f.k, e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 rounded-2xl text-sm border-0" placeholder={f.ph} />
                      </div>
                    ))}
                  </Card>
                </section>
              </div>
            </div>
          )}

          {/* EQUIPO ADMIN */}
          {tab === 'admins' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Equipo Administrativo</h2>
                <Button onClick={() => setShowCreate(true)} className="bg-indigo-600 hover:bg-indigo-700">
                  <UserPlus className="w-4 h-4 mr-2" /> Crear Acceso
                </Button>
              </div>

              {showCreate && (
                <Card className="p-8 border-indigo-100 bg-indigo-50/20 rounded-3xl">
                  <h3 className="font-bold text-lg mb-6">Nuevo Administrador</h3>
                  <form onSubmit={createAdmin} className="grid md:grid-cols-2 gap-4">
                    {[
                      { k: 'firstName', ph: 'Nombre' }, { k: 'lastName', ph: 'Apellido' },
                      { k: 'email', ph: 'Email', type: 'email' }, { k: 'password', ph: 'Contraseña', type: 'password' },
                    ].map(f => (
                      <input key={f.k} required type={f.type || 'text'} placeholder={f.ph}
                        value={(newAdmin as any)[f.k]} onChange={e => setNewAdmin(p => ({ ...p, [f.k]: e.target.value }))}
                        className="px-5 py-3 rounded-2xl bg-white border border-gray-200 text-sm" />
                    ))}
                    <div className="md:col-span-2 flex justify-end gap-3">
                      <Button variant="outline" type="button" onClick={() => setShowCreate(false)}>Cancelar</Button>
                      <Button type="submit">Guardar</Button>
                    </div>
                  </form>
                </Card>
              )}

              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                      <th className="px-6 py-4">Nombre</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4 text-center">Estado</th>
                      <th className="px-6 py-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {admins.length === 0 && (
                      <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400">No hay administradores aún</td></tr>
                    )}
                    {admins.map((a: any) => (
                      <tr key={a.id} className="hover:bg-indigo-50/20 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{a.firstName} {a.lastName}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{a.email}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge status={a.isActive ? 'paid' : 'cancelled'}>
                            {a.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={async () => { await adminApi.toggleUserActive(a.id); loadAll(); }}
                            className={`p-2.5 rounded-xl transition-all ${a.isActive ? 'text-gray-300 hover:text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'}`}>
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

          {/* Botón Guardar (no en analytics ni admins) */}
          {(tab === 'content' || tab === 'config') && (
            <div className="sticky bottom-8 flex justify-center">
              <Button size="lg" onClick={save}
                className="px-16 py-4 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 font-black uppercase tracking-widest rounded-2xl">
                <Save className="w-5 h-5 mr-3" /> Guardar Todo
              </Button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
