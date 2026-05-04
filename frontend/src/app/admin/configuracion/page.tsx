'use client';
import { useEffect, useState } from 'react';
import { settingsApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Save, Phone, Mail, MapPin, Facebook, Instagram, MessageCircle, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const res = await settingsApi.getAll();
      setSettings(res.data.data || res.data || {});
    } catch {
      toast.error('Error al cargar configuraciones');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsApi.update(settings);
      await loadSettings();
      setSaved(true);
      toast.success('Configuraciones guardadas ✓');
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-pink-300 border-t-pink-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">Cargando configuración...</p>
      </div>
    </div>
  );

  const sections = [
    {
      id: 'contact',
      title: 'Contacto Principal',
      subtitle: 'Información pública de contacto de la tienda',
      gradient: 'from-rose-50 to-pink-50',
      border: 'border-rose-100',
      iconBg: 'bg-rose-100 text-rose-600',
      fields: [
        { key: 'shop_phone', label: 'Teléfono', icon: Phone, placeholder: '+57 300 123 4567', type: 'tel' },
        { key: 'shop_email', label: 'Correo electrónico', icon: Mail, placeholder: 'hola@jannethplants.co', type: 'email' },
        { key: 'shop_address', label: 'Dirección física', icon: MapPin, placeholder: 'Bogotá, Colombia', type: 'text' },
      ]
    },
    {
      id: 'social',
      title: 'Redes Sociales',
      subtitle: 'Links y contacto en plataformas sociales',
      gradient: 'from-purple-50 to-indigo-50',
      border: 'border-purple-100',
      iconBg: 'bg-purple-100 text-purple-600',
      fields: [
        { key: 'shop_facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/jannethplants', type: 'url' },
        { key: 'shop_instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/jannethplants', type: 'url' },
        { key: 'shop_whatsapp', label: 'WhatsApp (solo números con código de país)', icon: MessageCircle, placeholder: '573001234567', type: 'tel' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-6 lg:p-10 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                Configuración Global
              </h1>
              <p className="text-gray-400 text-sm mt-1">Administra la información pública y de contacto de la boutique</p>
            </div>
            <button
              form="settings-form"
              type="submit"
              disabled={saving}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-sm
                ${saved
                  ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-md'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 hover:shadow-md active:scale-95'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Guardando...
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Guardado
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sections */}
        <form id="settings-form" onSubmit={handleSave} className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className={`bg-white rounded-3xl border ${section.border} overflow-hidden shadow-sm`}>
              {/* Section Header */}
              <div className={`bg-gradient-to-r ${section.gradient} px-8 py-5 border-b ${section.border}`}>
                <h2 className="font-bold text-gray-800 text-base">{section.title}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{section.subtitle}</p>
              </div>

              {/* Fields */}
              <div className="p-6 lg:p-8 grid grid-cols-1 gap-5">
                {section.fields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.key} className="group">
                      <label className="block text-xs font-semibold text-gray-500 mb-2 tracking-wide uppercase">
                        {field.label}
                      </label>
                      <div className="relative">
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${section.iconBg} opacity-70 group-focus-within:opacity-100`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <input
                          type={field.type}
                          value={settings[field.key] || ''}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full pl-[3.75rem] pr-5 py-3.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 rounded-2xl text-sm text-gray-800 placeholder:text-gray-300 transition-all outline-none"
                        />
                        {settings[field.key] && (
                          <span className="absolute right-4 top-1/2 -translate-y-1/2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </form>
      </div>
    </div>
  );
}
