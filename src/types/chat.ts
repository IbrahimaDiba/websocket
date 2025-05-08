export interface ChatMessage {
  type: 'message' | 'welcome' | 'notification';
  message: string;
  timestamp: string;
  id: number;
  sender?: string;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export interface WebSocketContextType {
  messages: ChatMessage[];
  status: ConnectionStatus;
  sendMessage: (message: string) => void;
  connect: () => void;
  disconnect: () => void;
}