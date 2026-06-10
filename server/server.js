import express from 'express';
import cors from 'cors';
import carsRouter from './routes/cars.js';
import stocksRouter from './routes/stocks.js';
import tradesRouter from './routes/trades.js';
import eventsRouter from './routes/events.js';
import authRouter from './routes/auth.js';
import messagesRouter from './routes/messages.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS — для разработки разрешаем все origin
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, server: 'GMRP Dashboard API', gameServer: 32 });
});

app.use('/api/cars', carsRouter);
app.use('/api/stocks', stocksRouter);
app.use('/api/trades', tradesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/auth', authRouter);
app.use('/api/messages', messagesRouter);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 GMRP API запущен: http://localhost:${PORT}`);
});
