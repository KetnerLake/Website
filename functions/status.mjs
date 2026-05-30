import { getStore } from "@netlify/blobs";

export default async ( request, context ) => {
  const allowed = [
    'https://kevinhoyt.com',
    'http://localhost:8080'
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
    const body = await request.json();

    if( body.password !== process.env.STATUS_PASSWORD ) {
      return Response.json( {error: 'Unauthorized'}, {status: 401} );
    }

    if( body.clear ) {
      await store.setJSON( 'status.json', [] );    
      return new Response( JSON.stringify( [] ), {
        headers
      } );        
    }

    if( !body.subject?.trim() ) {
      return Response.json( {error: 'Missing status subject'}, {status: 400} );
    }

    if( !body.activity?.trim() ) {
      return Response.json( {error: 'Missing status activity'}, {status: 400} );
    }

    const existing =
      ( await store.get( 'status.json', {type: 'json'} ) ) ?? [];

    const entry = {
      activity: body.activity.trim(),
      subject: body.subject.trim(),
      started: new Date().toISOString()
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
