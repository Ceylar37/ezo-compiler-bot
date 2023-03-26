// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Log } from '@src/global/types/Log';
import type { NextApiRequest, NextApiResponse } from 'next';
import TelegramBot from 'node-telegram-bot-api';
import stripAnsi from 'strip-ansi';

let consoleLog: string = '';
// @ts-ignore
process.stdout.wr = process.stdout.write;
// @ts-ignore
process.stdout.er = process.stderr.write;

// @ts-ignore
process.stdout.write = function (mes, c) {
  consoleLog += stripAnsi(mes as string);
  // @ts-ignore
  // process.stdout.wr(mes, c);
};

// @ts-ignore
process.stderr.write = function (mes, c) {
  consoleLog += stripAnsi(mes as string);
  // @ts-ignore
  // process.stdout.er(mes, c);
};

const token = process.env.TOKEN;
const password = process.env.PASSWORD;

let bot: TelegramBot | null = null;

let log: Log = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = JSON.parse(req.body);
    if (body.password !== password) {
      res.status(401).json({ error: 'incorrect password' });
      return;
    }
  } catch (e) {
    res.status(401).json({ error: 'incorrect password' });
    return;
  }
  if (bot === null) {
    bot = new TelegramBot(token!, { polling: true });
    bot.on('message', msg => {
      if (!bot) {
        throw new Error('no bot instance');
      }
      consoleLog = '';
      const text = msg.text ?? '';
      const chatId = msg.chat.id;
      try {
        eval(text);
      } catch (e) {
        console.log(e);
      } finally {
        bot.sendMessage(chatId, consoleLog);
        log.unshift([text, consoleLog]);
        if (log.length > 10) {
          log = log.slice(0, 10);
        }
      }
    });
  }

  res.status(200).json(log);
}
