import { pipeline } from "@xenova/transformers";

let embedder = null;

async function getEmbedder() {
    if (!embedder) {
        embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }
    return embedder;
}

export async function generateEmbedding(text) {
    const embedderInstance = await getEmbedder();
    const output = await embedderInstance(text, { pooling: "mean", normalize: true });
    return Array.from(output.data);
}