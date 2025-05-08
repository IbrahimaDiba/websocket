import React from 'react';
import { ChatRoom } from './components/ChatRoom';
import { WebSocketProvider } from './context/WebSocketContext';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <WebSocketProvider>
        <ChatRoom />
      </WebSocketProvider>
    </div>
  );
}

export default App;