import OpenAI from 'openai';

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

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const vectorStoreId = process.env.OPENAI_VECTOR_STORE_ID;
    const model = 'gpt-5-mini';
    const maxOutputTokens = 2000;
    const topk = null;

    const instructions =
      "You are an 'Ask AI about me' assistant.\n" +
      "Answer using ONLY information found in file_search results from the vector store.\n" +
      "If the answer is not supported by the retrieved text, say you don't know and suggest what to ask next.\n" +
      "Keep answers under 500 words unless exlpicitly asked for detail. Be concise, recruiter-friendly, and factual.\n" +
      "You must always produce a visible answer.\n" +
      "If the answer is unknown, say 'I don't know based on the provided documents.'\n" +
      "Never respond with an empty message.\n" +
      "If a conversation summary is provided, use it as context for the current question.\n" + 
      "Respond using valid Markdown only.\n" +
      "Use headings and bullet lists where appropriate.";

    const toolDef = {
      type: 'file_search',
      vector_store_ids: [vectorStoreId]
    };

    if (topk !== null) {
      toolDef.max_num_results = topk;
    }

    let input = body.question;
    if (body.summary) {
      input = `Conversation summary:\n${body.summary}\n\nCurrent question: ${body.question}`;
    }

    const stream = await client.responses.create({
      model: model,
      instructions: instructions,
      input: input,
      tools: [toolDef],
      max_output_tokens: maxOutputTokens,
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
