import dotenv from "dotenv";
import express, { Request, Response } from "express";
import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const token = process.env.TELEGRAM_API_TOKEN;
const apiOpenAI = process.env.OPENAI_API_KEY;

if (!token) {
  throw new Error("TELEGRAM_API_TOKEN environment variable is required");
}

const openai_client = new OpenAI({
  apiKey: apiOpenAI,
  timeout: 60000,
});
const bot = new TelegramBot(token, { polling: true });

// aquí puedes ver en consola todo lo que sucede en el proyecto
// app.use(express.json());

// Ruta básica para verificar el servidor
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "API de Telegram funcionando",
    version: "0.0.1",
    author: "Alexis Hernandez",
    email: "alexisrhc@hotmail.com",
    published: "2024-12-25",
    license: "MIT",
    name_bot: "@alexisrhc_dev_bot",
    integrations: {
      openai: true,
    }
  });
});

// trigger para probar la coneccion con openai
bot.on("message", async (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  try {
    // Envía el mensaje a la API de OpenAI
    const response = await openai_client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: text }],
    });

    // Envía la respuesta a Telegram
    await bot.sendMessage(
      chatId,
      response?.choices[0]?.message?.content ||
        "No se ha podido obtener una respuesta"
    );
    
  } catch (error) {
    console.error("Error:", error);
    await bot.sendMessage(chatId, "Lo siento, ha ocurrido un error.");
  }
});

// Añadir comando al bot /start para enviar mensaje de inicio
bot.onText(/\/start/, async (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "hola soy un bot de telegram, ¿en qué puedo ayudarte?, Si gustas puedes escribirme un mensaje y te responderé lo mejor que pueda 😊, recuerda que estoy conectado a openai y funciono casi como si fuera ChatGpt"
  );
});

app.listen(port, () => {
  console.log(`Servidor de Telegram funcionando en http://localhost:${port}`);
});

export default app;
