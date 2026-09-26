import { verifyToken } from "../utils/tokenUtils.js";

import { getPlantAdvice } from "../services/grokService.js";

import {
  getWeatherByCity,
  getWeatherByCoords,
} from "../services/weatherService.js";

import { matchPlants } from "../services/plantMatchService.js";

import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

import mongoose from "mongoose";

export function registerChatSocket(io) {
  /*
   * ============================================================
   * SOCKET AUTHENTICATION
   * ============================================================
   *
   * Every socket connection must contain a valid JWT.
   */

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = verifyToken(token);

      socket.userId = decoded.id;

      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      "🔌 Authenticated client connected:",
      socket.userId
    );

    /*
     * ==========================================================
     * JOIN CHAT
     * ==========================================================
     */

    socket.on("join_chat", async ({ chatId }) => {
      try {
        if (!mongoose.isValidObjectId(chatId)) {
          return socket.emit(
            "error_message",
            "Invalid chat id"
          );
        }

        const chat = await Chat.findOne({
          _id: chatId,
          userId: socket.userId,
        });

        if (!chat) {
          return socket.emit(
            "error_message",
            "Chat not found"
          );
        }

        socket.join(chat.id);

      } catch (err) {
        console.error("join_chat error:", err);

        socket.emit(
          "error_message",
          "Unable to open chat"
        );
      }
    });

    /*
     * ==========================================================
     * SEND MESSAGE
     * ==========================================================
     */

    socket.on("send_message", async (payload = {}) => {
      const {
        chatId,
        text,
        city,
        weatherOn,
        locationOn,
        spaceType,

        /*
         * NEW:
         *
         * The frontend can tell us which plant the user is
         * currently discussing.
         *
         * Example:
         * currentPlant: "Snake Plant"
         */
        currentPlant,
      } = payload;

      try {
        /*
         * ------------------------------------------------------
         * 1. VALIDATE MESSAGE
         * ------------------------------------------------------
         */

        if (!text?.trim()) {
          return socket.emit(
            "error_message",
            "Message cannot be empty"
          );
        }

        /*
         * ------------------------------------------------------
         * 2. FIND EXISTING CHAT
         * ------------------------------------------------------
         */

        let chat = null;

        if (mongoose.isValidObjectId(chatId)) {
          chat = await Chat.findOne({
            _id: chatId,
            userId: socket.userId,
          });
        }

        /*
         * New chats may arrive with a client-only id.
         * Never query MongoDB with a fake client id.
         */

        if (!chat) {
          chat = await Chat.create({
            userId: socket.userId,
            title: "New chat",
          });

          socket.emit("chat_created", {
            clientChatId: chatId,
            chatId: chat.id,
          });
        }

        const roomId = chat.id;

        socket.join(roomId);

        /*
         * ------------------------------------------------------
         * 3. GET PREVIOUS CONVERSATION BEFORE SAVING CURRENT
         * ------------------------------------------------------
         *
         * This is important.
         *
         * We don't want the current message to appear twice:
         *
         * conversation history
         * +
         * current user message
         *
         * So retrieve the previous messages first.
         */

        const previousMessages = await Message.find({
          chatId: chat._id,
        })
          .sort({
            createdAt: -1,
            _id: -1,
          })
          .limit(10)
          .lean();

        /*
         * Reverse so the model receives:
         *
         * oldest → newest
         */

        const recentConversation = previousMessages
          .reverse()
          .map((message) => ({
            role:
              message.role === "bot"
                ? "assistant"
                : "user",

            content: message.text || "",
          }));

        /*
         * ------------------------------------------------------
         * 4. SAVE CURRENT USER MESSAGE
         * ------------------------------------------------------
         */

        await Message.create({
          chatId: chat._id,
          role: "user",
          text: text.trim(),
        });

        /*
         * ------------------------------------------------------
         * 5. AUTO TITLE
         * ------------------------------------------------------
         */

        if (chat.title === "New chat") {
          chat.title =
            text.slice(0, 42) +
            (text.length > 42 ? "…" : "");
        }

        chat.updatedAt = new Date();

        await chat.save();

        /*
         * ------------------------------------------------------
         * 6. SHOW BOT TYPING
         * ------------------------------------------------------
         */

        io.to(roomId).emit(
          "bot_typing",
          true
        );

        /*
         * ------------------------------------------------------
         * 7. WEATHER CONTEXT
         * ------------------------------------------------------
         */

        let weatherContext = null;
        let matchedPlants = [];

        if (
          (weatherOn || locationOn) &&
          city
        ) {
          try {
            weatherContext =
              await getWeatherByCity(city);

            matchedPlants =
              await matchPlants({
                weather: weatherContext,
                space: spaceType,
              });

          } catch (weatherErr) {
            console.warn(
              "Weather context unavailable:",
              weatherErr.message || weatherErr
            );

            weatherContext = {
              city,
              condition: "unknown",
              note:
                "Weather data unavailable right now.",
            };

            matchedPlants = [];
          }
        }

        /*
         * ------------------------------------------------------
         * 8. DETERMINE CURRENT PLANT
         * ------------------------------------------------------
         *
         * Priority:
         *
         * 1. Explicit currentPlant from frontend
         * 2. First matched plant
         * 3. null
         *
         * This allows follow-up questions such as:
         *
         * User:
         * "Tell me about Snake Plant"
         *
         * User:
         * "How often should I water it?"
         *
         * currentPlant:
         * "Snake Plant"
         */

        const activePlant =
          currentPlant ||
          matchedPlants?.[0]?.plantName ||
          matchedPlants?.[0]?.name ||
          null;

        /*
         * ------------------------------------------------------
         * 9. BUILD USER CONTEXT
         * ------------------------------------------------------
         *
         * We always know the authenticated user id.
         *
         * We intentionally do NOT trust a client-provided
         * name as authentication/profile data.
         *
         * The conversation history can still contain:
         *
         * User: My name is Ayush Gupta
         *
         * which allows the model to understand:
         *
         * User: Do you know my name?
         */

        const userContext = {
          userId: socket.userId,
        };

        /*
         * ------------------------------------------------------
         * 10. ASK OXYWISE
         * ------------------------------------------------------
         */

        const botReply = await getPlantAdvice({
          userMessage: text.trim(),

          weatherContext,

          matchedPlants,

          userContext,

          recentConversation,

          currentPlant: activePlant,
        });

        /*
         * ------------------------------------------------------
         * 11. SAVE BOT RESPONSE
         * ------------------------------------------------------
         */

        const botMsg = await Message.create({
          chatId: chat._id,
          role: "bot",
          text: botReply,
        });

        /*
         * ------------------------------------------------------
         * 12. STOP TYPING
         * ------------------------------------------------------
         */

        io.to(roomId).emit(
          "bot_typing",
          false
        );

        /*
         * ------------------------------------------------------
         * 13. SEND RESPONSE TO FRONTEND
         * ------------------------------------------------------
         */

        io.to(roomId).emit(
          "receive_message",
          {
            id: botMsg._id,
            role: "bot",
            text: botReply,
          }
        );

      } catch (err) {
        console.error(
          "send_message error:",
          err
        );

        socket.emit(
          "bot_typing",
          false
        );

        socket.emit(
          "error_message",
          "Something went wrong. Please try again."
        );
      }
    });

    /*
     * ==========================================================
     * DISCONNECT
     * ==========================================================
     */

    socket.on("disconnect", () => {
      console.log(
        "🔌 Client disconnected:",
        socket.userId
      );
    });
  });
}