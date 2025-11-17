import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDatabase from './config/database';
import { notFound, errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import eventRoutes from './routes/eventRoutes';
import problemRoutes from './routes/problemRoutes';

// Create Express app
const app: Application = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security headers
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to API routes
app.use('/api', limiter);

// ============================================================================
// ROUTES
// ============================================================================

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API version info
app.get('/api', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Coding Challenge Platform API',
    version: process.env.API_VERSION || 'v1',
    documentation: '/api/v1/docs',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      events: '/api/v1/events',
      problems: '/api/v1/problems'
    }
  });
});

// API routes
const API_VERSION = process.env.API_VERSION || 'v1';
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/events`, eventRoutes);
app.use(`/api/${API_VERSION}/problems`, problemRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ============================================================================
// SERVER
// ============================================================================

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Coding Challenge Platform API                        ║
║                                                            ║
║   Environment: ${process.env.NODE_ENV?.padEnd(44) || 'development'.padEnd(44)}║
║   Port:        ${PORT.toString().padEnd(44)}║
║   API Version: ${(process.env.API_VERSION || 'v1').padEnd(44)}║
║                                                            ║
║   Health Check: http://localhost:${PORT}/health${' '.repeat(23)}║
║   API Info:     http://localhost:${PORT}/api${' '.repeat(26)}║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Start the server
startServer();

export default app;
