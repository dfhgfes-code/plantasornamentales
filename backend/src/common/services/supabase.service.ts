import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private readonly configService: ConfigService) {
    const url = 'https://pucdbmecnqduihflfppi.supabase.co';
    const key = this.configService.get<string>('SUPABASE_SERVICE_KEY') || 
                process.env.SUPABASE_SERVICE_KEY ||
                this.configService.get<string>('supabase.key');

    this.logger.log('--- INICIALIZANDO SUPABASE (V4 - FIX FETCH) ---');
    if (key) {
      this.supabase = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      });
      this.logger.log('✅ Cliente inicializado con fetch global');
    } else {
      this.logger.error('❌ ERROR: No se encontró SUPABASE_SERVICE_KEY');
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
