import { addKeyword } from '@builderbot/bot';
import { getChatGPTResponse } from '../services/aiService';
import { firebaseService } from '../services/firebaseService';
import { obtenerCliente, guardarCliente } from '../services/clienteService';
import logger from '../utils/logger';

export const welcomeFlow = addKeyword(['hi', 'hello', 'hola', 'buenas'])
  .addAnswer('', { capture: true }, async (ctx, { flowDynamic }) => {
    try {
      if (!ctx.from) {
        throw new Error('Contexto sin número de remitente');
      }

      const numero = ctx.from;
      const mensaje = ctx.body?.trim().toLowerCase() || '';
      let nombre = await obtenerCliente(numero);

      if (!nombre) {
        if (!mensaje.startsWith("me llamo")) {
          await flowDynamic("👋 ¡Hola! Bienvenido a Isuapliques 😊. Por favor, dime tu nombre escribiendo: *me llamo [tu nombre]*");
          return;
        }

        nombre = mensaje.replace(/me llamo\s?/i, "").trim();
        if (!nombre) {
          await flowDynamic("Por favor, escribe tu nombre después de 'me llamo'. Ejemplo: *me llamo María*");
          return;
        }

        await guardarCliente(numero, nombre);
        await flowDynamic(`¡Gracias ${nombre}! 😄 ¿En qué puedo ayudarte?`);
        return;
      }

      const aiResponse = await getChatGPTResponse(mensaje);
      await firebaseService.saveConversation({
        user: nombre,
        message: mensaje,
        response: aiResponse
      });
      await flowDynamic(aiResponse);

    } catch (error) {
      logger.error('Error en flujo de bienvenida:', error);
      await flowDynamic("Lo siento, estoy teniendo problemas técnicos. Por favor intenta nuevamente más tarde.");
    }
  });