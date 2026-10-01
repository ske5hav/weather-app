const form = document.querySelector("#weather-form");
const locationInput = document.querySelector("#location");
const weatherDiv = document.querySelector("#weather");
const unitToggle = document.querySelector("#unit-toggle");

let currentWeather = null;
let isCelsius = false;


// Get weather data from API
async function getWeather(location) {

    const apiKey = "UDQXRWJLPEJNAK2PHQ33RG3J8";

    const url =
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${apiKey}&contentType=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("City not found");
    }

    const data = await response.json();

    console.log(data);

    return data;
}


// Process API data
function processWeatherData(data) {

    return {
        location: data.resolvedAddress,

        temperature: data.currentConditions.temp,

        feelsLike: data.currentConditions.feelslike,

        conditions: data.currentConditions.conditions,

        description: data.currentConditions.description,

        humidity: data.currentConditions.humidity,

        windspeed: data.currentConditions.windspeed,

        windDirection: data.currentConditions.winddir,

        pressure: data.currentConditions.pressure,

        visibility: data.currentConditions.visibility,

        cloudCover: data.currentConditions.cloudcover,

        uvIndex: data.currentConditions.uvindex,

        sunrise: data.currentConditions.sunrise,

        sunset: data.currentConditions.sunset,

        icon: data.currentConditions.icon
    };
}


// Fahrenheit → Celsius
function fahrenheitToCelsius(fahrenheit) {

    return (fahrenheit - 32) * 5 / 9;
}


// Display weather
function displayWeather(weather) {

    let temperature;

    if (isCelsius) {

        temperature =
            fahrenheitToCelsius(weather.temperature);

    } else {

        temperature = weather.temperature;
    }


    weatherDiv.innerHTML = `

        <h2>${weather.location}</h2>

        <h3>
            ${temperature.toFixed(1)}°
            ${isCelsius ? "C" : "F"}
        </h3>

        <p>
            <strong>Feels Like:</strong>
            ${weather.feelsLike}°
        </p>

        <p>
            <strong>Condition:</strong>
            ${weather.conditions}
        </p>

        <p>
            <strong>Description:</strong>
            ${weather.description}
        </p>

        <p>
            <strong>Humidity:</strong>
            ${weather.humidity}%
        </p>

        <p>
            <strong>Wind Speed:</strong>
            ${weather.windspeed}
        </p>

        <p>
            <strong>Wind Direction:</strong>
            ${weather.windDirection}°
        </p>

        <p>
            <strong>Pressure:</strong>
            ${weather.pressure}
        </p>

        <p>
            <strong>Visibility:</strong>
            ${weather.visibility}
        </p>

        <p>
            <strong>Cloud Cover:</strong>
            ${weather.cloudCover}%
        </p>

        <p>
            <strong>UV Index:</strong>
            ${weather.uvIndex}
        </p>

        <p>
            <strong>Sunrise:</strong>
            ${weather.sunrise}
        </p>

        <p>
            <strong>Sunset:</strong>
            ${weather.sunset}
        </p>

        <p>
            <strong>Weather Icon:</strong>
            ${weather.icon}
        </p>

    `;
}


// Form submit
form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const location = locationInput.value.trim();

    if (!location) {
        return;
    }

    weatherDiv.innerHTML = "<p>Loading weather...</p>";

    try {

        const data = await getWeather(location);

        currentWeather = processWeatherData(data);

        displayWeather(currentWeather);

    } catch (error) {

        weatherDiv.innerHTML = `
            <p>
                City not found. Please try another city.
            </p>
        `;

        console.error(error);
    }

});


// Celsius / Fahrenheit toggle
unitToggle.addEventListener("click", function () {

    if (!currentWeather) {
        return;
    }

    isCelsius = !isCelsius;

    if (isCelsius) {

        unitToggle.textContent = "Show °F";

    } else {

        unitToggle.textContent = "Show °C";

    }

    displayWeather(currentWeather);

});