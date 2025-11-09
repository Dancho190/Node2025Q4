import express from 'express';
import { router } from './routes/route.js';

const createApp = () => {
  const app = express();

  // Middleware для парсинга
  app.use(express.json());

  app.use('/', router);

  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal server error occurred' });
    }
  });

  return app;
};

export const startServer = (port) => {
  const app = createApp();

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  return app;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer(3000); 
}
