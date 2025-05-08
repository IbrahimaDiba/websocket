import { WebSocketServer } from 'ws';
import { createLogger } from './logger.js';

const PORT = process.env.PORT || 8088;
const logger = createLogger();

// Initialize WebSocket server
const wss = new WebSocketServer({ 
  port: PORT,
  path: '/ws',
  clientTracking: true,
  perMessageDeflate: false
});

logger.info(`WebSocket server started on port ${PORT}`);

// Track connected clients
const clients = new Set();

// Handle new connections
wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  const clientId = `${clientIp}:${Math.floor(Math.random() * 1000)}`;
  
  // Add client to set
  clients.add(ws);
  
  // Log connection
  logger.info(`Client connected: ${clientId}`);
  
  // Send welcome message to newly connected client
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Welcome to the chat!',
    timestamp: new Date().toISOString(),
    id: Date.now()
  }));
  
  // Broadcast connection message to all clients
  broadcast({
    type: 'notification',
    message: 'A new user has joined the chat',
    timestamp: new Date().toISOString(),
    id: Date.now()
  }, ws);
  
  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      logger.info(`Message received: ${message.message}`);
      
      // Add timestamp and ID if not present
      if (!message.timestamp) {
        message.timestamp = new Date().toISOString();
      }
      if (!message.id) {
        message.id = Date.now();
      }
      
      // Broadcast message to all clients
      broadcast(message, ws);
    } catch (error) {
      logger.error(`Error processing message: ${error.message}`);
    }
  });
  
  // Handle client disconnection
  ws.on('close', () => {
    clients.delete(ws);
    logger.info(`Client disconnected: ${clientId}`);
    
    // Broadcast disconnect message
    broadcast({
      type: 'notification',
      message: 'A user has left the chat',
      timestamp: new Date().toISOString(),
      id: Date.now()
    });
  });
  
  // Handle errors
  ws.on('error', (error) => {
    logger.error(`WebSocket error: ${error.message}`);
    clients.delete(ws);
  });
});

// Broadcast message to all connected clients
function broadcast(message, sender = null) {
  clients.forEach((client) => {
    // Don't send the message back to the sender
    if (client !== sender && client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}

// Handle server shutdown
process.on('SIGINT', () => {
  logger.info('Server shutting down');
  wss.close(() => {
    logger.info('WebSocket server closed');
    process.exit(0);
  });
});