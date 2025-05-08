import React from 'react';
import { ChatMessage as ChatMessageType } from '../types/chat';
import { MessageCircle, Bell, Info } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { type, message: content, timestamp } = message;
  
  // Format timestamp for display
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const renderIcon = () => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'welcome':
        return <Info className="w-5 h-5 text-purple-500" />;
      case 'notification':
        return <Bell className="w-5 h-5 text-amber-500" />;
      default:
        return null;
    }
  };
  
  const getMessageStyles = () => {
    switch (type) {
      case 'message':
        return 'bg-white border-gray-200';
      case 'welcome':
        return 'bg-purple-50 border-purple-200';
      case 'notification':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-white border-gray-200';
    }
  };
  
  return (
    <div 
      className={`p-4 rounded-lg border shadow-sm mb-4 transition-all duration-300 ease-in-out ${getMessageStyles()} animate-fade-in`}
    >
      <div className="flex items-start">
        <div className="mr-3 mt-1">{renderIcon()}</div>
        <div className="flex-1">
          <div className="font-medium text-gray-900">{content}</div>
          <div className="text-xs text-gray-500 mt-1">{formattedTime}</div>
        </div>
      </div>
    </div>
  );
}