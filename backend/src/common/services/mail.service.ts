import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async sendOrderConfirmation(email: string, orderData: any) {
    this.logger.log(`📧 Enviando confirmación de pedido a: ${email}`);
    // Simulación de envío de correo con HTML premium
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #be185d; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">¡Gracias por tu compra! 🌸</h1>
        </div>
        <div style="padding: 30px; color: #333;">
          <p>Hola, <strong>${orderData.user.name}</strong>,</p>
          <p>Tu pedido <strong>#${orderData.orderNumber}</strong> ha sido recibido exitosamente y estamos preparando tus flores con mucho amor.</p>
          
          <div style="background: #fff5f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #be185d; margin-top: 0;">Resumen del pedido:</h3>
            <p style="margin: 5px 0;">Total: $${orderData.total.toLocaleString()}</p>
            <p style="margin: 5px 0;">Entrega en: ${orderData.deliveryAddress}</p>
          </div>
          
          <p>Te avisaremos en cuanto tus flores salgan de nuestro taller.</p>
          <br/>
          <p>Con cariño,<br/><strong>Janneth Acevedo Plantas</strong></p>
        </div>
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} Janneth Acevedo - Bogotá, Colombia
        </div>
      </div>
    `;
    
    // Aquí iría la integración real con SendGrid, MailerSend, etc.
    // console.log(html); 
    return true;
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    this.logger.log(`📧 Enviando correo de bienvenida a: ${email}`);
    // Implementar envío de correo de bienvenida
    return true;
  }

  async sendPasswordResetEmail(email: string, firstName: string, resetToken: string) {
    this.logger.log(`📧 Enviando correo de recuperación de contraseña a: ${email}`);
    
    // URL del frontend para restablecer contraseña
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;
    
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #be185d; padding: 30px; text-center;">
          <h1 style="color: white; margin: 0;">Restablecer Contraseña 🔒</h1>
        </div>
        <div style="padding: 30px; color: #333;">
          <p>Hola, <strong>${firstName}</strong>,</p>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; padding: 15px 30px; background: #be185d; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Restablecer Contraseña
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">Este enlace es válido por <strong>1 hora</strong>.</p>
          <p style="color: #666; font-size: 14px;">Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña no será modificada.</p>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br/>
            <span style="word-break: break-all;">${resetUrl}</span>
          </p>
          
          <br/>
          <p>Saludos,<br/><strong>Janneth Acevedo Plantas</strong></p>
        </div>
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} Janneth Acevedo - Bogotá, Colombia
        </div>
      </div>
    `;
    
    // Aquí iría la integración real con SendGrid, MailerSend, etc.
    // Por ahora solo logueamos
    this.logger.log(`Reset URL: ${resetUrl}`);
    return true;
  }
}
