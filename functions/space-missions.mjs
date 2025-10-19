import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import Database from 'better-sqlite3';

const require = createRequire(import.meta.url);

export default async ( request, context ) => {
  // CORS
  const allowed = [
    'https://ketnerlake.com',
    'http://localhost:8080',
    'http://localhost:8888'
  ];
  const origin = request.headers.get( 'Origin' );

  let headers = {
    'Access-Control-Allow-Methods': 'OPTIONS, GET',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin'
  };

  if (origin === null || origin === 'null') {
    // Allow same-host or sandboxed contexts
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
    const dbPath = path.resolve( __dirname, 'space_missions.db' );

    // Ensure DB exists
    try {
      await fs.access(dbPath);
    } catch {
      return new Response(JSON.stringify({ error: 'Database not found. Run migrate_space_missions_sqlite.js to create space_missions.db.' }), { status: 500 });
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
