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
      setSettings(res.data);
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
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-rose-100 rounded-2xl">
          <SettingsIcon className="w-6 h-6 text-rose-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración de Tienda</h1>
          <p className="text-gray-500 text-sm">Gestiona la información pública que ven tus clientes</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-3xl shadow-card border border-rose-50 overflow-hidden">
            <div className="px-6 py-4 bg-rose-50/30 border-b border-rose-50">
              <h2 className="font-semibold text-gray-800">{section.title}</h2>
            </div>
            <div className="p-6 grid gap-6">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                  <div className="relative">
                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={settings[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-300 rounded-2xl text-sm transition-all"
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
