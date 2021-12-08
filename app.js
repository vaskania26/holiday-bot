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
  try {
    const response = await axios(
      `${uri}api_key=${API_KEY}&country=${country}&year=${date.getFullYear()}&month=${
        date.getMonth() + 1
      }&day=${date.getDate()}`,
    );
    const { data } = await response;
    return data;
  } catch (error) {
    return 'Choose country';
  }
};

const findCountry = async (flag) => {
  try {
    return ccd.emojiCountryCode(flag);
  } catch (error) {
    return error;
  }
};

const handleMessage = async (msg) => {
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

  const countryCode = await findCountry(msg.text);
  const answer = await holiday(countryCode);
  // console.log(answer);
  return answer.length > 0
    ? bot.sendMessage(msg.chat.id, `${answer[0].name}`)
    : bot.sendMessage(msg.chat.id, 'There is no holiday');
};

bot.on('message', (msg) => {
  handleMessage(msg);
  logger.info(`USER: ${msg.chat.first_name} send message: ${msg.text}.`);
});
