export interface WebhookPayload {
    object?: string;
    entry?: Array<{
      changes?: Array<{
        value?: {
          messages?: Array<{
            from?: string;
            text?: {
              body?: string;
            };
          }>;
        };
      }>;
    }>;
  }
  
  export interface KnowledgeBase {
    [key: string]: string;
  }
  
  export interface Conversation {
    user: string;
    message: string;
    response: string;
    timestamp: Date;
  }