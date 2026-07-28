import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcodeTerminal from 'qrcode-terminal';
import qrcode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { AppError } from '../shared/errors/AppError';
import { env } from '../config/env';

function toWhatsappChatId(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');
  const withoutCountryCode = digitsOnly.replace(/^54(9)?/, '');
  return `549${withoutCountryCode}@c.us`;
}

// Con disco persistente, un contenedor anterior que se mató sin cerrar Chrome
// prolijo (redeploy, OOM) puede dejar el lock del perfil pisado. Como acá solo
// corre una instancia de este servicio, cualquier lock presente al arrancar es
// obsoleto y se puede borrar sin riesgo.
function clearStaleChromeLock(dataPath: string) {
  const sessionDir = path.join(path.resolve(dataPath), 'session');
  for (const lockFile of ['SingletonLock', 'SingletonSocket', 'SingletonCookie']) {
    try {
      fs.rmSync(path.join(sessionDir, lockFile), { force: true });
    } catch {
      // no existía, nada que limpiar
    }
  }
}

class WhatsAppService {
  private client!: Client;
  private isReady = false;
  private isReconnecting = false;
  private lastReadyAt: Date | null = null;
  private lastDisconnectedAt: Date | null = null;
  private lastDisconnectReason: string | null = null;
  private latestQr: string | null = null;

  initialize() {
    clearStaleChromeLock(env.WWEBJS_AUTH_PATH);
    this.client = new Client({
      authStrategy: new LocalAuth({ dataPath: env.WWEBJS_AUTH_PATH }),
      puppeteer: {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
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
    const chatId = toWhatsappChatId(phone);
    try {
      await this.client.sendMessage(chatId, message);
      console.log('[WA] Mensaje enviado a', chatId);
      return true;
    } catch (err) {
      console.error('[WA] Error al enviar mensaje a', chatId, err);
      if (this.isBrokenPageError(err)) {
        return this.recoverAndRetry(chatId, message);
      }
      return false;
    }
  }

  private isBrokenPageError(err: unknown): boolean {
    return err instanceof TypeError && /reading 'evaluate'/.test(err.message);
  }

  private async waitUntilReady(timeoutMs = 20000): Promise<boolean> {
    const start = Date.now();
    while (!this.isReady && Date.now() - start < timeoutMs) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    return this.isReady;
  }

  private async recoverAndRetry(chatId: string, message: string): Promise<boolean> {
    if (this.isReconnecting) {
      console.warn('[WA] Ya hay una reconexión en curso — no se reintenta el envío a', chatId);
      return false;
    }
    this.isReconnecting = true;
    this.isReady = false;
    console.warn('[WA] Página interna rota detectada — reconectando cliente...');
    try {
      await this.reconnect();
      const recovered = await this.waitUntilReady();
      if (!recovered) {
        console.error('[WA] No se pudo reconectar a tiempo — mensaje no reenviado a', chatId);
        return false;
      }
      await this.client.sendMessage(chatId, message);
      console.log('[WA] Mensaje reenviado tras reconexión a', chatId);
      return true;
    } catch (err) {
      console.error('[WA] Reintento tras reconexión falló para', chatId, err);
      return false;
    } finally {
      this.isReconnecting = false;
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
