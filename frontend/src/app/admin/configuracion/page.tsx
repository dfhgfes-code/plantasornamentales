'use client';
import { useEffect, useState } from 'react';
import { settingsApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Save, Phone, Mail, MapPin, Globe, Link2, MessageCircle, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await settingsApi.getAll();
      setSettings(res.data.data || res.data || {});
    } catch (error) {
      toast.error('Error al cargar configuraciones');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsApi.update(settings);
      toast.success('Configuraciones guardadas correctamente 🌸');
    } catch (error) {
      toast.error('Error al guardar configuraciones');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando configuración...</div>;

  const sections = [
    {
      title: 'Contacto Principal',
      fields: [
        { key: 'shop_phone', label: 'Teléfono de contacto', icon: Phone, placeholder: '+57 300 123 4567' },
        { key: 'shop_email', label: 'Correo electrónico', icon: Mail, placeholder: 'hola@tienda.com' },
        { key: 'shop_address', label: 'Dirección física', icon: MapPin, placeholder: 'Bogotá, Colombia' },
      ]
    },
    {
      title: 'Redes Sociales',
      fields: [
        { key: 'shop_facebook', label: 'URL de Facebook', icon: Link2, placeholder: 'https://facebook.com/...' },
        { key: 'shop_instagram', label: 'URL de Instagram', icon: Globe, placeholder: 'https://instagram.com/...' },
        { key: 'shop_whatsapp', label: 'Número de WhatsApp (solo números)', icon: MessageCircle, placeholder: '573001234567' },
      ]
    }
  ];

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Configuración Global
          </h1>
          <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            Gestione la información pública y contactos de su marca
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
            <div className="px-8 py-6 bg-[#fcfcfd] border-b border-gray-100">
              <h2 className="font-bold text-gray-800 tracking-tight">{section.title}</h2>
            </div>
            <div className="p-8 grid gap-8">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">{field.label}</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-focus-within:bg-pink-50 group-focus-within:text-pink-500 transition-all">
                      <field.icon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={settings[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full pl-16 pr-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-pink-100 focus:border-pink-200 rounded-2xl text-sm transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={saving} size="lg" className="px-10">
            {saving ? 'Guardando...' : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
