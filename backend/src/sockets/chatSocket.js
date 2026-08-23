import { verifyToken } from "../utils/tokenUtils.js";
import { getPlantAdvice } from "../services/grokService.js"; // openaiService.js ki jagah
import { getWeatherByCity } from "../services/weatherService.js";
import { matchPlants } from "../services/plantMatchService.js";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

export function registerChatSocket(io) {
    // Runs before every connection — rejects sockets without a valid JWT
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error("Authentication required"));

        try {
            const decoded = verifyToken(token);
            socket.userId = decoded.id;
            next();
        } catch {
            next(new Error("Invalid or expired token"));
        }
    });

    io.on("connection", (socket) => {
        console.log("🔌 Authenticated client connected:", socket.userId);

        socket.on("join_chat", async ({ chatId }) => {
            const chat = await Chat.findOne({ _id: chatId, userId: socket.userId });
            if (!chat) return socket.emit("error_message", "Chat not found");
            socket.join(chatId);
        });

        socket.on("send_message", async (payload) => {
            const { chatId, text, city, weatherOn, locationOn, spaceType } = payload;

            try {
                const chat = await Chat.findOne({ _id: chatId, userId: socket.userId });
                if (!chat) return socket.emit("error_message", "Chat not found");

                await Message.create({ chatId, role: "user", text });

                // Auto-title the chat from the first message, like ChatGPT/Claude
                if (chat.title === "New chat") {
                    chat.title = text.slice(0, 42) + (text.length > 42 ? "…" : "");
                }
                chat.updatedAt = new Date();
                await chat.save();

                io.to(chatId).emit("bot_typing", true);

                let weatherContext = null;
                let matchedPlants = null;

                if ((weatherOn || locationOn) && city) {
                    weatherContext = await getWeatherByCity(city);
                    matchedPlants = await matchPlants({ weather: weatherContext, space: spaceType });
                }

                const botReply = await getPlantAdvice({ userMessage: text, weatherContext, matchedPlants });
                const botMsg = await Message.create({ chatId, role: "bot", text: botReply });

                io.to(chatId).emit("bot_typing", false);
                io.to(chatId).emit("receive_message", { id: botMsg._id, role: "bot", text: botReply });
            } catch (err) {
                console.error("send_message error:", err);
                io.to(chatId).emit("bot_typing", false);
                io.to(chatId).emit("error_message", "Something went wrong. Please try again.");
            }
        });

        socket.on("disconnect", () => {
            console.log("🔌 Client disconnected:", socket.userId);
        });
    });
}