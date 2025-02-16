import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message } = req.body;

    try {
      const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: message,
          max_tokens: 150,
        }),
      });

      const data = await response.json();
      res.status(200).json({ reply: data.choices[0].text.trim() });
    } catch (error) {
      console.error('Error communicating with AI:', error);
      res.status(500).json({ error: 'Error communicating with AI' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}