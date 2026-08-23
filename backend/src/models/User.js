import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String }, // not required — Google users won't have one
        authProvider: { type: String, enum: ["local", "google"], default: "local" },
        googleId: { type: String, unique: true, sparse: true },
        avatar: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);