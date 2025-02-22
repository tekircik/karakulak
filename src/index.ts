import { serve } from 'bun';

import { gemini } from './models/gemini';
import { llama } from './models/llama';
import { mistral } from './models/mistral';

serve({
  port: process.env.PORT || 3000,
  fetch(req) {
    // Handle CORS preflight request
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': 'https://tekir.co',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }
    const { pathname } = new URL(req.url);
    if (req.method === 'POST' && pathname === '/gemini') {
      return handleGemini(req);
    }
    if (req.method === 'POST' && pathname === '/llama') {
      return handleLlama(req);
    }
    if (req.method === 'POST' && pathname === '/mistral') {
      return handleMistral(req);
    }
    return new Response(JSON.stringify({ message: 'You missed the exit.' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://tekir.co'
      }
    });
  }
});

async function handleGemini(req: any) {
  try {
    const data = await req.json();
    const message = data.message;
    const result = await gemini(message);

    return new Response(JSON.stringify({ result: result }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://tekir.co'
      }
    });
  } catch (error) {
    console.error('Error while handling action:', error);
    return new Response(
      JSON.stringify({ message: 'Something bad happened.' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://tekir.co'
        }
      }
    );
  }
}

async function handleLlama(req: any) {
  try {
    const data = await req.json();
    const message = data.message;
    const result = await llama(message);

    return new Response(JSON.stringify({ result: result }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://tekir.co'
      }
    });
  } catch (error) {
    console.error('Error while handling action:', error);
    return new Response(
      JSON.stringify({ message: 'Something bad happened.' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://tekir.co'
        }
      }
    );
  }
}

async function handleMistral(req: any) {
  try {
    const data = await req.json();
    const message = data.message;
    const result = await mistral(message);

    return new Response(JSON.stringify({ result: result }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://tekir.co'
      }
    });
  } catch (error) {
    console.error('Error while handling action:', error);
    return new Response(
      JSON.stringify({ message: 'Something bad happened.' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://tekir.co'
        }
      }
    );
  }
}