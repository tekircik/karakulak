import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://tekir.co',
    'X-Title': 'Tekir Search',
  },
});

// Simple in-memory cache
const cache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours in milliseconds

const generationConfig = {
  temperature: 0,
  top_p: 0.95,
  max_tokens: 200,
};

export async function gemini(message: string): Promise<string> {
  const now = Date.now();
  const cached = cache.get(message);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.response;
  }

  const response = await openai.chat.completions.create({
    model: 'google/gemini-2.0-flash-lite-001',
    ...generationConfig,
    messages: [
      {
        role: 'system',
        content:
          'You are Karakulak, a helpful AI agent working with Tekir search engine. You will receive some questions and try to answer them in a short paragraph. Make sure that you state facts. If you can\'t or don\'t want to answer a question, if you think it is against your Terms of Service, if you think that the searched term is not a question or if you can\'t find information on the question or you don\'t understand it, say: "Sorry, I can\'t help you with that." or its equivalent in the input\'s language.',
      },
      {
        role: 'user',
        content: message,
      },
    ],
    stream: false,
  });

  const answer = response.choices[0].message.content;
  cache.set(message, { response: answer ?? 'Sorry, I can\'t help you with that.', timestamp: now });
  return answer ?? "Sorry, I can't help you with that.";
}
