import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import axios from 'axios';


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
    const url = 'https://pucdbmecnqduihflfppi.supabase.co';
    const key = this.configService.get<string>('SUPABASE_SERVICE_KEY') || 
                process.env.SUPABASE_SERVICE_KEY ||
                this.configService.get<string>('supabase.key');

    if (!key) {
      throw new Error('Supabase no está configurado');
    }

    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const uploadUrl = `${url}/storage/v1/object/${bucket}/${fileName}`;

    this.logger.log(`Intentando subir directamente a: ${uploadUrl}`);

    try {
      const response = await axios.post(uploadUrl, file.buffer, {
        headers: {
          'Authorization': `Bearer ${key}`,
          'apikey': key,
          'Content-Type': file.mimetype,
        },
      });

      if (response.status !== 200) {
        throw new Error(`Error de Supabase: ${response.statusText}`);
      }

      const publicUrl = `${url}/storage/v1/object/public/${bucket}/${fileName}`;
      this.logger.log(`✅ ¡ÉXITO TOTAL! Imagen en: ${publicUrl}`);
      
      return publicUrl;
    } catch (error) {
      this.logger.error(`Error en subida directa: ${error.message}`);
      throw new Error(`Error al subir imagen: ${error.message}`);
    }
  }

}
