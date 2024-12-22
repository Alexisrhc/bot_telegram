import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();

const app = express();

const token = process.env.TELEGRAM_API_TOKEN;

if (!token) {
  throw new Error('TELEGRAM_API_TOKEN environment variable is required');
}

const bot = new TelegramBot(token, { polling: true });

// Ruta básica para verificar el servidor
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API de Telegram funcionando',
    version: '0.0.1',
    author: 'Alexis Hernandez',
    email: 'alexisrhc@hotmail.com',
    published: '2024-12-22',
    license: 'MIT',
    name_bot: '@alexisrhc_dev_bot',
  });
});

// Añadir comando al bot /hello para enviar hello world
bot.onText(/\/hello/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Lo único que hará este bot es decir, HOLA 😊');
});

// Añadir comando al bot /start para enviar mensaje de inicio
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Iniciaste el bot de Telegram, ahora puedes usar el comando /hello');
  // bot.sendMessage(msg.chat.id, 'CHUPALOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
});

// app.listen(port, () => {
//   console.log(`Servidor de Telegram funcionando en http://localhost:${port}`);
// });

export default app;
