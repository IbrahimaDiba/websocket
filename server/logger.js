import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logger
export function createLogger() {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
      })
    ),
    transports: [
      // Console output
      new winston.transports.Console(),
      // File output
      new winston.transports.File({ 
        filename: path.join(__dirname, '../logs/chat.log'),
        dirname: path.join(__dirname, '../logs'),
        maxsize: 5242880, // 5MB
        maxFiles: 5
      })
    ]
  });
}