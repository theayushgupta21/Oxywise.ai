import express from "express";
import { getChats, createChat, getMessages } from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getChats);
router.post("/", protect, createChat);
router.get("/:chatId/messages", protect, getMessages);

export default router;