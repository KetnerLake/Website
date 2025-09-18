import {Resend} from 'resend';

export default async ( request, context ) => {
  /* CORS */
  const allowed = [
    'https://fastinghours.com', 
    'https://flavorawesome.com',
    'https://ketnerlake.com', 
    'http://localhost:8888',
    'http://localhost:8000'
    'http://localhost:5173'
  ];
  const origin = request.headers.get( 'Origin' );

  let headers = {
    'Access-Control-Allow-Methods': 'OPTIONS, POST',
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

    // Honeypot check (bots)
    if( body.company && body.company !== null ) {
      return new Response( JSON.stringify( {error: 'Bot Detected'} ), {
        status: 400,
        statusText: 'Bot detected'
      } );
    }  

    const resend = new Resend( process.env.RESEND_API_KEY );
    const response = await resend.emails.send( {
      from: 'Ketner Lake <feedback@ketnerlake.com>',
      to: ['parkerkrhoyt@gmail.com'],
      subject: `[${body.source}] ${body.subject}`,
      html: `Email: ${body.email}<br>Category: ${body.category}<br>Message:<br>${body.message}`
    } );

    return new Response( response.data.id, {
      headers
    } );
  } catch ( error ) {
    return new Response( error.toString(), {
      status: 500
    } );
  }
};

export const config = {
  path: '/api/message'
};
