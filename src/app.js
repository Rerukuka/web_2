document.addEventListener('DOMContentLoaded', async () => {
    const city = 'London';
    const weatherDiv = document.getElementById('weather');
    const mapFrame = document.getElementById('map');
    const newsDiv = document.getElementById('news');
    const currencyDiv = document.getElementById('currency');
  
    try {
      // Weather
      const weatherRes = await fetch(`/api/weather/${city}`);
      const weatherData = await weatherRes.json();
      weatherDiv.innerHTML = `
        <h2>Weather in ${city}</h2>
        <p>${weatherData.weather[0].description}</p>
        <p>Temperature: ${weatherData.main.temp}°C</p>
      `;
  
      // Map
      const { lat, lon } = weatherData.coord;
      const mapRes = await fetch(`/api/geolocation/${lat}/${lon}`);
      const { mapUrl } = await mapRes.json();
      mapFrame.src = mapUrl;
  
      // News
      const newsRes = await fetch(`/api/news/${city}`);
      const newsData = await newsRes.json();
      newsData.forEach(article => {
        newsDiv.innerHTML += `<p>${article.title}</p>`;
      });
  
      // Currency
      const currencyRes = await fetch('/api/currency/USD/GBP');
      const { rate } = await currencyRes.json();
      currencyDiv.innerHTML = `<p>USD to GBP: ${rate}</p>`;
    } catch (error) {
      console.error('Error:', error);
    }
  });
  