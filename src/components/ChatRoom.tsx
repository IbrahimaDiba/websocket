import React, { useRef, useEffect } from 'react';
import { ConnectionStatus } from './ConnectionStatus';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useWebSocketContext } from '../context/WebSocketContext';
import { MessageCircle } from 'lucide-react';

export function ChatRoom() {
  const { messages } = useWebSocketContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 rounded-xl shadow-lg bg-gray-50 border border-gray-200">
      <header className="flex items-center justify-center mb-6">
        <MessageCircle className="w-8 h-8 text-blue-500 mr-3" />
        <h1 className="text-2xl font-bold text-gray-900">Real-time Chat</h1>
      </header>
      
      <ConnectionStatus />
      
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-lg p-4 border border-gray-200 shadow-inner h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="w-12 h-12 mb-3 text-gray-300" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput />
    </div>
  );
}