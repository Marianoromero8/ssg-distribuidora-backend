import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcodeTerminal from 'qrcode-terminal';
import qrcode from 'qrcode';
import { AppError } from '../shared/errors/AppError';

class WhatsAppService {
  private client!: Client;
  private isReady = false;
  private lastReadyAt: Date | null = null;
  private lastDisconnectedAt: Date | null = null;
  private lastDisconnectReason: string | null = null;
  private latestQr: string | null = null;

  initialize() {
    this.client = new Client({
      authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
      puppeteer: {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
        ],
      },
    });

    this.client.on('qr', (qr) => {
      console.log('\n[WA] Escanea este QR con el teléfono de la empresa:\n');
      qrcodeTerminal.generate(qr, { small: true });
      qrcode
        .toDataURL(qr)
        .then((dataUrl) => {
          this.latestQr = dataUrl;
        })
        .catch((err: Error) => {
          console.error('[WA] No se pudo generar el QR como imagen:', err.message);
        });
    });

    this.client.on('ready', () => {
      this.isReady = true;
      this.lastReadyAt = new Date();
      this.latestQr = null;
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

  async reconnect() {
    if (this.isReady) {
      throw new AppError('WhatsApp ya está conectado', 409);
    }
    this.latestQr = null;
    try {
      await this.client?.destroy();
    } catch (err) {
      console.warn('[WA] Error al cerrar el cliente anterior:', (err as Error).message);
    }
    this.initialize();
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

  getQr() {
    return this.latestQr;
  }
}

export const whatsappService = new WhatsAppService();
