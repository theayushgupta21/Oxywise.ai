import mongoose from "mongoose";

const knowledgeChunkSchema = new mongoose.Schema({
    text: { type: String, required: true },
    category: { type: String },
    plantName: { type: String },
    embedding: { type: [Number], required: true },
});

export default mongoose.model("KnowledgeChunk", knowledgeChunkSchema);