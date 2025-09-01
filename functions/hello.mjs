export default ( request, context ) => {
  const allowed = [
    'https://fastinghours.com', 
    'https://flavorawesome.com',
    'http://localhost:8888',
    'http://localhost:8000'
  ];
  const origin = request.headers.origin;
  console.log( request.headers.origin );

  let headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if( allowed.includes( origin ) ) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  if( request.method === 'OPTIONS' ) {
    return {
      statusCode: 200,
      headers,
      body: "OK",
    };
  }

  try {
    const url = new URL( request.url );
    const name = url.searchParams.get( 'name' ) || 'World';

    return new Response( `Hello, ${name}` );
  } catch ( error ) {
    return new Response( error.toString(), {
      status: 500
    } );
  }
}

export const config = {
  path: '/api/hello'
};
