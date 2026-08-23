import KnowledgeChunk from "../models/KnowledgeChunk.js";
import { generateEmbedding } from "./embeddingService.js";

export async function retrieveRelevantKnowledge(userQuery, limit = 3) {
    const queryEmbedding = await generateEmbedding(userQuery);

    const results = await KnowledgeChunk.aggregate([
        {
            $vectorSearch: {
                index: "vector_index",
                path: "embedding",
                queryVector: queryEmbedding,
                numCandidates: 50,
                limit,
            },
        },
        {
            $project: {
                text: 1,
                category: 1,
                plantName: 1,
                score: { $meta: "vectorSearchScore" },
            },
        },
    ]);

    return results;
}