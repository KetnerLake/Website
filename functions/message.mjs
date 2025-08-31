import {Resend} from 'resend';

export default async ( request, context ) => {
  const allowed = ['https://fastinghours.com', 'https://flavorawesome.com'];
  const origin = request.headers.origin;

  let headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if( allowed.includes( origin ) ) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  if( request.httpMethod === 'OPTIONS' ) {
    return {
      statusCode: 200,
      headers,
      body: "OK",
    };
  }  

  try {
    const body = await request.json();
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
