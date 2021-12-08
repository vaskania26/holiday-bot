const TOKEN =
  process.env.TELEGRAM_TOKEN ||
  '5067471450:AAHwgQ4g4D2AbtZueW9BNoMtMh2B8bnrKlE';
const TelegramBot = require('node-telegram-bot-api');
const ccd = require('country-code-emoji');
const axios = require('axios');

const API_KEY = process.env.API_KEY || '552ba7d9129340c6aa11b4cb9dbd0a42';
const logger = require('./src/logger');

const countryArr = ['GE', 'UA', 'US', 'DE', 'GB', 'IT', 'FR', 'GR'];
const uri = 'https://holidays.abstractapi.com/v1/?';

const bot = new TelegramBot(TOKEN, {
  polling: true,
});

const holiday = async (country) => {
  const date = new Date();
  const response = await axios(
    `${uri}api_key=${API_KEY}&country=${country}&year=${date.getFullYear()}&month=${
      date.getMonth() + 1
    }&day=${date.getDate()}`,
  );
  const { data } = response;
  // eslint-disable-next-line no-console
  console.log(data);
};

const findCountry = (flag) => {
  const country = ccd.emojiCountryCode(flag);
  holiday(country);
};

const handleMessage = (msg) => {
  const text = msg.text.toLocaleLowerCase().trim();
  if (text === '/start') {
    return bot.sendMessage(msg.chat.id, 'Choose Country', {
      reply_markup: {
        keyboard: [countryArr.map((el) => ccd.countryCodeEmoji(el))],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  }
  return findCountry(msg.text);
};

bot.on('message', (msg) => {
  handleMessage(msg);
  logger.info(`USER: ${msg.chat.first_name} send message: ${msg.text}.`);
});
