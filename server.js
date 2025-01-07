// Import required modules
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Set your OpenWeather API key
const API_KEY = 'da9c7919ac41b1348f0296bad1c26c6a';

// Set your News API key
const NEWS_API_KEY = 'd218b5d3aaf74361ba6adc16eb3180eb';

// Set your Currency Exchange Rates API key
const CURRENCY_API_KEY = '41b64668644f77f8845688b02e1d3ab8';

// Middleware to serve static files (e.g., CSS, images)
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // For parsing form data

// Route to render the weather form and data
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Weather App</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        margin: 20px;
                    }
                    .weather {
                        display: inline-block;
                        padding: 20px;
                        border: 1px solid #ccc;
                        border-radius: 10px;
                        box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
                    }
                </style>
            </head>
            <body>
                <h1>Weather App</h1>
                <form action="/weather" method="post">
                    <input type="text" name="city" placeholder="Enter city" required>
                    <button type="submit">Get Weather</button>
                </form>
            </body>
        </html>
    `);
});

// Route to handle form submission and fetch weather data
app.post('/weather', async (req, res) => {
    const city = req.body.city;

    try {
        // Fetch weather data from OpenWeather API
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
        const weatherData = weatherResponse.data;

        // Fetch news related to the city from News API
        const newsResponse = await axios.get(`https://newsapi.org/v2/everything?q=${city}&apiKey=${NEWS_API_KEY}`);
        const newsData = newsResponse.data;

        // Fetch currency exchange rates for the local currency of the country from Currency API
        const countryCode = weatherData.sys.country;
        const currencyMap = {
            US: 'USD',
            GB: 'GBP',
            EU: 'EUR',
            UA: 'UAH',
            KZ: 'KZT'
            // Add more country codes and currencies as needed
        };
        const localCurrency = currencyMap[countryCode] || 'USD';
        const currencyResponse = await axios.get(`https://open.er-api.com/v6/latest/${localCurrency}`);
        const currencyData = currencyResponse.data;

        // Extract required fields
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

        // Render the data as an HTML page
        res.send(`
            <html>
                <head>
                    <title>Weather in ${city}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            text-align: center;
                            margin: 20px;
                        }
                        img {
                            width: 100px;
                            height: 100px;
                        }
                        .weather {
                            display: inline-block;
                            padding: 20px;
                            border: 1px solid #ccc;
                            border-radius: 10px;
                            box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
                        }
                        iframe {
                            margin-top: 20px;
                            border: none;
                            width: 600px;
                            height: 400px;
                        }
                        .news {
                            margin-top: 20px;
                            text-align: left;
                            max-width: 600px;
                            margin: 20px auto;
                        }
                        .news-item {
                            margin-bottom: 10px;
                        }
                        .currency {
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <h1>Weather in ${city}</h1>
                    <div class="weather">
                        <img src="${weatherInfo.icon}" alt="Weather Icon">
                        <p><strong>Temperature:</strong> ${weatherInfo.temperature}°C</p>
                        <p><strong>Feels Like:</strong> ${weatherInfo.feels_like}°C</p>
                        <p><strong>Description:</strong> ${weatherInfo.description}</p>
                        <p><strong>Coordinates:</strong> ${weatherInfo.coordinates}</p>
                        <p><strong>Humidity:</strong> ${weatherInfo.humidity}%</p>
                        <p><strong>Pressure:</strong> ${weatherInfo.pressure} hPa</p>
                        <p><strong>Wind Speed:</strong> ${weatherInfo.wind_speed} m/s</p>
                        <p><strong>Country Code:</strong> ${weatherInfo.country_code}</p>
                        <p><strong>Rain Volume (Last 3h):</strong> ${weatherInfo.rain_volume} mm</p>
                    </div>
                    <iframe
                        src="https://www.google.com/maps/embed/v1/view?key=AIzaSyBj5tgsykmwE51V9mJdbZgUm8DvmE9z0CA&center=${weatherInfo.latitude},${weatherInfo.longitude}&zoom=10"
                        allowfullscreen>
                    </iframe>
                    <div class="news">
                        <h2>Related News</h2>
                        ${newsItems.length > 0 ? newsItems.map(item => `
                            <div class="news-item">
                                <a href="${item.url}" target="_blank"><strong>${item.title}</strong></a>
                                <p>${item.description}</p>
                            </div>
                        `).join('') : '<p>No news found for this city.</p>'}
                    </div>
                    <div class="currency">
                        <h2>Currency Exchange Rates (Base: ${localCurrency})</h2>
                        <pre>${JSON.stringify(currencyRates, null, 2)}</pre>
                    </div>
                    <br>
                    <a href="/">Search another city</a>
                </body>
            </html>
        `);
    } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
        res.status(500).send(`Error fetching data: ${error.response ? error.response.data.message : error.message}. Please try again.`);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Weather app listening at http://localhost:${port}`);
});
