const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = "6152797611:AAFjg4vMquwsZqbXEtL7MYkh2NTSDQ2LL2Q";
const appID = "f1a42cda53c30d423857467fb6674af9";

const bot = new TelegramBot(token, { polling: true });

const city = "Lviv";
const hrs6 = 6 * 60 * 60 * 1000;
const hrs3 = 3 * 60 * 60 * 1000;

const weatherHtmlTemplate = (data) => {
  return data.list
    .map((item) => {
      return `${data.city.name}, ${item.dt_txt}
    🌡 The temperature is ${item.main.temp} °C and it feels like ${item.main.feels_like} °C.
    🌤 There will be ${item.weather[0].description}\n\n`;
    })
    .splice(0, 10)
    .join("");
};

const getWeather = async () => {
  const endpoint = `https://api.openweathermap.org/data/2.5/forecast?appid=${appID}&q=${city}&units=metric`;
  const response = await axios.get(endpoint);
  return weatherHtmlTemplate(response.data);
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Welcome at Weather Forecast Bot ☀️
Here you will receive the weather forecast in Lviv at a selected interval.
  `,
    {
      reply_markup: {
        keyboard: [["Forecast in Lviv"]],
      },
    }
  );
});

bot.onText(/Forecast in Lviv/, (msg) => {
  bot.sendMessage(msg.chat.id, "How often should we update the forecast?", {
    reply_markup: {
      resize_keyboard: true,
      force_reply: true,
      keyboard: [
        ["at intervals of 3 hours", "at intervals of 6 hours"],
        ["Cancel"],
      ],
    },
  });
});

let int;

bot.onText(/at intervals of 3 hours/, async (msg) => {
  const weather = await getWeather();

  bot.sendMessage(msg.chat.id, weather);

  int = setInterval(() => {
    bot.sendMessage(msg.chat.id, weather, {
      reply_markup: {
        resize_keyboard: true,
        force_reply: true,
        keyboard: [["Cancel"]],
      },
    });
  }, hrs3);
});

bot.onText(/at intervals of 6 hours/, async (msg) => {
  const weather = await getWeather();

  bot.sendMessage(msg.chat.id, weather);

  int = setInterval(() => {
    bot.sendMessage(msg.chat.id, weather, {
      reply_markup: {
        resize_keyboard: true,
        force_reply: true,
        keyboard: [["Cancel"]],
      },
    });
  }, hrs6);
});

bot.onText(/Cancel/, (msg) => {
  clearInterval(int);

  bot.sendMessage(msg.chat.id, "Thanks for using our services!", {
    reply_markup: {
      keyboard: [],
    },
  });
});
