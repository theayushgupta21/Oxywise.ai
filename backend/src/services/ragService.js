import KnowledgeChunk from "../models/KnowledgeChunk.js";
import { generateEmbedding } from "./embeddingService.js";

/**
 * Normalize plant names so small differences do not prevent matching.
 *
 * Example:
 * "Snake Plant" -> "snake plant"
 * "snake-plant" -> "snake plant"
 */
function normalizePlantName(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value
    .toLowerCase()
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");
}

/**
 * Check whether a retrieved knowledge chunk belongs to
 * the plant currently being discussed.
 */
function isPlantMatch(chunk, currentPlant) {
  if (!currentPlant) {
    return true;
  }

  const requestedPlant = normalizePlantName(currentPlant);
  const chunkPlant = normalizePlantName(chunk.plantName);

  if (!requestedPlant || !chunkPlant) {
    return false;
  }

  return (
    chunkPlant.includes(requestedPlant) ||
    requestedPlant.includes(chunkPlant)
  );
}

/**
 * Retrieve relevant verified plant knowledge.
 *
 * This function remains backwards compatible:
 *
 * retrieveRelevantKnowledge(userQuery)
 *
 * But it also supports:
 *
 * retrieveRelevantKnowledge(userQuery, 8, {
 *   currentPlant: "Snake Plant"
 * })
 */
export async function retrieveRelevantKnowledge(
  userQuery,
  limit = 8,
  options = {}
) {
  if (!userQuery?.trim()) {
    return [];
  }

  const currentPlant = options.currentPlant || null;

  const queryEmbedding = await generateEmbedding(userQuery);

  if (!Array.isArray(queryEmbedding) || queryEmbedding.length === 0) {
    console.warn("RAG: Empty query embedding");
    return [];
  }

  /*
   * Retrieve more candidates than we finally return.
   *
   * Example:
   * final result = 5
   * vector candidates = 30
   *
   * This gives us enough results to prioritize the
   * correct plant and relevant knowledge.
   */
  const candidateLimit = Math.max(limit * 4, 20);

  const results = await KnowledgeChunk.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit: candidateLimit,
      },
    },

    {
      $project: {
        _id: 1,
        text: 1,
        category: 1,
        plantName: 1,
        topic: 1,
        source: 1,
        score: {
          $meta: "vectorSearchScore",
        },
      },
    },
  ]);

  if (!results.length) {
    console.log("RAG: No knowledge chunks retrieved");
    return [];
  }

  /*
   * If a current plant is known, prioritize chunks
   * belonging to that plant.
   *
   * We intentionally do this in application code rather
   * than requiring a new Atlas vector-search filter index.
   * This keeps the current MongoDB architecture compatible.
   */
  let rankedResults = results;

  if (currentPlant) {
    const plantMatches = results.filter((chunk) =>
      isPlantMatch(chunk, currentPlant)
    );

    if (plantMatches.length > 0) {
      rankedResults = plantMatches;
    }
  }

  /*
   * Remove extremely weak semantic matches.
   *
   * Do not use an aggressive threshold because the exact
   * score distribution depends on the embedding model and
   * your indexed data.
   */
  rankedResults = rankedResults.filter(
    (chunk) =>
      typeof chunk.score !== "number" ||
      chunk.score >= 0.45
  );

  /*
   * Highest relevance first.
   */
  rankedResults.sort((a, b) => {
    const scoreA =
      typeof a.score === "number" ? a.score : 0;

    const scoreB =
      typeof b.score === "number" ? b.score : 0;

    return scoreB - scoreA;
  });

  const finalResults = rankedResults.slice(0, limit);

  /*
   * Safe development logging.
   *
   * Never log embeddings, API keys, user secrets,
   * or private profile information.
   */
  console.log("========== OXYWISE RAG ==========");
  console.log("Query:", userQuery);
  console.log("Current plant:", currentPlant || "none");
  console.log("Candidates:", results.length);
  console.log("Final chunks:", finalResults.length);

  finalResults.forEach((chunk, index) => {
    console.log(
      `${index + 1}.`,
      chunk.plantName || "Unknown plant",
      "|",
      chunk.category || "unknown category",
      "|",
      chunk.topic || "unknown topic",
      "| score:",
      typeof chunk.score === "number"
        ? chunk.score.toFixed(3)
        : "unknown"
    );
  });

  console.log("==================================");

  return finalResults;
}