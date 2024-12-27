import express, { Request, Response } from "express";
import openai_client from "./libs/openai";
import TelegramBot from "node-telegram-bot-api";
import bot from "./libs/telegram";
import { getUserContext, saveUserContext } from "./libs/services";

const app = express();

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
    },
  });
});

// Añadir comando al bot /start para enviar mensaje de inicio
bot.onText(/\/start/, async (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "hola soy un bot de telegram, ¿en qué puedo ayudarte?, Si gustas puedes escribirme un mensaje y te responderé lo mejor que pueda 😊, recuerda que estoy conectado a openai y funciono casi como si fuera ChatGpt"
  );
});

/**
 * trigger para probar la conexión con openai
 * @param msg
 */
bot.on("message", async (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  try {
    // Envía el mensaje a la API de OpenAI
    const previousContext = getUserContext(chatId);

    const response = await openai_client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        ...previousContext.map((context) => ({
          role: context.role as "user",
          content: context.content,
        })),
        { role: "system", content: text },
      ],
    });

    const newContext = [
      ...previousContext,
      { role: "user", content: text },
      {
        role: "assistant",
        content: response.choices[0].message.content || "",
      },
    ];
    
    saveUserContext(chatId, newContext);

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

export default app;
