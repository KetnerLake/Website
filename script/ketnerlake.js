export const KetnerLake = {

  cigar: {
    novice() {
      return fetch( `/api/cigar/novice` )
      .then( ( response ) => response.json() )
    },
    proficient( favorites ) {
      return fetch( '/api/cigar/proficient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( favorites )
      } )
      .then( ( response ) => response.json() );           
    },
    expert( favorites ) {
      return fetch( '/api/cigar/expert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( favorites )
      } )
      .then( ( response ) => response.json() );           
    }
  },

  hello( name = null ) {
    let url = '/api/hello';

    if( name !== null ) {
      url = `${url}?name=${name}`;
    }

    return fetch( url )
    .then( ( response ) => response.text() );
  },

  hunt: {
    chat( question, output ) {
      output.textContent = null;
      output.classList.add( 'streaming' );

      return fetch( `/api/hunt/chat?question=${question}` )
      .then( ( response ) => response.body.getReader() )
      .then( async ( reader ) => {
        const decoder = new TextDecoder();

        while( true ) {
          const {done, value} = await reader.read();
          if( done ) break;

          const chunk = decoder.decode( value, {stream: true} );
          output.textContent = output.textContent + chunk;
          output.scrollTop = output.scrollHeight;

          // output.scrollIntoView( {behavior: 'smooth', block: 'end'} );
        }      
      } );
    }
  },

  message( email, subject, body, source = null, category = null ) {
    return fetch( '/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( {source, email, category, subject, message: body} )
    } )
    .then( ( response ) => response.text() );
  },

  weather: {
    full( latitude, longitude ) {
      return fetch( `/api/weather/full?location=${latitude},${longitude}` )
      .then( ( response ) => response.json() );
    },  
    summary( latitude, longitude ) {
      return fetch( `/api/weather/summary?location=${latitude},${longitude}` )
      .then( ( response ) => response.json() );
    }
  }

}

export default KetnerLake;
