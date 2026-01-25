import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

export default async (request, context) => {
  /* CORS */
  const allowed = [
    'https://kevinhoyt.com',
    'https://ketnerlake.com',
    'http://localhost:8080',
    'http://localhost:8888'
  ];
  const origin = request.headers.get('Origin');

  let headers = {
    'Access-Control-Allow-Methods': 'OPTIONS, POST',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin',
    'Content-Type': 'application/json'
  };

  if (allowed.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else {
    return new Response(JSON.stringify({error: 'Bot Detected'}), {
      status: 400,
      statusText: 'Bot detected'
    });
  }

  if (request.method === 'OPTIONS') {
    return new Response('OK', {
      headers
    });
  }

  /* Method check (bots) */
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({error: 'Method Not Allowed'}), {
      status: 405,
      statusText: 'Method Not Allowed'
    });
  }

  /* Main */
  try {
    const body = await request.json();

    // Honeypot check (bots)
    if (body.company && body.company !== null) {
      return new Response(JSON.stringify({error: 'Bot Detected'}), {
        status: 400,
        statusText: 'Bot detected'
      });
    }

    // Validate required fields
    if (!body.question) {
      return new Response(JSON.stringify({error: 'Question is required'}), {
        status: 400,
        statusText: 'Bad Request',
        headers
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY
    });

    const index = pc.index('about-kevin-hoyt');
    const topK = 3;

    // Create embedding for the question
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: body.question,
      dimensions: 512
    });
    const embedding = embeddingResponse.data[0].embedding;

    // Query Pinecone for similar content
    const queryResponse = await index.query({
      vector: embedding,
      topK: topK,
      includeMetadata: true
    });

    // Build context from results
    let context = '';
    for (const match of queryResponse.matches) {
      const page = match.metadata?.page ?? '?';
      const text = match.metadata?.text ?? '';
      context += `[Page ${page}] ${text}\n---\n`;
    }

    const instructions =
      "You are an 'Ask AI about me' assistant.\n" +
      "Answer using ONLY information found in the context section provided.\n" +
      "If the answer is not supported by the retrieved text, say you don't know and suggest what to ask next.\n" +
      "Keep answers under 500 words unless explicitly asked for detail. Be concise, recruiter-friendly, and factual.\n" +
      "If the answer is unknown, say 'I don't know based on the provided documents.'\n" +
      "Never respond with an empty message.\n" +
      "If a conversation summary is provided, use it as context for the current question.\n" +
      "Respond using valid Markdown only. Use headings and bullet lists where appropriate.";

    let input = `Context:\n${context}\n\nQuestion: ${body.question}`;
    if (body.summary) {
      input = `Conversation summary:\n${body.summary}\n\n${input}`;
    }

    const stream = await openai.responses.create({
      model: 'gpt-5.1',
      instructions: instructions,
      input: input,
      stream: true
    });

    const streamHeaders = {
      ...headers,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    };

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'response.output_text.delta') {
              controller.enqueue(new TextEncoder().encode(event.delta));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      }
    });

    return new Response(readable, {
      headers: streamHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify({error: error.toString()}), {
      status: 500,
      headers
    });
  }
};

export const config = {
  path: '/api/about'
};
