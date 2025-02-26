import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold
} from '@google/generative-ai';

const googleApiKey = process.env.GOOGLE_AI_KEY as string;
const genAI = new GoogleGenerativeAI(googleApiKey);

// Simple in-memory cache
const cache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours in milliseconds

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-lite-001',
  systemInstruction:
    "You are Karakulak, a helpful AI agent working with Tekir search engine. You will receive some questions and try to answer them in a short paragraph. Make sure that you state facts. If you can't or don't want to answer a question, if you think it is against your Terms of Service, if you think that the searched term is not a question or if you can't find information on the question or you don't understand it, say: \"Sorry, I can't help you with that.\" or its equivalent in the input's language."
});

const generationConfig = {
  temperature: 0,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 200,
  responseMimeType: 'text/plain'
};

export async function gemini(message: string) {
  // Check cache first
  const cached = cache.get(message);
  const now = Date.now();

  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.response;
  }

  // If not in cache or expired, get new response
  const chatSession = model.startChat({
    generationConfig
  });
  const result = await chatSession.sendMessage(message);
  const response = result.response.text();

  // Store in cache
  cache.set(message, {
    response,
    timestamp: now
  });

  return response;
}