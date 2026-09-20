import { create } from "zustand";
import { io, Socket } from "socket.io-client";

export type Role = "user" | "bot";

export interface Message {
    id: string;
    role: Role;
    text: string;
    card?: { name: string; note: string };
}

export interface ChatHistoryItem {
    id: string;
    title: string;
    group: "Today" | "Yesterday" | "Previous 7 days";
    updatedAt: number;
}

interface ChatState {
    messages: Message[];
    history: ChatHistoryItem[];
    activeChatId: string;
    isTyping: boolean;
    sidebarOpen: boolean;
    isLoadingHistory: boolean;

    input: string;
    city: string;
    imageFile: File | null;
    docFile: File | null;
    locationOn: boolean;
    weatherOn: boolean;

    connect: () => void;
    fetchHistory: () => Promise<void>;
    setInput: (text: string) => void;
    setCity: (city: string) => void;
    sendMessage: (prefill?: string) => void;
    startNewChat: () => void;
    loadChat: (id: string) => void;
    toggleSidebar: (open?: boolean) => void;
    setImageFile: (file: File | null) => void;
    setDocFile: (file: File | null) => void;
    toggleLocation: () => void;
    toggleWeather: () => void;
}

// 🔧 Replace with real bot logic / API call to your backend/LLM
function getBotReply(userText: string): { text: string; card?: { name: string; note: string } } {
    const t = userText.toLowerCase();
    if (t.includes("balcony")) {
        return { text: "For a sunny balcony, here's a good match:", card: { name: "Money plant", note: "Tolerant of direct sun, waters weekly" } };
    }
    if (t.includes("water")) {
        return { text: "Snake plants prefer minimal watering — once every 10–14 days." };
    }
    if (t.includes("gift") || t.includes("birthday")) {
        return { text: "A potted succulent arrangement travels well and needs very little care.", card: { name: "Succulent trio", note: "Low maintenance, gift-ready packaging" } };
    }
    return { text: "Tell me your city and where you'd keep the plant, and I'll suggest something that will actually thrive." };
}

// derive a short title from the first user message, like ChatGPT/Claude do
function titleFromText(text: string) {
    const trimmed = text.trim();
    return trimmed.length > 42 ? trimmed.slice(0, 42) + "…" : trimmed;
}

