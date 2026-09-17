import axios from "axios";

export async function getWeatherByCity(city) {
    console.log("🌦️ Requesting weather for:", JSON.stringify(`${city},IN`));
    const res = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: { q: `${city},IN`, appid: process.env.OPENWEATHER_API_KEY, units: "metric" },
    });
    return {
        city: res.data.name,
        tempC: res.data.main.temp,
        humidity: res.data.main.humidity,
        condition: res.data.weather[0].main,
    };
}

export async function getWeatherByCoords(lat, lon) {
     console.log("🌦️ Requesting weather for:", JSON.stringify(`${city},IN`));
    const res = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: { lat, lon, appid: process.env.OPENWEATHER_API_KEY, units: "metric" },
    });
    return {
        city: res.data.name,
        tempC: res.data.main.temp,
        humidity: res.data.main.humidity,
        condition: res.data.weather[0].main,
    };
}