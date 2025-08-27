import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

const client = new OpenAI( {
  apiKey: process.env.OPENAI_API_KEY
} );

const pinecone = new Pinecone( {
  apiKey: process.env.PINECONE_API_KEY
} );

let index = null; 

async function embedText( text ) {
  const response = await client.embeddings.create( {
    model: 'text-embedding-3-small',
    input: text
  } );
  return response.data[0].embedding;
}

async function askStream( question, topK = 3 ) {
  const embedding = await embedText( question );
  const results = await index.query( {
    vector: embedding,
    topK: topK,
    includeMetadata: true
  } );

  let context = '';
  for( const match of results.matches ) {
    const page = match.metadata?.page || '?';
    const text = match.metadata?.text || '';
    context += `[Page ${page}] ${text}\n---\n`;
  }

  const prompt = `You are an assistant answering questions about Colorado hunting regulations.
Use only the context provided below to answer.
If the answer is not found, say you don't know.
Format your response using Markdown for better readability.

Context:
${context}

Question: ${question}
Answer:`;

  const stream = await client.chat.completions.create( {
    model: 'gpt-4o-mini',
    messages: [{role: 'user', content: prompt}],
    temperature: 1,
    stream: true
  } );

  return stream;
}

export default async ( request, context ) => {
  try {
    const url = new URL( request.url );
    const question = url.searchParams.get( 'question' );

    index = pinecone.index( url.searchParams.get( 'index' ) === null ? 'colorado-big-game-2025' : url.searchParams.get( 'index' ) );    

    if ( !question ) {
      return new Response( JSON.stringify( {error: 'Question parameter is required'} ), {
        status: 400,
        headers: {'Content-Type': 'application/json'}
      } );
    }

    const topK = parseInt( url.searchParams.get( 'top_k' )) || 3;
    const stream = await askStream( question, topK );

    const readable = new ReadableStream( {
      async start( controller ) {
        for await ( const chunk of stream ) {
          const content = chunk.choices[0]?.delta?.content || '';
          if( content ) {
            controller.enqueue( new TextEncoder().encode( content ) );
          }
        }
        controller.close();
      }
    } );

    return new Response( readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    } );
  } catch( error ) {
    console.error( 'Error in query function:', error );
    return new Response(JSON.stringify( {error: error.message} ), {
      status: 500,
      headers: {'Content-Type': 'application/json'}
    } );
  }
}

export const config = {
  path: '/api/hunt/chat'
};
