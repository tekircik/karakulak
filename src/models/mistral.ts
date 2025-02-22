import OpenAI from 'openai';

// Simple in-memory cache
const cache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours in milliseconds

const scalewayClient = new OpenAI({
    baseURL: 'https://api.scaleway.ai/d5285684-446f-4dfb-b692-8442ae1f1ff5/v1',
    apiKey: process.env.SCALEWAY_AI_KEY as string
});

export async function mistral(message: string) {
    // Check cache first
    const cached = cache.get(message);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < CACHE_TTL) {
        return cached.response;
    }

    const stream = await scalewayClient.chat.completions.create({
        model: 'mistral-nemo-instruct-2407',
        messages: [
            {
                role: 'system',
                content:
                    "You are Karakulak, a helpful AI agent working with Tekir search engine. You will receive some questions and try to answer them in a short paragraph. Make sure that you state facts. If you can't or don't want to answer a question, if you think it is against your Terms of Service, if you think that the searched term is not a question or if you can't find information on the question or you don't understand it, say: \"Sorry, I can't help you with that.\" or its equivalent in the input's language."
            },
            { role: 'user', content: message }
        ],
        max_tokens: 200,
        temperature: 0.01,
        top_p: 0.4,
        presence_penalty: 0,
        stream: false
    });

    const response = stream.choices[0].message.content;
    // Store in cache
    cache.set(message, {
        response: response as string,
        timestamp: now
    });
    
    return response;
}