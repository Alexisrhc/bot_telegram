import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const token = process.env.TELEGRAM_API_TOKEN;
if (!token) {
  throw new Error('TELEGRAM_API_TOKEN environment variable is required');
}

const bot = new TelegramBot(token, { polling: true });

// Ruta básica para verificar el servidor
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Api de telegram funcionando',
    version: "1.0.0",
    author: "Alexis Hernandez",
    email: "alexisrhc@hotmail.com"
  });
});

// Añadir comando al bot /hello para enviar hello world
bot.onText(/\/hello/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Lo unico que hara este bot es decir, HOLA! 😊');
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Iniciaste el bot de telegram, ahora puedes usar los comandos /hello');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});