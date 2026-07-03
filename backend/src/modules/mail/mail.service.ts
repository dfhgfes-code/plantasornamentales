import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 5000,  // 5 segundos máximo para conectar
      greetingTimeout: 5000,    // 5 segundos para saludo SMTP
      socketTimeout: 10000,     // 10 segundos para operaciones
    });
  }

  private getBaseTemplate(title: string, content: string): string {
    const year = new Date().getFullYear();
    return (
      '<!DOCTYPE html><html><head><meta charset="utf-8"><style>' +
      'body{font-family:Arial,sans-serif;background-color:#fdfaf7;color:#374151;margin:0;padding:0;}' +
      '.container{max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.05);}' +
      '.header{background:linear-gradient(135deg,#ec4899 0%,#db2777 100%);padding:40px 20px;text-align:center;color:white;}' +
      '.header h1{margin:0;font-size:28px;font-weight:normal;}' +
      '.content{padding:40px 30px;line-height:1.6;}' +
      '.footer{text-align:center;padding:20px;font-size:12px;color:#9ca3af;background:#f9fafb;border-top:1px solid #f3f4f6;}' +
      '.button{display:inline-block;padding:12px 24px;background-color:#db2777;color:white;text-decoration:none;border-radius:8px;font-weight:bold;margin-top:20px;}' +
      '</style></head><body>' +
      '<div class="container">' +
      '<div class="header"><h1>Janneth Acevedo</h1><p style="margin:5px 0 0;opacity:0.9;font-size:14px;">Boutique Floral</p></div>' +
      '<div class="content"><h2 style="color:#1f2937;margin-top:0;">' + title + '</h2>' + content + '</div>' +
      '<div class="footer">&copy; ' + year + ' Janneth Acevedo. Todos los derechos reservados.<br>Este es un correo automático, por favor no respondas a esta dirección.</div>' +
      '</div></body></html>'
    );
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const title = '¡Bienvenido a nuestra Boutique!';
    const content =
      '<p>Hola <strong>' + name + '</strong>,</p>' +
      '<p>Nos llena de alegría darte la bienvenida a <strong>Janneth Acevedo</strong>. Tu cuenta ha sido creada con éxito.</p>' +
      '<p>Explora nuestro catálogo de plantas ornamentales y arreglos florales diseñados para hacer inolvidables tus momentos especiales.</p>' +
      '<div style="text-align:center;"><a href="https://plantasornamentales-3cum.vercel.app/tienda" class="button">Descubrir Arreglos</a></div>';

    try {
      if (!process.env.SMTP_PASS) {
        this.logger.warn('SMTP_PASS is not configured. Email not sent.');
        return;
      }
      await this.transporter.sendMail({
        from: '"Janneth Acevedo" <onboarding@resend.dev>',
        to,
        subject: 'Bienvenido a Janneth Acevedo 🌹',
        html: this.getBaseTemplate(title, content),
      });
      this.logger.log('Welcome email sent to ' + to);
    } catch (error) {
      this.logger.error('Error sending welcome email', error);
    }
  }

  async sendPasswordResetEmail(to: string, name: string, token: string): Promise<void> {
    const resetLink = 'https://plantasornamentales-3cum.vercel.app/restablecer?token=' + token;
    const title = 'Recuperación de Contraseña';
    const content =
      '<p>Hola <strong>' + name + '</strong>,</p>' +
      '<p>Hemos recibido una solicitud para restablecer tu contraseña. Si fuiste tú, haz clic en el siguiente botón para crear una nueva:</p>' +
      '<div style="text-align:center;"><a href="' + resetLink + '" class="button">Restablecer Contraseña</a></div>' +
      '<p style="margin-top:30px;font-size:13px;color:#6b7280;">Si no solicitaste este cambio, puedes ignorar este correo con seguridad.</p>';

    try {
      if (!process.env.SMTP_PASS) return;
      await this.transporter.sendMail({
        from: '"Janneth Acevedo" <onboarding@resend.dev>',
        to,
        subject: 'Restablecer tu contraseña 🔒',
        html: this.getBaseTemplate(title, content),
      });
      this.logger.log('Password reset email sent to ' + to);
    } catch (error) {
      this.logger.error('Error sending password reset email', error);
    }
  }
}
