
const TeleBot = require('telebot');
const bot = new TeleBot('7802201067:AAFYj1QEMsj-dzKNiL8OovU6nBrQ7TF80qo');
let configDB = require('../config/database');
let mongoose = require('mongoose');

require('mongoose-long')(mongoose); // INT 64bit
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(configDB.url, configDB.options)
    .catch(function(error) {
        if (error)
            console.log('Connect to MongoDB failed', error);
        else
            console.log('Connect to MongoDB success');
    });
bot.start();
require('./Controllers/start')(bot)
require('./Controllers/contact')(bot)
require('./Controllers/otp')