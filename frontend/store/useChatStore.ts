import { create } from "zustand";

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
    imageFile: File | null;
    docFile: File | null;
    locationOn: boolean;
    weatherOn: boolean;

    fetchHistory: () => Promise<void>;
    setInput: (text: string) => void;
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

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    history: [],
    activeChatId: "",
    isTyping: false,
    sidebarOpen: false,
    isLoadingHistory: false,
    input: "",
    imageFile: null,
    docFile: null,
    locationOn: false,
    weatherOn: false,

    // 🔧 DB-ready: call this on mount to load real chat history
    // Replace the mock array below with: const res = await fetch("/api/chats"); const data = await res.json();
    fetchHistory: async () => {
        set({ isLoadingHistory: true });
        try {
            // --- MOCK DATA (remove once backend is ready) ---
            const mock: ChatHistoryItem[] = [
                { id: "1", title: "Balcony plant suggestions", group: "Today", updatedAt: Date.now() },
                { id: "2", title: "Snake plant watering schedule", group: "Today", updatedAt: Date.now() - 1000 },
                { id: "3", title: "Birthday gift plant ideas", group: "Yesterday", updatedAt: Date.now() - 90000 },
                { id: "4", title: "Bengaluru monsoon plant care", group: "Previous 7 days", updatedAt: Date.now() - 500000 },
            ];
            set({ history: mock, activeChatId: mock[0]?.id ?? "" });
            // --- END MOCK ---
        } finally {
            set({ isLoadingHistory: false });
        }
    },

    setInput: (text) => set({ input: text }),

    sendMessage: (prefill) => {
        const { input, imageFile, docFile, messages, activeChatId, history } = get();
        const text = (prefill ?? input).trim();
        if (!text && !imageFile && !docFile) return;

        const userMsg: Message = { id: crypto.randomUUID(), role: "user", text: text || "(sent with attachment)" };
        const isFirstMessage = messages.length === 0;

        set({ messages: [...messages, userMsg], input: "", imageFile: null, docFile: null, isTyping: true });

        // If this is a brand-new chat (no history entry yet), create one now — title comes from first message
        if (isFirstMessage && activeChatId) {
            const alreadyExists = history.some((h) => h.id === activeChatId);
            if (!alreadyExists) {
                const newItem: ChatHistoryItem = {
                    id: activeChatId,
                    title: titleFromText(text),
                    group: "Today",
                    updatedAt: Date.now(),
                };
                set({ history: [newItem, ...history] });
                // 🔧 DB-ready: POST /api/chats { id: activeChatId, title: newItem.title }
            }
        }

        // 🔧 Replace this whole block with a real API/WebSocket call to your backend
        setTimeout(() => {
            const reply = getBotReply(text);
            const botMsg: Message = { id: crypto.randomUUID(), role: "bot", text: reply.text, card: reply.card };
            set((state) => ({ messages: [...state.messages, botMsg], isTyping: false }));
            // 🔧 DB-ready: POST /api/chats/:id/messages { userMsg, botMsg }
        }, 700);
    },

    startNewChat: () => {
        // generate a fresh chat id up front so the first message can attach to it
        const newId = crypto.randomUUID();
        set({ messages: [], activeChatId: newId, sidebarOpen: false });
        // 🔧 DB-ready: optionally POST /api/chats to reserve the chat before the first message
    },

    loadChat: (id) => {
        set({ activeChatId: id, sidebarOpen: false, messages: [] });
        // 🔧 DB-ready: fetch(`/api/chats/${id}/messages`) → set({ messages: data })
    },

    toggleSidebar: (open) =>
        set((state) => ({ sidebarOpen: open !== undefined ? open : !state.sidebarOpen })),

    setImageFile: (file) => set({ imageFile: file }),
    setDocFile: (file) => set({ docFile: file }),
    toggleLocation: () => set((state) => ({ locationOn: !state.locationOn })),
    toggleWeather: () => set((state) => ({ weatherOn: !state.weatherOn })),
}));