import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const WEATHER_API_KEY = Deno.env.get('WEATHER_API_KEY');
const AURORA_API_KEY = Deno.env.get('AURORA_API_KEY');

serve(async (req) => {
  try {
    const { latitude, longitude } = await req.json();

    // Get current weather
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
    );
    const weatherData = await weatherResponse.json();

    // Get forecast for aurora prediction
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
    );
    const forecastData = await forecastResponse.json();

    // Get aurora forecast
    const auroraResponse = await fetch(
      `https://api.aurora-service.eu/0.1/forecast.json?lat=${latitude}&lon=${longitude}&apikey=${AURORA_API_KEY}`
    );
    const auroraData = await auroraResponse.json();

    // Calculate aurora probability based on weather and KP index
    const auroraProb = calculateAuroraProbability(
      auroraData.kp_index,
      forecastData.list[0].clouds.all,
      weatherData.weather[0].id
    );

    // Calculate sun times
    const { sunrise, sunset } = calculateSunTimes(latitude, longitude, new Date());

    const response = {
      temperature: weatherData.main.temp,
      condition: weatherData.weather[0].description,
      windSpeed: weatherData.wind.speed,
      precipitation: weatherData.rain ? weatherData.rain['1h'] * 100 : 0,
      cloudCover: weatherData.clouds.all,
      visibility: weatherData.visibility,
      pressure: weatherData.main.pressure,
      humidity: weatherData.main.humidity,
      auroraForecast: {
        probability: auroraProb,
        intensity: getAuroraIntensity(auroraData.kp_index),
        kpIndex: auroraData.kp_index,
      },
      forecast: forecastData.list.slice(0, 8).map((item: any) => ({
        time: item.dt_txt,
        temperature: item.main.temp,
        condition: item.weather[0].description,
        precipitation: item.pop * 100,
      })),
      sunrise: sunrise.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      sunset: sunset.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      dayLength: calculateDayLength(sunrise, sunset),
    };

    return new Response(
      JSON.stringify(response),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

function calculateAuroraProbability(
  kpIndex: number,
  cloudCover: number,
  weatherId: number
): number {
  // Base probability from KP index
  let probability = (kpIndex / 9) * 100;

  // Reduce probability based on cloud cover
  probability *= (100 - cloudCover) / 100;

  // Reduce probability based on weather conditions
  if (weatherId >= 200 && weatherId < 600) {
    // Thunderstorm, drizzle, rain
    probability *= 0.2;
  } else if (weatherId >= 600 && weatherId < 700) {
    // Snow
    probability *= 0.4;
  } else if (weatherId >= 700 && weatherId < 800) {
    // Atmosphere (mist, fog, etc.)
    probability *= 0.6;
  }

  return Math.round(probability);
}

function calculateSunTimes(latitude: number, longitude: number, date: Date) {
  // This is a simplified calculation. In production, use a proper astronomical library
  const dayOfYear = Math.floor(
    (date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );

  // Adjust for latitude - longer days in summer, shorter in winter
  const latitudeAdjustment = Math.abs(latitude) / 90;
  const seasonalAdjustment = Math.sin((dayOfYear - 81) * 0.017214);

  const sunriseHour = 6 + seasonalAdjustment * 2 * latitudeAdjustment;
  const sunsetHour = 18 + seasonalAdjustment * 2 * latitudeAdjustment;

  const sunrise = new Date(date);
  sunrise.setHours(sunriseHour, (sunriseHour % 1) * 60);

  const sunset = new Date(date);
  sunset.setHours(sunsetHour, (sunsetHour % 1) * 60);

  return { sunrise, sunset };
}

function calculateDayLength(sunrise: Date, sunset: Date): string {
  const diff = sunset.getTime() - sunrise.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

function getAuroraIntensity(kpIndex: number): 'low' | 'medium' | 'high' {
  if (kpIndex >= 6) return 'high';
  if (kpIndex >= 4) return 'medium';
  return 'low';
}