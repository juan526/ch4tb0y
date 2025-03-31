import express from 'express';
import cors from 'cors';
import { config } from './config';
import { createBot } from '@builderbot/bot';
import { MemoryDB as Database } from '@builderbot/bot';
import { MetaProvider as Provider } from '@builderbot/provider-meta';
import { errorHandler } from './middlewares/errorHandler';
import { welcomeFlow } from './flows/welcomeFlow';
import { dtfFlow } from './flows/dtfFlow';
import { enviosFlow } from './flows/enviosFlow';
import { asesorHumanoFlow } from './flows/asesorHumanoFlow';
import { clientesIndecisosFlow } from './flows/clientesIndecisosFlow';
import { WebhookController } from './controllers/webhookController';
import { firebaseService } from './services/firebaseService';
import logger from './utils/logger';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Webhooks
app.get('/webhook', WebhookController.verify);
app.post('/webhook', WebhookController.handleMessage);

// Inicialización del bot
const main = async () => {
  try {
    // Cargar base de conocimiento inicial
    await firebaseService.loadKnowledgeBase();

    const adapterFlow = createFlow([
      welcomeFlow,
      dtfFlow,
      enviosFlow,
      asesorHumanoFlow,
      clientesIndecisosFlow
    ]);

    const adapterProvider = createProvider(Provider, {
      jwtToken: config.jwtToken,
      numberId: config.numberId,
      verifyToken: config.verifyToken,
      version: 'v22.0'
    });

    const adapterDB = new Database();

    const { httpServer } = await createBot({
      flow: adapterFlow,
      provider: adapterProvider,
      database: adapterDB,
    });

    // Configurar rutas adicionales del provider
    require('./providers/metaRoutes')(adapterProvider);

    // Manejo de errores
    app.use(errorHandler);

    // Iniciar servidor
    httpServer(+config.PORT);
    logger.info(`🚀 Bot iniciado en el puerto ${config.PORT}`);

    // Actualización periódica de la base de conocimiento
    setInterval(async () => {
      await firebaseService.loadKnowledgeBase();
    }, 3600000); // Cada hora

  } catch (error) {
    logger.error('Error al iniciar el bot:', error);
    process.exit(1);
  }
};

main();
