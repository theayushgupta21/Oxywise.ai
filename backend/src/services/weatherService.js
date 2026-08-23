import axios from "axios";

export async function getWeatherByCity(city) {
    const res = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: { q: city, appid: process.env.OPENWEATHER_API_KEY, units: "metric" },
    });

    return {
        city: res.data.name,
        tempC: res.data.main.temp,
        humidity: res.data.main.humidity,
        condition: res.data.weather[0].main,
    };
}