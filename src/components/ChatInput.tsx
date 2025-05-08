import React, { useState } from 'react';
import { useWebSocketContext } from '../context/WebSocketContext';
import { Send } from 'lucide-react';

export function ChatInput() {
  const [message, setMessage] = useState('');
  const { sendMessage, status } = useWebSocketContext();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && status === 'connected') {
      sendMessage(message);
      setMessage('');
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="mt-4 flex items-center gap-2"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        disabled={status !== 'connected'}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 transition-all duration-200"
      />
      <button
        type="submit"
        disabled={!message.trim() || status !== 'connected'}
        className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 transition-all duration-200"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}