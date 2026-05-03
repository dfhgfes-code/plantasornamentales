import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(Setting)
    private readonly settingsRepository: Repository<Setting>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async findAll() {
    const settings = await this.settingsRepository.find();
    return settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  }

  async findOne(key: string) {
    return this.settingsRepository.findOne({ where: { key } });
  }

  async updateMany(settings: Record<string, string>) {
    for (const [key, value] of Object.entries(settings)) {
      let setting = await this.findOne(key);
      if (setting) {
        setting.value = value;
        await this.settingsRepository.save(setting);
      } else {
        setting = this.settingsRepository.create({ key, value });
        await this.settingsRepository.save(setting);
      }
    }
    return this.findAll();
  }

  private async seed() {
    const defaultSettings: Record<string, string> = {
      // ── Datos de contacto ──────────────────────────────────────
      shop_phone: '+57 300 123 4567',
      shop_email: 'hola@jannethplants.co',
      shop_address: 'Bogotá, Colombia',
      shop_facebook: 'https://facebook.com/jannethplants',
      shop_instagram: 'https://instagram.com/jannethplants',
      shop_whatsapp: '573001234567',

      // ── Carrusel Hero ─────────────────────────────────────────
      home_hero_carousel: JSON.stringify([
        {
          image: '/hero/field.png',
          title: 'Flores frescas para momentos inolvidables',
          subtitle: 'Enviamos amor en cada ramo a todo el país',
          buttonText: 'Ver Colección',
          buttonLink: '/tienda',
        },
        {
          image: '/hero/artisan.png',
          title: 'Suscripciones Florales',
          subtitle: 'Recibe la frescura del campo cada semana en tu puerta',
          buttonText: 'Ver Planes',
          buttonLink: '/planes',
        },
      ]),

      // ── Marquesina de texto ───────────────────────────────────
      home_promo_marquee: JSON.stringify([
        '🌸 Flores frescas garantizadas',
        '🚚 Envío a domicilio',
        '🔄 Suscripciones flexibles',
        '⭐ +500 clientes felices',
        '❌ Cancela cuando quieras',
        '💝 Arreglos hechos a mano',
        '🌷 Entrega el mismo día',
      ]),

      // ── Banner de temporada ───────────────────────────────────
      home_holiday_banner_enabled: 'false',
      home_holiday_banner_text: '¡Feliz Día de la Madre! Sorpréndela con un detalle especial. 🌸',
      home_holiday_banner_link: '/tienda',

      // ── Popup de bienvenida ───────────────────────────────────
      popup_enabled: 'true',
      popup_title: '¡Bienvenida a nuestra familia floral!',
      popup_subtitle: 'Únete y obtén 10% de descuento en tu primer pedido',
      popup_discount_label: '10% en tu primera compra',
      popup_cta_text: 'Quiero unirme ahora',
      popup_cta_link: '/registro',

      // ── Modo mantenimiento ────────────────────────────────────
      maintenance_mode: 'false',
      maintenance_title: 'Estamos renovando nuestro jardín 🌱',
      maintenance_subtitle: 'Volvemos muy pronto con novedades hermosas.',
      maintenance_eta: '',
    };

    for (const [key, value] of Object.entries(defaultSettings)) {
      const exists = await this.settingsRepository.findOne({ where: { key } });
      if (!exists) {
        await this.settingsRepository.save(
          this.settingsRepository.create({ key, value }),
        );
      }
    }
  }
}
