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
    const defaultSettings = {
      shop_phone: '+57 300 123 4567',
      shop_email: 'hola@jannethplants.co',
      shop_address: 'Bogotá, Colombia',
      shop_facebook: 'https://facebook.com/jannethplants',
      shop_instagram: 'https://instagram.com/jannethplants',
      shop_whatsapp: '573001234567',
    };

    const count = await this.settingsRepository.count();
    if (count === 0) {
      for (const [key, value] of Object.entries(defaultSettings)) {
        await this.settingsRepository.save(this.settingsRepository.create({ key, value }));
      }
    }
  }
}
