import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();

const app = express();
const port = 3000;

const token = process.env.TELEGRAM_API_TOKEN;
const bot = new TelegramBot(token!.toString(), { polling: true });

// Ruta básica para verificar el servidor
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

//add command to bot /hello to send hello world
bot.onText(/\/hello/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Lo unico que hara este bot es decir, saludar');
  bot.sendMessage(msg.chat.id, 'Hola');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
