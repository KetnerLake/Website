import { getStore } from "@netlify/blobs";

export default async ( request, context ) => {
  const allowed = [
    'https://kevinhoyt.com'
  ];
  const origin = request.headers.get( 'Origin' );

  let headers = {
    'Access-Control-Allow-Methods': 'OPTIONS, GET',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin'
  };

  if( allowed.includes( origin ) ) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  if( request.method === 'OPTIONS' ) {
    return new Response( 'OK', {
      headers
    } );
  }

  const store = getStore( 'kevinhoyt-com' );  

  if( request.method === 'POST' ) {
    // await store.setJSON( 'status.json', [] );

    const body = await request.json();

    if( body.password !== process.env.STATUS_PASSWORD ) {
      return Response.json( {error: 'Unauthorized'}, {status: 401} );
    }

    if( !body.text?.trim() ) {
      return Response.json( {error: 'Missing status text'}, {status: 400} );
    }

    const existing =
      ( await store.get( 'status.json', {type: 'json'} ) ) ?? [];

    const entry = {
      text: body.text.trim(),
      created: new Date().toISOString()
    };

    const updated = [entry, ... existing];

    await store.setJSON( 'status.json', updated );

    return new Response( JSON.stringify( updated ), {
      headers
    } );
  }

  const status = await store.get( 'status.json' );

  if( status === null ) {
    return new Response( JSON.stringify( [] ), {
      headers
    } );
  }

  return new Response( status, {
    headers
  } );  
}

export const config = {
  path: '/api/status'
};
