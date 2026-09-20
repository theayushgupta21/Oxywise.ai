import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");
const envResult = dotenv.config({ path: envPath });

if (envResult.error && envResult.error.code !== "ENOENT") {
    throw new Error(`Unable to load environment file at ${envPath}: ${envResult.error.message}`);
}

const groqKey = process.env.GROQ_API_KEY?.trim().replace(/^("|')(.*)\1$/, "$2");
if (!groqKey || /\s/.test(groqKey)) {
    throw new Error("GROQ_API_KEY is missing or contains whitespace. Check backend/.env.");
}
process.env.GROQ_API_KEY = groqKey;
console.log(JSON.stringify({
    envPath,
    groqKeyLoaded: Boolean(groqKey),
    groqKeyLength: groqKey?.length ?? 0,
    groqKeyFirstCharCode: groqKey?.charCodeAt(0) ?? null,
    groqKeyLastCharCode: groqKey?.charCodeAt((groqKey?.length ?? 1) - 1) ?? null,
    groqKeyHasWhitespace: /\s/.test(groqKey ?? ""),
    groqKeyFingerprint: groqKey
        ? crypto.createHash("sha256").update(groqKey).digest("hex").slice(0, 12)
        : null,
}));

const [{ default: http }, { default: app }, { connectDB }, { validateEnv }, { initSocket }, { registerChatSocket }] = await Promise.all([
    import("http"),
    import("./app.js"),
    import("./config/db.js"),
    import("./config/env.js"),
    import("./config/socket.js"),
    import("./sockets/chatSocket.js"),
]);

validateEnv();

const server = http.createServer(app);
const io = initSocket(server);
registerChatSocket(io);

connectDB().then(() => {
    server.listen(process.env.PORT || 5000, () => {
        console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
});

export default app;