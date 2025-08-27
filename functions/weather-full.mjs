export default async ( request, context ) => {
  try {
    const url = new URL( request.url );
    const location = url.searchParams.get( 'location' );    

    const icons = {
      '1000': 'wi:day-sunny',
      '1003': 'wi:day-cloudy',
      '1006': 'wi:cloudy',
      '1009': 'wi:day-sunny-overcast',
      '1030': 'wi:fog',
      '1063': 'wi:wu-rain',
      '1066': 'wi:snow',
      '1069': 'wi:sleet',
      '1072': 'wi:sleet',
      '1087': 'wi:day-lightning',
      '1114': 'wi:snow',
      '1117': 'wi:snow',
      '1135': 'wi:fog',
      '1147': 'wi:fog',
      '1150': 'wi:sleet',
      '1153': 'wi:raindrops',
      '1168': 'wi:sleet',
      '1171': 'wi:sleet',
      '1180': 'wi:raindrops',
      '1183': 'wi:raindrops',
      '1186': 'wi:raindrops',
      '1189': 'wi:wu-rain',
      '1192': 'wi:wu-rain',
      '1195': 'wi:wu-rain',
      '1198': 'wi:sleet',
      '1201': 'wi:sleet',
      '1204': 'wi:sleet',
      '1207': 'wi:sleet',
      '1201': 'wi:sleet',
      '1210': 'wi:snow',
      '1213': 'wi:snow',
      '1216': 'wi:snow',
      '1219': 'wi:snow',      
      '1222': 'wi:snow',      
      '1225': 'wi:snow',      
      '1237': 'wi:sleet',
      '1240': 'wi:raindrops',
      '1243': 'wi:wu-rain',
      '1246': 'wi:wu-rain',
      '1249': 'wi:sleet',
      '1252': 'wi:sleet',
      '1255': 'wi:snow',
      '1258': 'wi:snow',
      '1261': 'wi-sleet',
      '1264': 'wi-sleet',
      '1273': 'wi:raindrops',
      '1276': 'wi:day-lightning',
      '1279': 'wi:day-lightning',
      '1282': 'wi:day-lightning'
    };

    const response = await fetch( `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location}&aqi=no` );
    const data = await response.json();
    data.icons = structuredClone( icons );
    return new Response( JSON.stringify( data ) );
  } catch ( error ) {
    return new Response( error.toString(), {
      status: 500
    } );
  }
};

export const config = {
  path: '/api/weather/full'
};
