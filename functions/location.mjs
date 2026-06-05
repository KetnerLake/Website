export default async ( request, context ) => {
  /* CORS */
  const allowed = [
    'https://kevinhoyt.com', 
    'https://ketnerlake.com',     
    'http://localhost:8888',
    'http://localhost:8000',
    'http://localhost:8080',
    'http://localhost:5173'
  ];
  const origin = request.headers.get( 'Origin' );

  let headers = {
    'Access-Control-Allow-Methods': 'OPTIONS, POST',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin, User-Agent'
  };

  /*
  if( allowed.includes( origin ) ) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else {
    return new Response( JSON.stringify( {error: 'Bot Detected'} ), {
      status: 400,
      statusText: 'Bot detected'
    } );    
  }
  */

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

    if( body.action === 'nearby' ) {
      const url = 'https://places.geo.us-west-2.amazonaws.com/v2/search-nearby';
      const response = await fetch( `${url}?key=${process.env.AWS_LOCATION_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify( {
          MaxResults: 5,
          IntendedUse: 'SingleUse',
          QueryPosition: [body.longitude, body.latitude]
        } )
      } );
      const nearby = await response.json();

      return new Response( JSON.stringify( nearby ), {
        headers
      } );      
    }

    const url = 'https://places.geo.us-west-2.amazonaws.com/v2/suggest';
    const response = await fetch( `${url}?key=${process.env.AWS_LOCATION_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify( {
        AdditionalFeatures: ['Core'],
        MaxResults: 5,
        IntendedUse: 'SingleUse',
	      BiasPosition: [body.longitude, body.latitude],
	      QueryText: body.query
      } )
    } );
    const suggest = await response.json();

    return new Response( JSON.stringify( suggest ), {
      headers
    } );
  } catch ( error ) {
    return new Response( error.toString(), {
      status: 500
    } );
  }
};

export const config = {
  path: '/api/location'
};
