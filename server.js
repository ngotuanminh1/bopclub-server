require('dotenv').config();
const fs = require('fs');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const Telegram = require('node-telegram-bot-api');
const path = require('path');

const app = express();
const port = process.env.PORT || 80;

// ====== Middleware ======
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// ====== Express WebSocket ======
const expressWs = require('express-ws')(app);
const redT = expressWs.getWss();
process.redT = redT;
global.redT = redT;
global.userOnline = 0;

// ====== Telegram Bot ======
const TelegramToken = process.env.TELEGRAM_TOKEN || '7802201067:AAFYj1QEMsj-dzKNiL8OovU6nBrQ7TF80qo';
const TelegramBot = new Telegram(TelegramToken, { polling: true }); // Use Webhook in production
redT.telegram = TelegramBot;

// ====== MongoDB Connect ======
const configDB = require('./config/database');
require('mongoose-long')(mongoose);

mongoose.connect(configDB.url, configDB.options)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    // ====== Load Models & Core Features Only After DB Connected ======
    require('./config/admin');
    require('./config/cron')();
    require('./app/Helpers/socketUser')(redT);
    require('./routerHttp')(app, redT);
    require('./routerCMS')(app, redT);
    require('./routerSocket')(app, redT);
    require('./app/Cron/taixiu')(redT);
    require('./app/Cron/baucua')(redT);
    require('./app/Telegram/Telegram')(redT);
    require('./app/Cron/botBroadcast')(redT);
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ====== View Engine ======
app.use(express.static(path.join(__dirname, 'public2')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public2', 'index.html'));
});


// ====== API for Bot Chat ======
app.get('/api/random-bot-chat', (req, res) => {
  const userNames = ["minhng5616", "hoanganh98", "trungkts", "bichhanh99", "vietanhx1"];
  const chatMessages = [
    "Xỉu 8 đi anh em!", "Tài rồi đấy!", "Tay này dễ ăn!",
    "Cầu rõ xỉu rồi!", "Húp nhẹ phát!", "Đỏ tay nè!",
    "Tài 11 rõ mồm một!", "Vào xỉu cho chắc!", "Chuẩn không cần chỉnh!",
    "Cầu lạ quá, đoán đại!"
  ];

  const user = userNames[Math.floor(Math.random() * userNames.length)];
  const message = chatMessages[Math.floor(Math.random() * chatMessages.length)];
  res.json({ user, value: message });
});

// ====== Root Route ======
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ====== Start Server ======
app.listen(port, () => {
  console.log(`\u2728 Server is running on http://localhost:${port}`);
});
