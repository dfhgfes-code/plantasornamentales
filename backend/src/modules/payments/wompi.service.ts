import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class WompiService {
  private readonly logger = new Logger(WompiService.name);
  private readonly baseUrl: string;
  private readonly privateKey: string;
  private readonly publicKey: string;
  private readonly eventsSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = configService.get<string>('wompi.baseUrl');
    this.privateKey = configService.get<string>('wompi.privateKey');
    this.publicKey = configService.get<string>('wompi.publicKey');
    this.eventsSecret = configService.get<string>('wompi.eventsSecret');
  }

  // ─── Crear transacción en Wompi ──────────────────────────────
  async createTransaction(params: {
    amountInCents: number;
    currency: string;
    reference: string;
    customerEmail: string;
    paymentMethod: Record<string, any>;
    redirectUrl?: string;
  }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transactions`,
        {
          amount_in_cents: params.amountInCents,
          currency: params.currency,
          customer_email: params.customerEmail,
          payment_method: params.paymentMethod,
          reference: params.reference,
          redirect_url: params.redirectUrl || `${process.env.CORS_ORIGIN}/checkout/result`,
        },
        {
          headers: {
            Authorization: `Bearer ${this.privateKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error creando transacción Wompi', error?.response?.data);
      throw error;
    }
  }

  // ─── Consultar transacción ───────────────────────────────────
  async getTransaction(transactionId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transactions/${transactionId}`,
        { headers: { Authorization: `Bearer ${this.privateKey}` } },
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error consultando transacción Wompi', error?.response?.data);
      throw error;
    }
  }

  // ─── Obtener token de aceptación ─────────────────────────────
  async getAcceptanceToken() {
    const response = await axios.get(
      `${this.baseUrl}/merchants/${this.publicKey}`,
    );
    return response.data?.data?.presigned_acceptance?.acceptance_token;
  }

  // ─── Verificar firma del webhook ─────────────────────────────
  verifyWebhookSignature(payload: any, signature: string): boolean {
    try {
      const {
        transaction: { id, status, amount_in_cents },
        occurred_at,
      } = payload;

      const checksum = `${id}${status}${amount_in_cents}${occurred_at}${this.eventsSecret}`;
      const hash = crypto.createHash('sha256').update(checksum).digest('hex');
      return hash === signature;
    } catch {
      return false;
    }
  }

  // ─── Mapear estado Wompi → interno ───────────────────────────
  mapWompiStatus(wompiStatus: string): string {
    const map: Record<string, string> = {
      APPROVED: 'approved',
      DECLINED: 'declined',
      VOIDED: 'voided',
      ERROR: 'error',
      PENDING: 'pending',
    };
    return map[wompiStatus] || 'pending';
  }

  // ─── Construir método de pago para Wompi ─────────────────────
  buildPaymentMethod(method: string, token?: string, extra?: Record<string, any>) {
    switch (method.toUpperCase()) {
      case 'CARD':
        return { type: 'CARD', token, installments: extra?.installments || 1 };
      case 'PSE':
        return {
          type: 'PSE',
          user_type: extra?.userType || 0,
          user_legal_id_type: extra?.legalIdType || 'CC',
          user_legal_id: extra?.legalId,
          financial_institution_code: extra?.bankCode,
          payment_description: 'Janneth Acevedo Plantas',
        };
      case 'NEQUI':
        return { type: 'NEQUI', phone_number: extra?.phone };
      default:
        return { type: method };
    }
  }
}
