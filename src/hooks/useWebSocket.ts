import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage, ConnectionStatus } from '../types/chat';

// Get the WebSocket URL from the current window location
const getWebSocketUrl = () => {
  const host = window.location.host;
  return `ws://${host}/ws`;
};

const CONNECTION_TIMEOUT = 3000;
const MAX_RETRIES = 3;

export function useWebSocket() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const socketRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const timeoutRef = useRef<number>();

  // Connect to WebSocket server
  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }
    
    setStatus('connecting');
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    const ws = new WebSocket(getWebSocketUrl());
    socketRef.current = ws;
    
    // Set connection timeout
    timeoutRef.current = window.setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        ws.close();
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++;
          connect();
        } else {
          setStatus('disconnected');
          retryCountRef.current = 0;
        }
      }
    }, CONNECTION_TIMEOUT);
    
    ws.onopen = () => {
      setStatus('connected');
      console.log('WebSocket connection established');
      retryCountRef.current = 0;
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as ChatMessage;
        setMessages((prev) => [...prev, message]);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };
    
    ws.onclose = () => {
      setStatus('disconnected');
      console.log('WebSocket connection closed');
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatus('disconnected');
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Disconnect from WebSocket server
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setStatus('disconnected');
      retryCountRef.current = 0;
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    }
  }, []);
  
  // Send message to server
  const sendMessage = useCallback((content: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN && content.trim()) {
      const message: Partial<ChatMessage> = {
        type: 'message',
        message: content.trim(),
        timestamp: new Date().toISOString(),
        id: Date.now(),
      };
      
      socketRef.current.send(JSON.stringify(message));
      
      // Add to local messages immediately (optimistic update)
      setMessages((prev) => [...prev, message as ChatMessage]);
    }
  }, []);
  
  // Connect on component mount
  useEffect(() => {
    connect();
    
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);
  
  return {
    messages,
    status,
    sendMessage,
    connect,
    disconnect
  };
}