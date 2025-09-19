export default async ( request, context ) => {
  const allowed = [
    'https://fastinghours.com', 
    'https://flavorawesome.com',
    'https://ketnerlake.com', 
    'http://localhost:8888',
    'http://localhost:8000',
    'http://localhost:5173'
  ];
  const origin = request.headers.get( 'Origin' );

  let headers = {
    'Access-Control-Allow-Methods': 'OPTIONS, GET',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin'
  };

  if( allowed.includes( origin ) ) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else {
    return new Response( JSON.stringify( {error: 'Bot Detected'} ), {
      status: 400,
      statusText: 'Bot detected'
    } );    
  }

  if( request.method === 'OPTIONS' ) {
    return new Response( 'OK', {
      headers
    } );
  }

  /* Method check (bots) */
  if( request.method !== 'POST' ) {
    return new Response( JSON.stringify( {error: 'Method Not Allowed'} ), {
      status: 405,
      statusText: 'Method Not Allowed'
    } );
  }  

  /* Main */
  try {
    const body = await request.json();

    let response = await fetch( `https://${body.server}.dexie.cloud/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( {
        grant_type: 'client_credentials',
        scopes: [
          'ACCESS_DB',
          'GLOBAL_READ',
          'GLOBAL_WRITE'
        ],
        client_id: process.env.DEXIE_CLIENT_ID_FH,
        client_secret: process.env.DEXIE_CLIENT_SECRET_FH
      } )
    } );

    let data = await response.json();
    const token = data.accessToken;

    response = await fetch( `https://${body.server}.dexie.cloud/users/${body.email}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    } );

    data = response.ok ? await response.json() : null;
    return new Response( JSON.stringify( data ), {
      headers
    } );
  } catch ( error ) {
    return new Response( error.toString(), {
      status: 500
    } );
  }
}

export const config = {
  path: '/api/dexie/check'
};
