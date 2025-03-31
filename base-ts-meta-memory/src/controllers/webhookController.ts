import { Request, Response } from 'express';
import { WebhookPayload } from '../interfaces';
import logger from '../utils/logger';
import { AppError } from '../middlewares/errorHandler';

export class WebhookController {
  public static async verify(req: Request, res: Response): Promise<void> {
    const verifyToken = process.env.verifyToken;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (!verifyToken) {
      throw new AppError('verifyToken no configurado', 500);
    }

    if (mode && token && mode === 'subscribe' && token === verifyToken) {
      logger.info('Webhook verificado correctamente');
      res.status(200).send(challenge);
    } else {
      logger.warn('Fallo en verificación de webhook');
      throw new AppError('Token de verificación inválido', 403);
    }
  }

  public static async handleMessage(req: Request, res: Response): Promise<void> {
    const body: WebhookPayload = req.body;

    if (!body || !body.entry) {
      throw new AppError('Payload inválido', 400);
    }

    logger.info("Mensaje recibido:", { body });

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      if (messages && messages.length > 0) {
        const msg = messages[0];
        const number = msg.from;
        const text = msg.text?.body;

        if (!number) {
          throw new AppError('Número de teléfono faltante', 400);
        }

        logger.info("Mensaje procesado", { number, text });
        // Aquí integrarías el procesamiento del bot
      }
    }

    res.sendStatus(200);
  }
}