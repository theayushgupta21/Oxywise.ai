import OpenAI from "openai";
import { retrieveRelevantKnowledge } from "./ragService.js";

let client = null;
let clientApiKey = null;

function getClient() {
    const apiKey = process.env.GROQ_API_KEY?.trim().replace(/^("|')(.*)\1$/, "$2");
    if (!apiKey) {
        throw new Error("GROQ_API_KEY is missing or empty at Groq client creation time");
    }

    if (!client || clientApiKey !== apiKey) {
        client = new OpenAI({
            apiKey,
            baseURL: "https://api.groq.com/openai/v1",
        });
        clientApiKey = apiKey;
    }
    return client;
}

const SYSTEM_PROMPT = `You are Oxywise, an AI plant-care assistant.
Only use the verified knowledge, weather data, and matched plants provided
in the context below. Do not invent information outside this context.
If nothing relevant is found, say so honestly and ask a clarifying question.`;

export async function getPlantAdvice({ userMessage, weatherContext, matchedPlants }) {
    const relevantKnowledge = await retrieveRelevantKnowledge(userMessage);

    const contextBlock = `
Relevant knowledge:
${relevantKnowledge.map((k) => `- ${k.text}`).join("\n") || "none found"}

Weather: ${weatherContext ? JSON.stringify(weatherContext) : "not provided"}
Matched plants: ${matchedPlants?.length ? JSON.stringify(matchedPlants) : "none"}
    `.trim();

    const response = await getClient().chat.completions.create({
        model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "system", content: contextBlock },
            { role: "user", content: userMessage },
        ],
    });

    return response.choices[0].message.content;
}