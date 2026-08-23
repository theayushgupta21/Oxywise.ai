import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
        role: { type: String, enum: ["user", "bot"], required: true },
        text: { type: String, required: true },
        card: {
            name: String,
            note: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Message", messageSchema);