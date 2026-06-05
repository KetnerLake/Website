import { getStore } from "@netlify/blobs";

const ALLOWED_ORIGINS = new Set( [
  'https://kevinhoyt.com',
  'http://localhost:8080',
  'http://localhost:8888',
  'http://localhost:5173'
] );

const BASE_HEADERS = {
  'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin, Authorization'
};

const store = getStore( 'kevinhoyt-com' );

function corsHeaders( origin ) {
  if( !ALLOWED_ORIGINS.has( origin ) ) return {... BASE_HEADERS};
  return {... BASE_HEADERS, 'Access-Control-Allow-Origin': origin};
}

async function getStatus() {
  return ( await store.get( 'status.json', {type: 'json'} ) ) ?? [];
}

export default async ( request ) => {
  const headers = corsHeaders( request.headers.get( 'Origin' ) );

  if( request.method === 'OPTIONS' ) {
    return new Response( 'OK', { headers } );
  }

  const mutating = request.method === 'POST'
    || request.method === 'PUT'
    || request.method === 'DELETE';

  let body;
  if( mutating ) {
    const auth = request.headers.get( 'Authorization' )?.replace( 'Bearer ', '' );

    if( auth !== process.env.STATUS_PASSWORD ) {
      return new Response( JSON.stringify( {error: 'Unauthorized'} ), {status: 401, headers} );
    }

    body = await request.json();
  }

  if( request.method === 'POST' ) {
    if( body.clear ) {
      await store.setJSON( 'status.json', [] );
      return new Response( '[]', {headers} );
    }

    if( !body.text?.trim() ) {
      return new Response( JSON.stringify( {error: 'Missing status text'} ), {status: 400, headers} );
    }

    if( !Array.isArray( body.tags ) || body.tags.length === 0 ) {
      return new Response( JSON.stringify( {error: 'Missing status tags'} ), {status: 400, headers} );
    }

    const existing = await getStatus();
    const entry = {
      id: crypto.randomUUID(),
      tags: body.tags,
      text: body.text.trim(),
      started: body.started ? new Date( body.started ).toISOString() : new Date().toISOString(),
      latitude: body.latitude ?? null,
      longitude: body.longitude ?? null,
      place: body.place ?? null,
      place_id: body.place_id ?? null
    };
    const updated = [entry, ... existing];

    await store.setJSON( 'status.json', updated );
    return new Response( JSON.stringify( updated ), { headers } );
  }

  if( request.method === 'PUT' ) {
    if( !body.id ) {
      return new Response( JSON.stringify( {error: 'Missing status id'} ), {status: 400, headers} );
    }

    const existing = await getStatus();
    const index = existing.findIndex( e => e.id === body.id );

    if( index === -1 ) {
      return new Response( JSON.stringify( {error: 'Status not found'} ), {status: 404, headers} );
    }

    const updated = [... existing];
    updated[index] = {
      ... updated[index],
      ... ( Array.isArray( body.tags ) && body.tags.length > 0 && { tags: body.tags } ),
      ... ( body.text?.trim() && { text: body.text.trim() } ),
      ... ( body.started && { started: new Date( body.started ).toISOString() } ),
      ... ( 'latitude' in body && { latitude: body.latitude ?? null } ),
      ... ( 'longitude' in body && { longitude: body.longitude ?? null } ),
      ... ( 'place' in body && { place: body.place ?? null } ),      
      ... ( 'place_id' in body && { place_id: body.place_id ?? null } )            
    };

    await store.setJSON( 'status.json', updated );
    return new Response( JSON.stringify( updated ), {headers} );
  }

  if( request.method === 'DELETE' ) {
    if( !body.id ) {
      return new Response( JSON.stringify( {error: 'Missing status id'} ), {status: 400, headers} );
    }

    const existing = await getStatus();
    const updated = existing.filter( e => e.id !== body.id );

    if( updated.length === existing.length ) {
      return new Response( JSON.stringify( {error: 'Status not found'} ), {status: 404, headers} );
    }

    await store.setJSON( 'status.json', updated );
    return new Response( JSON.stringify( updated ), { headers } );
  }

  const status = await store.get( 'status.json' );
  return new Response( status ?? '[]', {headers} );
}

export const config = {
  path: '/api/status'
};
