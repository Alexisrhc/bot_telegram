import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const apiOpenAI = process.env.OPENAI_API_KEY;

const openai_client = new OpenAI({
  apiKey: apiOpenAI,
  timeout: 60000,
});

export default openai_client;