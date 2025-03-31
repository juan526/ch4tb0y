import { db } from '../config/firebase';
import { KnowledgeBase, Conversation } from '../interfaces';
import logger from '../utils/logger';
import { AppError } from '../middlewares/errorHandler'; // Importación añadida

export class FirebaseService {
  private static instance: FirebaseService;
  private knowledgeBase: KnowledgeBase = {};
  private lastUpdated: number = 0;

  private constructor() {}

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  public async loadKnowledgeBase(): Promise<void> {
    try {
      const snapshot = await db.collection("training").get();
      
      this.knowledgeBase = snapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        if (data.question && data.answer) {
          acc[data.question.toLowerCase()] = data.answer;
        }
        return acc;
      }, {} as KnowledgeBase);

      this.lastUpdated = Date.now();
      logger.info(`Base de conocimiento actualizada con ${Object.keys(this.knowledgeBase).length} entradas`);
    } catch (error) {
      logger.error("Error al cargar la base de conocimiento:", error);
      throw new AppError('Error al cargar conocimiento', 500);
    }
  }

  public async saveConversation(conversation: Omit<Conversation, 'timestamp'>): Promise<void> {
    try {
      await db.collection("conversations").add({
        ...conversation,
        timestamp: new Date()
      });
      logger.info(`Conversación guardada para usuario: ${conversation.user}`);
    } catch (error) {
      logger.error("Error al guardar conversación:", error);
      throw new AppError('Error al guardar conversación', 500);
    }
  }

  public getKnowledgeBase(): KnowledgeBase {
    return this.knowledgeBase;
  }
}

export const firebaseService = FirebaseService.getInstance();