const { Command } = require("commander");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.TOKEN;
const chatId = process.env.CHATID;

const bot = new TelegramBot(token, { polling: true });

const program = new Command();

program
  .command("send-message <message>")
  .alias("m")
  .description("Send a message to Telegram")
  .action((message) => bot.sendMessage(chatId, message))
  .hook("postAction", () => process.exit(0));

program
  .command("send-photo <photo>")
  .alias("p")
  .description("Send a photo to Telegram")
  .action(photo => bot.sendPhoto(chatId, photo))
  .hook("postAction", () => process.exit(0));

program.parse(process.argv);
