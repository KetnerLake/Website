export default ( request, context ) => {
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
