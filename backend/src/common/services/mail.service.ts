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
}
