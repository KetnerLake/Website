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
    "start",
    "stop",
    "track",
    "tag",
    "untag",
    "retag",
    "modifyStart",
    "modifyEnd",
    "move",
    "lengthen",
    "shorten",
    "resize",
    "split",
    "merge",
    "summary",
    "unknown",
  ] ),
  confidence: z.number().min( 0 ).max( 1 ),
  command: z.record( z.string(), z.unknown() ).catch( {} ),
  assumptions: z.array( z.string() ).catch( [] ),
  needsConfirmation: z.boolean(),
  confirmationQuestion: z.string().nullable().catch( null ),
} );

async function loadSkillMarkdown() {
  const __filename = fileURLToPath( import.meta.url );
  const __dirname = path.dirname( __filename );

  const possiblePaths = [
    path.resolve( __dirname, 'time-prompt.md' ),
    path.resolve( process.cwd(), 'functions', 'time-prompt.md' ),
    path.resolve( '/var/task/functions', 'time-prompt.md' )
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

async function getIntent( { skillPrompt, message } ) {
  const response = await client.chat.completions.create( {
    model: MODEL,
    temperature: 0.1,
    messages: [
      {
        role: "developer",
        content: skillPrompt,
      },
      {
        role: "user",
        content: message,
      },
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
                "start",
                "stop",
                "track",
                "tag",
                "untag",
                "retag",
                "modifyStart",
                "modifyEnd",
                "move",
                "lengthen",
                "shorten",
                "resize",
                "split",
                "merge",
                "summary",
                "unknown",
              ],
            },
            confidence: {
              type: "number",
            },
            command: {
              type: "object",
              additionalProperties: true,
            },
            assumptions: {
              type: "array",
              items: { type: "string" },
            },
            needsConfirmation: {
              type: "boolean",
            },
            confirmationQuestion: {
              type: ["string", "null"],
            },
          },
          required: ["intent", "confidence", "command", "assumptions", "needsConfirmation", "confirmationQuestion"],
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
      `Model returned JSON that failed validation.\nRAW: ${JSON.stringify( parsed, null, 2 )}\nERRORS: ${JSON.stringify( result.error.format(), null, 2 )}`
    );
  }

  return result.data;
}

export default async ( request, context ) => {
  const allowed = [
    'https://app.fastinghours.com',
    'https://fastinghours.com',
    'http://localhost:5173',
    'http://localhost:8000'
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

    if ( !message ) {
      return new Response( JSON.stringify( { error: 'Missing required field: message' } ), {
        status: 400,
        headers
      } );
    }

    const skillPrompt = await loadSkillMarkdown();
    const intent = await getIntent( { skillPrompt, message } );

    return new Response( JSON.stringify( intent ), { headers } );
  } catch ( error ) {
    return new Response( JSON.stringify( { error: error.message } ), {
      status: 500,
      headers
    } );
  }
};

export const config = {
  path: '/api/time'
};
