import OpenAI from "openai";
import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MODEL = "gpt-4o-mini";

const client = new OpenAI( {
  apiKey: process.env.OPENAI_API_KEY
} );

const IntentSchema = z.object( {
  intent: z.enum( [
    "start_fast",
    "end_fast",
    "show_current",
    "show_history",
    "show_trend",
    "log_entry",
    "edit_entry",
    "delete_entry",
    "answer_question",
    "about",
    "none",
    "clarify",
  ] ),
  arguments: z.record( z.string(), z.unknown() ),
  confidence: z.number().min( 0 ).max( 1 ),
  clarification_question: z.string().nullable(),
} );

async function loadSkillMarkdown() {
  const __filename = fileURLToPath( import.meta.url );
  const __dirname = path.dirname( __filename );

  const possiblePaths = [
    path.resolve( __dirname, 'prompt.md' ),
    path.resolve( process.cwd(), 'functions', 'prompt.md' ),
    path.resolve( '/var/task/functions', 'prompt.md' )
  ];

  let skillPath = null;
  for ( const testPath of possiblePaths ) {
    try {
      await fs.access( testPath );
      skillPath = testPath;
      break;
    } catch {
      continue;
    }
  }

  if ( !skillPath ) {
    throw new Error( 'Skill file not found. Tried paths: ' + possiblePaths.join( ', ' ) );
  }

  const contents = await fs.readFile( skillPath, 'utf8' );
  const trimmed = contents.trim();

  if ( !trimmed ) {
    throw new Error( `Skill file is empty: ${skillPath}` );
  }

  return trimmed;
}

async function getIntent( { skillPrompt, message, messages } ) {
  const turns = Array.isArray( messages )
    ? messages
    : [ { role: "user", content: message } ];

  const response = await client.chat.completions.create( {
    model: MODEL,
    temperature: 0.1,
    messages: [
      {
        role: "developer",
        content: skillPrompt,
      },
      ...turns,
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "intent_response",
        strict: false,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            intent: {
              type: "string",
              enum: [
                "start_fast",
                "end_fast",
                "show_current",
                "show_history",
                "show_trend",
                "log_entry",
                "edit_entry",
                "delete_entry",
                "answer_question",
                "about",
                "none",
                "clarify",
              ],
            },
            arguments: {
              type: "object",
              additionalProperties: true,
            },
            confidence: {
              type: "number",
            },
            clarification_question: {
              type: ["string", "null"],
            },
          },
          required: ["intent", "arguments", "confidence", "clarification_question"],
        },
      },
    },
  } );

  const raw = response.choices?.[0]?.message?.content;

  if ( !raw ) {
    throw new Error( "No content returned from the model." );
  }

  let parsed;
  try {
    parsed = JSON.parse( raw );
  } catch ( error ) {
    throw new Error( `Model returned invalid JSON: ${raw}` );
  }

  const result = IntentSchema.safeParse( parsed );

  if ( !result.success ) {
    throw new Error(
      `Model returned JSON that failed validation:\n${JSON.stringify(
        result.error.format(),
        null,
        2
      )}`
    );
  }

  return result.data;
}

export default async ( request, context ) => {
  const allowed = [
    'https://app.fastinghours.com',
    'https://fastinghours.com',
    'http://localhost:5173
  ];
  const origin = request.headers.get( 'Origin' );

  let headers = {
    'Access-Control-Allow-Methods': 'OPTIONS, POST',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin',
    'Content-Type': 'application/json'
  };

  if ( allowed.includes( origin ) ) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  if ( request.method === 'OPTIONS' ) {
    return new Response( 'OK', { headers } );
  }

  try {
    const body = await request.json();
    const message = body?.message?.trim();
    const messages = Array.isArray( body?.messages ) && body.messages.length > 0
      ? body.messages
      : null;

    if ( !messages && !message ) {
      return new Response( JSON.stringify( { error: 'Missing required field: message or messages' } ), {
        status: 400,
        headers
      } );
    }

    const skillPrompt = await loadSkillMarkdown();
    const intent = await getIntent( { skillPrompt, message, messages } );

    return new Response( JSON.stringify( intent ), { headers } );
  } catch ( error ) {
    return new Response( JSON.stringify( { error: error.message } ), {
      status: 500,
      headers
    } );
  }
};

export const config = {
  path: '/api/fasting'
};
