const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const NodeCache = require("node-cache");

const myCache = new NodeCache({ stdTTL: 600, useClones: false });

const token = "6239065064:AAH99v6s4_O1YKYh6ERdLn2k6Jnmi-m2km8";

const bot = new TelegramBot(token, { polling: true });

const UAHCode = 980;
const USDCode = 840;
const EURCode = 978;

const exchangeRateHtmlTemplate = (privatData, monoData, currency) => {
  const filteredPrivatData = privatData.filter((item) => item.ccy === currency);
  let filteredMonoData;

  if (currency === "USD") {
    filteredMonoData = monoData.filter(
      (item) => item.currencyCodeA === USDCode && item.currencyCodeB === UAHCode
    );
  } else if (currency === "EUR") {
    filteredMonoData = monoData.filter(
      (item) => item.currencyCodeA === EURCode && item.currencyCodeB === UAHCode
    );
  }

  return `
  PrivatBank:
Currency: ${filteredPrivatData[0].ccy} - Buying: ${
    filteredPrivatData[0].buy
  } UAH - Selling: ${filteredPrivatData[0].sale} UAH\n
Monobank: 
Currency: ${
    filteredMonoData[0].currencyCodeA === USDCode ? "USD" : "EUR"
  } - Buying: ${filteredMonoData[0].rateBuy} UAH - Selling: ${
    filteredMonoData[0].rateSell
  } UAH
  `;
};

const getExchangeRate = async (currency) => {
  const privatEndpoint = `https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5`;
  const monoEndpoint = "https://api.monobank.ua/bank/currency";
  const privatResponse = await axios.get(privatEndpoint);

  let cachedMonoResponse = myCache.get("monoResponse");

  if (cachedMonoResponse == null) {
    cachedMonoResponse = await axios.get(monoEndpoint);
    myCache.set("monoResponse", cachedMonoResponse, 300);
  }

  return exchangeRateHtmlTemplate(
    privatResponse.data,
    cachedMonoResponse.data,
    currency
  );
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Welcome at Exchange Rates Bot.
  `,
    {
      reply_markup: {
        keyboard: [["USD", "EUR"]],
      },
    }
  );
});

bot.onText(/USD/, async (msg) => {
  const weather = await getExchangeRate("USD");

  bot.sendMessage(msg.chat.id, weather);
});

bot.onText(/EUR/, async (msg) => {
  const weather = await getExchangeRate("EUR");

  bot.sendMessage(msg.chat.id, weather);
});
