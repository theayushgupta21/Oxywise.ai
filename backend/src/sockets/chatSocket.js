import { verifyToken } from "../utils/tokenUtils.js";
import { getPlantAdvice } from "../services/grokService.js"; // openaiService.js ki jagah
import { getWeatherByCity } from "../services/weatherService.js";
import { matchPlants } from "../services/plantMatchService.js";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import mongoose from "mongoose";
import { getWeatherByCoords } from "../services/weatherService.js";

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
            try {
                if (!mongoose.isValidObjectId(chatId)) {
                    return socket.emit("error_message", "Invalid chat id");
                }

                const chat = await Chat.findOne({ _id: chatId, userId: socket.userId });
                if (!chat) return socket.emit("error_message", "Chat not found");
                socket.join(chat.id);
            } catch (err) {
                console.error("join_chat error:", err);
                socket.emit("error_message", "Unable to open chat");
            }
        });

        socket.on("send_message", async (payload) => {
            const { chatId, text, city, weatherOn, locationOn, spaceType } = payload;

            try {
                let chat = null;
                if (mongoose.isValidObjectId(chatId)) {
                    chat = await Chat.findOne({ _id: chatId, userId: socket.userId });
                }

                // New chats may arrive with a client-only id. Never query MongoDB with it.
                if (!chat) {
                    chat = await Chat.create({ userId: socket.userId, title: "New chat" });
                    socket.emit("chat_created", { clientChatId: chatId, chatId: chat.id });
                }

                const roomId = chat.id;
                socket.join(roomId);

                await Message.create({ chatId: chat._id, role: "user", text });

                // Auto-title the chat from the first message, like ChatGPT/Claude
                if (chat.title === "New chat") {
                    chat.title = text.slice(0, 42) + (text.length > 42 ? "…" : "");
                }
                chat.updatedAt = new Date();
                await chat.save();

                io.to(roomId).emit("bot_typing", true);

                let weatherContext = null;
                let matchedPlants = null;

                if ((weatherOn || locationOn) && city) {
                    try {
                        weatherContext = await getWeatherByCity(city);
                        matchedPlants = await matchPlants({ weather: weatherContext, space: spaceType });
                    } catch (weatherErr) {
                        console.warn("Weather context unavailable:", weatherErr.message || weatherErr);
                        weatherContext = { city, condition: "unknown", note: "Weather data unavailable right now." };
                    }
                }

                const botReply = await getPlantAdvice({ userMessage: text, weatherContext, matchedPlants });
                const botMsg = await Message.create({ chatId: chat._id, role: "bot", text: botReply });

                io.to(roomId).emit("bot_typing", false);
                io.to(roomId).emit("receive_message", { id: botMsg._id, role: "bot", text: botReply });
            } catch (err) {
                console.error("send_message error:", err);
                socket.emit("bot_typing", false);
                socket.emit("error_message", "Something went wrong. Please try again.");
            }
        });

        socket.on("disconnect", () => {
            console.log("🔌 Client disconnected:", socket.userId);
        });
    });
}