import { Server } from "socket.io";

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5000",
    process.env.CLIENT_URL, // production Vercel URL, from .env
].filter(Boolean); // removes any undefined/empty values

let io;

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: allowedOrigins,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    return io;
}

export function getIO() {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
}