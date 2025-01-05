const express = require('express');
const dotenv = require('dotenv');
const weatherRouter = require('./src/api/weather');
const geolocationRouter = require('./src/api/geolocation');
const newsRouter = require('./src/api/news');
const currencyRouter = require('./src/api/currency');

dotenv.config(); // Подключаем переменные окружения из .env
const app = express();
const PORT = process.env.PORT || 3000; // Используем порт из .env или 3000 по умолчанию

// Middleware для обработки JSON
app.use(express.json());

// Настройка маршрутов API
app.use('/api/weather', weatherRouter);
app.use('/api/geolocation', geolocationRouter);
app.use('/api/news', newsRouter);
app.use('/api/currency', currencyRouter);

// Настройка статической папки для фронтенда
app.use(express.static('public'));

// Корневой маршрут для проверки сервера
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the API Server!</h1>
    <p>Available routes:</p>
    <ul>
      <li><a href="/api/weather/London">/api/weather/:city</a></li>
      <li><a href="/api/geolocation/51.5074/-0.1278">/api/geolocation/:lat/:lon</a></li>
      <li><a href="/api/news/London">/api/news/:city</a></li>
      <li><a href="/api/currency/USD/EUR">/api/currency/:base/:target</a></li>
    </ul>
  `);
});

// Обработка маршрутов, которых нет
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
