// Import required modules
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Set your API keys
const API_KEY = 'da9c7919ac41b1348f0296bad1c26c6a';
const NEWS_API_KEY = 'd218b5d3aaf74361ba6adc16eb3180eb';
const CURRENCY_API_KEY = '41b64668644f77f8845688b02e1d3ab8';

// Middleware to serve static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Route to render the weather form and data
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Weather App</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
                <style>
                    body {
                        font-family: 'Roboto', sans-serif;
                        background: linear-gradient(135deg, #74ebd5, #acb6e5);
                        color: white;
                        text-align: center;
                        min-height: 100vh;
                        margin: 0;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                    .form-container {
                        padding: 20px;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 10px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                    }
                </style>
            </head>
            <body>
                <h1>Weather App</h1>
                <div class="form-container">
                    <form action="/weather" method="post" class="d-flex flex-column align-items-center">
                        <input type="text" name="city" placeholder="Enter city" class="form-control mb-3" style="max-width: 300px;" required>
                        <button type="submit" class="btn btn-primary btn-lg">Get Weather</button>
                    </form>
                </div>
            </body>
        </html>
    `);
});

// Route to handle form submission and fetch weather data
app.post('/weather', async (req, res) => {
    const city = req.body.city;

    try {
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
        const weatherData = weatherResponse.data;

        const newsResponse = await axios.get(`https://newsapi.org/v2/everything?q=${city}&apiKey=${NEWS_API_KEY}`);
        const newsData = newsResponse.data;

        const countryCode = weatherData.sys.country;
        const currencyMap = {
            US: 'USD',
            GB: 'GBP',
            EU: 'EUR',
            UA: 'UAH',
            KZ: 'KZT'
        };
        const localCurrency = currencyMap[countryCode] || 'USD';
        const currencyResponse = await axios.get(`https://open.er-api.com/v6/latest/${localCurrency}`);
        const currencyData = currencyResponse.data;

        const weatherInfo = {
            temperature: weatherData.main.temp,
            feels_like: weatherData.main.feels_like,
            description: weatherData.weather[0].description,
            icon: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
            coordinates: `Lat: ${weatherData.coord.lat}, Lon: ${weatherData.coord.lon}`,
            latitude: weatherData.coord.lat,
            longitude: weatherData.coord.lon,
            humidity: weatherData.main.humidity,
            pressure: weatherData.main.pressure,
            wind_speed: weatherData.wind.speed,
            country_code: weatherData.sys.country,
            rain_volume: weatherData.rain ? weatherData.rain['3h'] || 0 : 0,
        };

        const newsItems = newsData.articles || [];
        const currencyRates = currencyData.rates;

        res.send(`
            <html>
                <head>
                    <title>Weather in ${city}</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <style>
                    body {
                        font-family: 'Roboto', sans-serif;
                        background: linear-gradient(135deg, #74ebd5, #acb6e5);
                        color: white;
                        text-align: center;
                        padding: 20px;
                    }
                    img {
                        width: 100px;
                        height: 100px;
                    }
                    .frame {
                        background: rgba(0, 0, 0, 0.2);
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 4px 10px rgba(9, 255, 0, 0.3); /* Larger shadow */
                        margin: 20px 0;
                        border: 2px solid rgba(255, 255, 255, 0.2);
                    }
                    .frame-map {
                        box-shadow: 1 10px 5px rgba(9, 255, 0, 0.9); /* Smaller shadow for map */
                    }
                    iframe {
                        margin-top: 20px;
                        border: none;
                        width: 100%;
                        max-width: 1900px;
                        height: 700px;
                    }
                    .news, .currency {
                        background: rgba(255, 255, 255, 0.2);
                        padding: 15px;
                        border-radius: 10px;
                        margin-top: 20px;
                        border: 2px solid rgba(255, 255, 255, 0.2);
                    }
                    a {
                        color: rgb(4, 0, 255);
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
                <body>
                    <div class="container mt-4">
                        <h1 class="text-center">Weather in ${city}</h1>
                        <div class="frame">
                            <img src="${weatherInfo.icon}" alt="Weather Icon" class="mx-auto d-block mb-3" style="width: 100px;">
                            <p><strong>Temperature:</strong> ${weatherInfo.temperature}°C</p>
                            <p><strong>Feels Like:</strong> ${weatherInfo.feels_like}°C</p>
                            <p><strong>Description:</strong> ${weatherInfo.description}</p>
                            <p><strong>Coordinates:</strong> ${weatherInfo.coordinates}</p>
                            <p><strong>Humidity:</strong> ${weatherInfo.humidity}%</p>
                            <p><strong>Pressure:</strong> ${weatherInfo.pressure} hPa</p>
                            <p><strong>Wind Speed:</strong> ${weatherInfo.wind_speed} m/s</p>
                            <p><strong>Rain Volume:</strong> ${weatherInfo.rain_volume} mm</p>
                        </div>
                        <div class="frame frame-map">
                            <iframe
                                src="https://www.google.com/maps/embed/v1/view?key=AIzaSyBj5tgsykmwE51V9mJdbZgUm8DvmE9z0CA&center=${weatherInfo.latitude},${weatherInfo.longitude}&zoom=10"
                                allowfullscreen>
                            </iframe>
                        </div>
                        <div class="frame">
                            <h2>Related News</h2>
                            ${newsItems.length > 0 ? newsItems.map(item => `
                                <div>
                                    <a href="${item.url}" target="_blank">${item.title}</a>
                                    <p>${item.description}</p>
                                </div>
                            `).join('') : '<p>No news found for this city.</p>'}
                        </div>
                        <div class="frame">
                            <h2>Currency Exchange Rates (Base: ${localCurrency})</h2>
                            <pre>${JSON.stringify(currencyRates, null, 2)}</pre>
                        </div>
                        <div class="text-center">
                            <a href="/" class="btn btn-primary">Search another city</a>
                        </div>
                    </div>
                </body>
            </html>
        `);
        
        
        
    } catch (error) {
        res.status(500).send(`Error fetching data: ${error.response ? error.response.data.message : error.message}`);
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Weather app listening at http://localhost:${port}`);
});