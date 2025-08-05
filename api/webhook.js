import dotenv from 'dotenv';
dotenv.config();

import { Telegraf } from 'telegraf';
import OpenAI from 'openai';

// Initialize with env vars
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Handle incoming text messages
bot.on('text', async (ctx) => {
  try {
    const userMsg = ctx.message.text;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMsg }],
    });
    const reply = completion.choices[0].message.content;
    await ctx.reply(reply);
  } catch (err) {
    console.error('❌ OpenAI Error:', err);
    await ctx.reply('Sorry, something went wrong.');
  }
});

// Vercel serverless function entrypoint
export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Process the incoming update
    await bot.handleUpdate(req.body, res);
    res.status(200).send('OK');
  } else {
    res.status(200).send('Hello from your AI Telegram Bot!');
  }
}
