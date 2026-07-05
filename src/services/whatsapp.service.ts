import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

class WhatsAppService {
  private client!: Client;
  private isReady = false;
  private lastReadyAt: Date | null = null;
  private lastDisconnectedAt: Date | null = null;
  private lastDisconnectReason: string | null = null;

  initialize() {
    this.client = new Client({
      authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
      puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
    });

    this.client.on('qr', (qr) => {
      console.log('\n[WA] Escanea este QR con el teléfono de la empresa:\n');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      this.isReady = true;
      this.lastReadyAt = new Date();
      console.log('[WA] Cliente listo');
    });

    this.client.on('auth_failure', () => {
      console.error('[WA] Fallo de autenticación — eliminá .wwebjs_auth/ y reiniciá');
    });

    this.client.on('disconnected', (reason) => {
      this.isReady = false;
      this.lastDisconnectedAt = new Date();
      this.lastDisconnectReason = String(reason);
      console.warn('[WA] Desconectado:', reason);
    });

    this.client.initialize().catch((err: Error) => {
      console.error('[WA] No se pudo inicializar WhatsApp:', err.message);
      console.warn('[WA] El servidor seguirá funcionando sin WhatsApp.');
    });
  }

  async sendMessage(phone: string, message: string): Promise<boolean> {
    if (!this.isReady) {
      console.warn('[WA] Cliente no listo — mensaje no enviado a', phone);
      return false;
    }
    const chatId = `549${phone.replace(/\D/g, '')}@c.us`;
    try {
      await this.client.sendMessage(chatId, message);
      console.log('[WA] Mensaje enviado a', chatId);
      return true;
    } catch (err) {
      console.error('[WA] Error al enviar mensaje a', chatId, err);
      return false;
    }
  }

  get ready() {
    return this.isReady;
  }

  getStatus() {
    return {
      ready: this.isReady,
      lastReadyAt: this.lastReadyAt,
      lastDisconnectedAt: this.lastDisconnectedAt,
      lastDisconnectReason: this.lastDisconnectReason,
    };
  }
}

export const whatsappService = new WhatsAppService();
