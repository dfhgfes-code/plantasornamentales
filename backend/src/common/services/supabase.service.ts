import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>('supabase.url') || process.env.SUPABASE_URL;
    const key = this.configService.get<string>('supabase.key') || process.env.SUPABASE_SERVICE_KEY;

    this.logger.log(`Supabase URL: ${url ? 'Detectada' : 'No encontrada'}`);
    this.logger.log(`Supabase Key: ${key ? 'Detectada' : 'No encontrada'}`);

    if (url && key) {
      this.supabase = createClient(url, key);
      this.logger.log('✅ Supabase client initialized');
    } else {
      this.logger.error('❌ Supabase configuration missing in production environment');
    }
  }


  async uploadFile(file: Express.Multer.File, bucket: string = 'flowers') {
    if (!this.supabase) {
      throw new Error('Supabase no está configurado');
    }

    const fileExt = file.originalname.split('.').pop();
    const fileName = `product-${Date.now()}-${Math.round(Math.random() * 1e6)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      this.logger.error(`Error uploading to Supabase: ${error.message}`);
      throw error;
    }

    const { data: { publicUrl } } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      fileName: filePath,
    };
  }
}
