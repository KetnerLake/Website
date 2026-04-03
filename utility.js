export const KetnerLake = {
  
  BASE_URL: 'https://ketnerlake.com/api',

  cigar: {
    novice() {
      return fetch( `${this.BASE_URL}/cigar/novice` )
      .then( ( response ) => response.json() )
    },
    proficient( favorites ) {
      return fetch( `${this.BASE_URL}/cigar/proficient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( favorites )
      } )
      .then( ( response ) => response.json() );           
    },
    expert( favorites ) {
      return fetch( `${this.BASE_URL}/cigar/expert`, {
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
    let url = `${this.BASE_URL}/hello`;

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

      return fetch( `${this.BASE_URL}/hunt/chat?question=${question}` )
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
    return fetch( `${this.BASE_URL}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( {source, email, category, subject, message: body} )
    } )
    .then( ( response ) => response.text() );
  },

  pixel: {
    ping( screen_name = null, event_name = null, event_details = null, event_time = new Date(), screen_height = null, screen_width = null, user_agent = null, viewport_height = null, viewport_width = null, accept_language = null ) {

    },
    report( start = null, end = null, size = 1000, page = 1 ) {

    }
  },

  weather: {
    full( latitude, longitude ) {
      return fetch( `${this.BASE_URL}/weather/full?location=${latitude},${longitude}` )
      .then( ( response ) => response.json() );
    },  
    summary( latitude, longitude ) {
      return fetch( `${this.BASE_URL}/weather/summary?location=${latitude},${longitude}` )
      .then( ( response ) => response.json() );
    }
  }

}

export default KetnerLake;
