import Database from 'better-sqlite3';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default async ( request, context ) => {
  // CORS
  const allowed = [
    'https://ketnerlake.com',
    'http://localhost:8080'
  ];
  const origin = request.headers.get( 'Origin' );

  let headers = {
    'Access-Control-Allow-Methods': 'OPTIONS, GET',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin'
  };

  if (origin === null || origin === 'null') {
    // Same-host or sandboxed contexts may report Origin as "null"; allow broadly
    headers['Access-Control-Allow-Origin'] = '*';
  } else if( allowed.includes( origin ) ) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else {
    return new Response(JSON.stringify( {error: 'Bot Detected'} ), {
      status: 400,
      statusText: 'Bot detected'
    } );
  }

  if( request.method === 'OPTIONS' ) {
    return new Response( 'OK', {headers} );
  }

  if( request.method !== 'GET' ) {
    return new Response(JSON.stringify( {error: 'Method Not Allowed'} ), {
      status: 405,
      statusText: 'Method Not Allowed'
    } );
  }

  // Paging via SQLite
  try {
    const url = new URL( request.url );
    const page = Math.max(1, parseInt( url.searchParams.get( 'page' ) || '1', 10 ) );
    const pageSize = Math.max( 1, Math.min( 1000, parseInt( url.searchParams.get( 'pageSize' ) || '100', 10 ) ) );

    const __filename = fileURLToPath( import.meta.url );
    const __dirname = path.dirname( __filename );
    
    // For Netlify, try multiple possible paths
    const possiblePaths = [
      path.resolve( __dirname, 'space_missions.db' ),
      path.resolve( process.cwd(), 'functions', 'space_missions.db' ),
      path.resolve( '/var/task/functions', 'space_missions.db' )
    ];
    
    let dbPath = null;
    for (const testPath of possiblePaths) {
      try {
        await fs.access(testPath);
        dbPath = testPath;
        break;
      } catch {
        continue;
      }
    }
    
    if (!dbPath) {
      return new Response(JSON.stringify({ 
        error: 'Database not found. Tried paths: ' + possiblePaths.join(', ') 
      }), { status: 500 });
    }

    const db = new Database(dbPath, { readonly: true });

    try {
      const totalRecords = db.prepare('SELECT COUNT(*) AS c FROM missions;').get().c;
      const totalPages = totalRecords === 0 ? 0 : Math.ceil( totalRecords / pageSize );
      const offset = (page - 1) * pageSize;

      const rows = totalRecords > 0 && offset < totalRecords
        ? db.prepare('SELECT id, date, mission_id, destination, status, crew_size, duration_days, success_rate, security_code FROM missions ORDER BY id ASC LIMIT ? OFFSET ?;').all(pageSize, offset)
        : [];

      return new Response(
        JSON.stringify( {
          page,
          pageSize,
          totalRecords,
          totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
          data: rows
        } ), {
          headers: {
            'Content-Type': 'application/json',
            ... headers
          }
        } );
    } finally {
      db.close();
    }
  } catch( error ) {
    return new Response( error.toString(), {status: 500} );
  }
};

export const config = {
  path: '/api/space-missions'
};
