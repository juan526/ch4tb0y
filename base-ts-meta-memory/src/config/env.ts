import { z } from 'zod';

// Esquema de validación para las variables de entorno
const envSchema = z.object({
  // Configuración de Meta/WhatsApp
  WHATSAPP_TOKEN: z.string().min(1, "Token de WhatsApp es requerido"),
  WHATSAPP_NUMBER_ID: z.string().min(1, "ID de número de WhatsApp es requerido"),
  WHATSAPP_VERIFY_TOKEN: z.string().min(1, "Verify Token es requerido"),
  
  // Configuración de Firebase
  FIREBASE_PROJECT_ID: z.string().min(1, "Project ID de Firebase es requerido"),
  FIREBASE_CLIENT_EMAIL: z.string().email("Email de cliente Firebase inválido"),
  FIREBASE_PRIVATE_KEY: z.string().min(1, "Private Key de Firebase es requerido"),
  
  // Configuración de OpenAI
  OPENAI_API_KEY: z.string().min(1, "API Key de OpenAI es requerida"),
  
  // Configuración del servidor
  PORT: z.string().default("3008"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

// Validar las variables de entorno
const envValidation = envSchema.safeParse(process.env);

if (!envValidation.success) {
  console.error("❌ Error en variables de entorno:", envValidation.error.format());
  process.exit(1);
}

// Exportar las variables validadas
export const env = envValidation.data;