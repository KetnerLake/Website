import { createClient } from '@supabase/supabase-js';

export default async ( request, context ) => {
  const allowed = [
    'https://fastinghours.com',
    'https://www.fastinghours.com',    
    'https://app.fastinghours.com',
    'https://flavorawesome.com',
    'https://www.flavorawesome.com',    
    'https://app.flavorawesome.com',
    'https://kevinhoyt.com',
    'https://www.kevinhoyt.com'
  ];
  const origin = request.headers.get( 'Origin' );

  let headers = {
    'Access-Control-Allow-Methods': 'OPTIONS, POST',
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

  if( request.method !== 'POST' ) {
    return new Response( 'Method Not Allowed', {
      status: 405,
      headers
    } );
  }

  const supabase = createClient(
    Netlify.env.get( 'SUPABASE_URL' ),
    Netlify.env.get( 'SUPABASE_KEY' )
  );

  try {
    const body = await request.json();
    body.user_agent = request.headers.get( 'User-Agent' );
    body.accept_language = request.headers.get( 'Accept-Language' );

    const { data, error: dbError } = await supabase
      .from( 'Ping' )
      .insert( body )
      .select()
      .single();

    if( dbError ) throw new Error( dbError.message );

    return new Response( JSON.stringify( data ), {
      headers: {
        'Content-Type': 'application/json'
      }
    } );
  } catch ( error ) {
    return new Response( error.toString(), {
      status: 500
    } );
  }
}

export const config = {
  path: '/api/pixel'
};
