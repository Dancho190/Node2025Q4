import express from 'express';
import { router } from './src/routes/route.js';

const createApp = () => {
  const app = express();
  app.use(express.json());

  // Подключаем роуты
  app.use('/', router);

  // Обработчик ошибок
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
  console.log('Starting server...');
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  return app;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer(3000);
}