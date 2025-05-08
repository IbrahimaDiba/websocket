import React from 'react';
import { useWebSocketContext } from '../context/WebSocketContext';
import { WifiOff, Wifi, Loader } from 'lucide-react';

export function ConnectionStatus() {
  const { status, connect, disconnect } = useWebSocketContext();
  
  const getStatusDetails = () => {
    switch (status) {
      case 'connected':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          text: 'Connected',
          icon: <Wifi className="w-5 h-5" />
        };
      case 'connecting':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          text: 'Connecting...',
          icon: <Loader className="w-5 h-5 animate-spin" />
        };
      case 'disconnected':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          text: 'Disconnected',
          icon: <WifiOff className="w-5 h-5" />
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          text: 'Unknown',
          icon: null
        };
    }
  };
  
  const { color, text, icon } = getStatusDetails();
  
  return (
    <div className="flex items-center justify-between mb-4 p-3 rounded-lg border shadow-sm transition-all duration-300 ease-in-out">
      <div className={`flex items-center px-3 py-1 rounded-full ${color}`}>
        {icon}
        <span className="ml-2 font-medium">{text}</span>
      </div>
      
      <div>
        {status === 'disconnected' ? (
          <button
            onClick={connect}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-200 flex items-center"
          >
            <Wifi className="w-4 h-4 mr-2" />
            Connect
          </button>
        ) : (
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors duration-200 flex items-center"
          >
            <WifiOff className="w-4 h-4 mr-2" />
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
}