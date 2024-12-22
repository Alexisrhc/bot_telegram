import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();

const app = express();

const token = process.env.TELEGRAM_API_TOKEN;
if (!token) {
  throw new Error('TELEGRAM_API_TOKEN environment variable is required');
}

const bot = new TelegramBot(token);

bot.setWebHook(`${process.env.WEBHOOK_URL}/webhook`);

// Ruta básica para verificar el servidor
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API de Telegram funcionando',
    version: '0.0.1',
    author: 'Alexis Hernandez',
    email: 'alexisrhc@hotmail.com',
    license: 'MIT',
  });
});

// Añadir comando al bot /hello para enviar hello world
bot.onText(/\/hello/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Lo único que hará este bot es decir, HOLA! 😊');
});

// Añadir comando al bot /start para enviar mensaje de inicio
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Iniciaste el bot de Telegram, ahora puedes usar los comandos /hello');
});

// Ruta para recibir actualizaciones de Telegram
app.post('webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200); // Responder correctamente a Telegram
});

export default app;
