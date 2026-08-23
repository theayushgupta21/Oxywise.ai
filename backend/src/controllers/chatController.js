import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

export async function getChats(req, res, next) {
    try {
        const chats = await Chat.find({ userId: req.userId }).sort({ updatedAt: -1 });
        res.json(chats);
    } catch (err) {
        next(err);
    }
}

export async function createChat(req, res, next) {
    try {
        const chat = await Chat.create({ userId: req.userId, title: "New chat" });
        res.status(201).json(chat);
    } catch (err) {
        next(err);
    }
}

export async function getMessages(req, res, next) {
    try {
        const messages = await Message.find({ chatId: req.params.chatId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        next(err);
    }
}