function createId() {
    const cryptoObj = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;
    if (cryptoObj && typeof cryptoObj.randomUUID === "function") {
        return cryptoObj.randomUUID();
    }
    return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isMongoId(value: string) {
    return /^[a-f\d]{24}$/i.test(value);
}

let socketClient: Socket | null = null;

function getSocketClient() {
    if (typeof window === "undefined") return null;

    if (!socketClient) {
        const token = localStorage.getItem("token");
        if (!token) return null;

        const configuredSocketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
        const socketUrl = /^https?:\/\//i.test(configuredSocketUrl)
            ? configuredSocketUrl
            : `${configuredSocketUrl.startsWith("localhost") ? "http" : "https"}://${configuredSocketUrl}`;

        socketClient = io(socketUrl, {
            auth: { token },
            transports: ["websocket", "polling"],
            reconnection: true,
        });

        socketClient.on("connect", () => {
            const { activeChatId } = useChatStore.getState();
            if (isMongoId(activeChatId)) {
                socketClient?.emit("join_chat", { chatId: activeChatId });
            }
        });

        socketClient.on("receive_message", (message) => {
            const nextMessage = {
                id: String(message.id ?? createId()),
                role: message.role === "bot" ? "bot" : "user",
                text: message.text,
            } as Message;

            useChatStore.setState((state) => ({
                messages: [...state.messages, nextMessage],
                isTyping: false,
            }));
        });

        socketClient.on("chat_created", ({ clientChatId, chatId }) => {
            useChatStore.setState((state) => ({
                activeChatId: chatId,
                history: state.history.map((item) =>
                    item.id === clientChatId ? { ...item, id: chatId } : item
                ),
            }));
        });

        socketClient.on("bot_typing", (typing) => {
            useChatStore.setState({ isTyping: !!typing });
        });

        socketClient.on("error_message", (message) => {
            useChatStore.setState({ isTyping: false });
            console.error("Socket error:", message);
        });
    }

    return socketClient;
}

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    history: [],
    activeChatId: "",
    isTyping: false,
    sidebarOpen: false,
    isLoadingHistory: false,
    input: "",
    city: "",
    imageFile: null,
    docFile: null,
    locationOn: false,
    weatherOn: false,

    connect: () => {
        const client = getSocketClient();
        if (!client) return;

        const { activeChatId } = get();
        if (isMongoId(activeChatId)) {
            client.emit("join_chat", { chatId: activeChatId });
        }
    },

    // 🔧 DB-ready: call this on mount to load real chat history
    // Replace the mock array below with: const res = await fetch("/api/chats"); const data = await res.json();
    fetchHistory: async () => {
        set({ isLoadingHistory: true });
        try {
            // --- MOCK DATA (remove once backend is ready) ---
            set({ history: [], activeChatId: "" });
            // --- END MOCK ---
        } finally {
            set({ isLoadingHistory: false });
        }
    },

    setInput: (text) => set({ input: text }),
    setCity: (city) => set({ city: city.trimStart() }),

    sendMessage: (prefill) => {
        const { input, city, imageFile, docFile, messages, activeChatId, history, locationOn, weatherOn } = get();
        const text = (prefill ?? input).trim();
        if (!text && !imageFile && !docFile) return;

        const chatId = activeChatId || createId();
        const safeCity = city.trim();

        if (!activeChatId) {
            set({ activeChatId: chatId });
        }

        const userMsg: Message = { id: createId(), role: "user", text: text || "(sent with attachment)" };
        const isFirstMessage = messages.length === 0;

        set({ messages: [...messages, userMsg], input: "", imageFile: null, docFile: null, isTyping: true });

        // If this is a brand-new chat (no history entry yet), create one now — title comes from first message
        if (isFirstMessage && chatId) {
            const alreadyExists = history.some((h) => h.id === chatId);
            if (!alreadyExists) {
                const newItem: ChatHistoryItem = {
                    id: chatId,
                    title: titleFromText(text),
                    group: "Today",
                    updatedAt: Date.now(),
                };
                set({ history: [newItem, ...history] });
                // 🔧 DB-ready: POST /api/chats { id: activeChatId, title: newItem.title }
            }
        }

        const socketClient = getSocketClient();
        if (socketClient && socketClient.connected) {
            socketClient.emit("send_message", {
                chatId,
                text,
                city: safeCity || undefined,
                weatherOn,
                locationOn,
                spaceType: "indoor",
            });
            return;
        }

        // 🔧 Replace this whole block with a real API/WebSocket call to your backend
        setTimeout(() => {
            const reply = getBotReply(text);
            const botMsg: Message = { id: createId(), role: "bot", text: reply.text, card: reply.card };
            set((state) => ({ messages: [...state.messages, botMsg], isTyping: false }));
            // 🔧 DB-ready: POST /api/chats/:id/messages { userMsg, botMsg }
        }, 700);
    },

    startNewChat: () => {
        // generate a fresh chat id up front so the first message can attach to it
        const newId = createId();
        set({ messages: [], activeChatId: newId, sidebarOpen: false, city: "" });

        const socketClient = getSocketClient();
        if (socketClient && isMongoId(newId)) {
            socketClient.emit("join_chat", { chatId: newId });
        }
        // 🔧 DB-ready: optionally POST /api/chats to reserve the chat before the first message
    },

    loadChat: (id) => {
        set({ activeChatId: id, sidebarOpen: false, messages: [], city: "" });

        const socketClient = getSocketClient();
        if (socketClient && isMongoId(id)) {
            socketClient.emit("join_chat", { chatId: id });
        }
        // 🔧 DB-ready: fetch(`/api/chats/${id}/messages`) → set({ messages: data })
    },

    toggleSidebar: (open) =>
        set((state) => ({ sidebarOpen: open !== undefined ? open : !state.sidebarOpen })),

    setImageFile: (file) => set({ imageFile: file }),
    setDocFile: (file) => set({ docFile: file }),
    toggleLocation: () => set((state) => ({ locationOn: !state.locationOn })),
    toggleWeather: () => set((state) => ({ weatherOn: !state.weatherOn })),
}));