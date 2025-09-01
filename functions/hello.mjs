export default ( request, context ) => {
  const allowed = [
    'https://fastinghours.com', 
    'https://flavorawesome.com',
    'http://localhost:8888',
    'http://localhost:8000'
  ];
  const origin = request.headers.get( 'Origin' );

  let headers = {
    'Access-Control-Allow-Methods': 'OPTIONS, GET',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin'
  };

  if( allowed.includes( origin ) ) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  console.log( header );

  if( request.method === 'OPTIONS' ) {
    return {
      statusCode: 200,
      headers,
      body: 'OK'
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
