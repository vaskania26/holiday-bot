const TOKEN =
  process.env.TELEGRAM_TOKEN ||
  '5067471450:AAHwgQ4g4D2AbtZueW9BNoMtMh2B8bnrKlE';
const TelegramBot = require('node-telegram-bot-api');
const { countryCodeEmoji } = require('country-code-emoji');
const logger = require('./src/logger');

const countryArr = ['GE', 'UA', 'US', 'DE', 'GB', 'IT', 'FR', 'GR'];

const bot = new TelegramBot(TOKEN, {
  polling: true,
});

const handleMessage = (msg) => {
  const text = msg.text.toLocaleLowerCase().trim();
  console.log(text);
  if (text === '/start') {
    return bot.sendMessage(
      msg.chat.id,
      `Hello ${msg.chat.first_name}, for more information about me please send /about or /links message.`,
      {
        reply_markup: {
          keyboard: [countryArr.map((el) => countryCodeEmoji(el))],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      },
    );
  }
  if (text === countryArr.filter((el) => el == text)) {
    console.log('match');
  }
  return bot.sendMessage(msg.chat.id, 'Please send available commands', {
    reply_markup: {
      keyboard: [countryArr.map((el) => countryCodeEmoji(el))],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
};

bot.on('message', (msg) => {
  handleMessage(msg);
  logger.info(`USER: ${msg.chat.first_name} send message: ${msg.text}.`);
});
