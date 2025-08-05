import dotenv from 'dotenv';
dotenv.config();

import { Telegraf } from 'telegraf';
import OpenAI from 'openai';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1) Custom /start handler
bot.start((ctx) => {
  ctx.reply(
    "👋 Hello! I'm AJ, your AI helper. I'm here to listen, support, and share coping strategies. How are you feeling today?"
  );
});

// 2) All other text goes to OpenAI with a system prompt
bot.on('text', async (ctx) => {
  try {
    const userMsg = ctx.message.text;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            "You are a compassionate mental health support assistant. Provide empathetic responses, validate feelings, and offer gentle coping strategies.",
        },
        { role: 'user', content: userMsg },
      ],
    });
    const reply = completion.choices[0].message.content;
    await ctx.reply(reply);
  } catch (err) {
    console.error('❌ OpenAI Error:', err);
    await ctx.reply('Sorry, something went wrong. Please try again.');
  }
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await bot.handleUpdate(req.body, res);
    res.status(200).send('OK');
  } else {
    res.status(200).send('Hello from your AI Telegram Bot!');
  }
}
