import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private readonly configService: ConfigService) {
    // La URL de Supabase es pública para tu proyecto, la ponemos fija para evitar errores de carga
    const url = 'https://pucdbmecnqduihflfppi.supabase.co';
    const key = this.configService.get<string>('supabase.key') || 
                this.configService.get<string>('SUPABASE_SERVICE_KEY') || 
                process.env.SUPABASE_SERVICE_KEY;

    this.logger.log('--- INICIALIZANDO SUPABASE ---');
    this.logger.log(`URL: ${url}`);
    this.logger.log(`Key Detectada: ${key ? 'SÍ' : 'NO'}`);

    if (url && key) {
      this.supabase = createClient(url, key);
      this.logger.log('✅ Cliente de Supabase inicializado correctamente');
    } else {
      this.logger.error('❌ CRÍTICO: No se detectó la SUPABASE_SERVICE_KEY en Railway');
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
