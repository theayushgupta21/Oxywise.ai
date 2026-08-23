import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5000",
    process.env.CLIENT_URL,
].filter(Boolean);

const app = express();

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(express.json());

app.get("/", (req, res) => res.json({ status: "Oxywise backend running" }));

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);

app.use(errorHandler);

export default app;