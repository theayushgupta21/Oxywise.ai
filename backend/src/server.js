import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { validateEnv } from "./config/env.js";
import { initSocket } from "./config/socket.js";
import { registerChatSocket } from "./sockets/chatSocket.js";

validateEnv();

const server = http.createServer(app);
const io = initSocket(server);
registerChatSocket(io);

connectDB().then(() => {
    server.listen(process.env.PORT || 5000, () => {
        console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
});