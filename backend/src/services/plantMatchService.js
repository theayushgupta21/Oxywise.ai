import Plant from "../models/Plant.js";

export async function matchPlants({ weather, space }) {
    const query = {};

    if (weather) {
        query.idealTempMin = { $lte: weather.tempC };
        query.idealTempMax = { $gte: weather.tempC };
    }
    if (space) {
        query.suitableFor = space;
    }

    return Plant.find(query).limit(3).lean();
}