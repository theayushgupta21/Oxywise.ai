import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import KnowledgeChunk from "../models/KnowledgeChunk.js";
import { generateEmbedding } from "../services/embeddingService.js";

const knowledge = [
    {
        text: "Yellow leaves on a plant often indicate overwatering. The soil should dry out between waterings — check by inserting a finger 2 inches into the soil before watering again.",
        category: "disease",
        plantName: "general",
    },
    {
        text: "Brown, crispy leaf tips usually signal low humidity or tap water with high mineral content. Increase humidity with a pebble tray or switch to filtered water.",
        category: "disease",
        plantName: "general",
    },
    {
        text: "White powdery spots on leaves are a sign of powdery mildew, a fungal infection. Improve air circulation and avoid wetting the leaves directly when watering.",
        category: "disease",
        plantName: "general",
    },
    {
        text: "Snake plants need watering only once every 10-14 days. Overwatering is the most common cause of root rot in this species.",
        category: "care",
        plantName: "Snake Plant",
    },
    // ... aur bhi entries add karte raho — jitna zyada knowledge, utna accurate RAG
];

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);
    await KnowledgeChunk.deleteMany({});

    for (const item of knowledge) {
        const embedding = await generateEmbedding(item.text);
        await KnowledgeChunk.create({ ...item, embedding });
        console.log(`✅ Seeded: ${item.text.slice(0, 50)}...`);
    }

    console.log("🌱 Knowledge base seeded successfully");
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});