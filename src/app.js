document.addEventListener('DOMContentLoaded', async () => {
  const city = 'London';
  const weatherDiv = document.getElementById('weather');

  try {
    const weatherRes = await fetch(`/api/weather/${city}`);
    const weatherData = await weatherRes.json();
    console.log('Weather Data:', weatherData);

    if (!weatherData || !weatherData.weather) {
      weatherDiv.innerHTML = `<p>Error: Unable to fetch weather data.</p>`;
      return;
    }

    weatherDiv.innerHTML = `
      <h2>Weather in ${weatherData.name}, ${weatherData.sys.country}</h2>
      <p>${weatherData.weather[0].description}</p>
      <p>Temperature: ${weatherData.main.temp}°C</p>
    `;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
  }
});
