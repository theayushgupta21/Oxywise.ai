import mongoose from "mongoose";

const plantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    idealTempMin: Number, // °C
    idealTempMax: Number, // °C
    humidityNeeds: { type: String, enum: ["low", "medium", "high"] },
    sunlightNeeds: { type: String, enum: ["low", "indirect", "direct"] },
    wateringFrequencyDays: Number,
    suitableFor: [{ type: String }], // e.g. ["balcony", "indoor", "terrace"]
    climateZones: [{ type: String }],
    careNotes: String,
});

export default mongoose.model("Plant", plantSchema);