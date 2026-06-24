import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

class WhatsAppService {
  private client!: Client;
  private isReady = false;

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
      console.log('[WA] Cliente listo');
    });

    this.client.on('auth_failure', () => {
      console.error('[WA] Fallo de autenticación — eliminá .wwebjs_auth/ y reiniciá');
    });

    this.client.on('disconnected', (reason) => {
      this.isReady = false;
      console.warn('[WA] Desconectado:', reason);
    });

    this.client.initialize().catch((err: Error) => {
      console.error('[WA] No se pudo inicializar WhatsApp:', err.message);
      console.warn('[WA] El servidor seguirá funcionando sin WhatsApp.');
    });
  }

  async sendMessage(phone: string, message: string): Promise<void> {
    if (!this.isReady) {
      console.warn('[WA] Cliente no listo — mensaje no enviado a', phone);
      return;
    }
    const chatId = `549${phone.replace(/\D/g, '')}@c.us`;
    await this.client.sendMessage(chatId, message);
    console.log('[WA] Mensaje enviado a', chatId);
  }

  get ready() {
    return this.isReady;
  }
}

export const whatsappService = new WhatsAppService();
