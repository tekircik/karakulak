import { serve } from 'bun';

import run from './generate';

serve({
  port: process.env.PORT || 3000,
  fetch(req) {
    const { pathname } = new URL(req.url);
    if (req.method === 'POST' && pathname === '/gemini') {
      return handleGemini(req);
    }
    return new Response(JSON.stringify({ message: 'You missed the exit.' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
});

async function handleGemini(req: any) {
  try {
    const data = await req.json();
    const message = data.message;
    const result = await run(message);

    return new Response(JSON.stringify({ result: result }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error while handling action:', error);
    return new Response(
      JSON.stringify({ message: 'Something bad happened.' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
