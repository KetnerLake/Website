export default ( request, context ) => {
  const allowed = [
    'https://fastinghours.com', 
    'https://flavorawesome.com'
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

  try {
    const url = new URL( request.url );
    const name = url.searchParams.get( 'name' ) || 'World';

    return new Response( `Hello, ${name}`, {
      headers
    } );
  } catch ( error ) {
    return new Response( error.toString(), {
      status: 500
    } );
  }
}

export const config = {
  path: '/api/hello'
};
