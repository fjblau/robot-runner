import { kv } from '@vercel/kv';

const KEY = 'highscores';
const MAX_SCORES = 10;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const raw = await kv.zrange(KEY, 0, MAX_SCORES - 1, { rev: true, withScores: true });
    const scores = [];
    for (let i = 0; i < raw.length; i += 2) {
      const member = typeof raw[i] === 'string' ? JSON.parse(raw[i]) : raw[i];
      const score = Number(raw[i + 1]);
      scores.push({ name: member.name, score, date: member.date });
    }
    return res.status(200).json(scores);
  }

  if (req.method === 'POST') {
    const { name, score } = req.body ?? {};
    if (!name || typeof score !== 'number') {
      return res.status(400).json({ error: 'name and score are required' });
    }
    const member = JSON.stringify({ name: String(name).slice(0, 20), date: new Date().toISOString() });
    await kv.zadd(KEY, { score, member });
    await kv.zremrangebyrank(KEY, 0, -(MAX_SCORES + 1));
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
