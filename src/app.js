const TOKEN = process.env.TELEGRAM_TOKEN;
const TelegramBot = require('node-telegram-bot-api');
const ccd = require('country-code-emoji');
const axios = require('axios');

const API = process.env.API_KEY;
const logger = require('./logger');

const countryArr = ['GE', 'UA', 'US', 'DE', 'GB', 'IT', 'FR', 'GR'];
const uri = 'https://holidays.abstractapi.com/v1/?';

const replyMarkup = {
  keyboard: [countryArr.map((el) => ccd.countryCodeEmoji(el))],
  resize_keyboard: true,
  one_time_keyboard: true,
};

const bot = new TelegramBot(TOKEN, {
  polling: true,
});

const holiday = async (country) => {
  logger.info(`User choosed ${country}.`);
  const date = new Date();
  try {
    const response = await axios(
      `${uri}api_key=${API}&country=${country}&year=${date.getFullYear()}&month=${
        date.getMonth() + 1
      }&day=${date.getDate()}`,
    );
    const { data } = await response;
    return data;
  } catch (error) {
    return 'error';
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
      reply_markup: replyMarkup,
    });
  }

  const countryCode = await findCountry(msg.text);
  const answer = await holiday(countryCode);
  if (answer === 'error') {
    return bot.sendMessage(msg.chat.id, 'Please Choose Country', {
      reply_markup: replyMarkup,
    });
  }

  return answer.length > 0
    ? answer.forEach((el) => {
        bot.sendMessage(msg.chat.id, `${el.name}`, {
          reply_markup: replyMarkup,
        });
      })
    : bot.sendMessage(msg.chat.id, 'There is no holiday', {
        reply_markup: replyMarkup,
      });
};

bot.on('message', (msg) => {
  handleMessage(msg);
});
