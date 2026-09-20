"use client";
import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import { Leaf, Menu } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

const quickPrompts = [
    "Suggest a plant for my balcony",
    "How often should I water snake plant?",
    "Best plant for a birthday gift",
];

export default function ChatWindow() {
    const { messages, isTyping, sendMessage, toggleSidebar } = useChatStore();
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    return (
        <div className="flex-1 flex flex-col min-w-0">

            {/* Desktop profile control */}
            {user && (
                <div className="fixed right-4 top-3 z-50 hidden md:block">
                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        className="flex items-center gap-2 rounded-full border border-green-700 bg-white px-3 py-2 text-sm font-semibold text-green-700 shadow-sm"
                        aria-label="Open profile menu"
                    >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-700 text-xs text-white">
                            {user.name?.[0]?.toUpperCase() || "U"}
                        </span>
                        <span>{user.name.split(" ")[0]}</span>
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 top-12 z-50 w-48 rounded-2xl border border-green-100 bg-white p-2 shadow-xl">
                            <Link href="/profile" className="block rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-green-50">Profile</Link>
                            <Link href="/" className="block rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-green-50">Home</Link>
                            <button
                                type="button"
                                onClick={() => {
                                    logout();
                                    setMenuOpen(false);
                                }}
                                className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Mobile top bar */}
            <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#DEE6D2] bg-white">
                <button
                    onClick={() => toggleSidebar(true)}
                    className="w-9 h-9 rounded-lg border border-[#DEE6D2] flex items-center justify-center"
                >
                    <Menu size={18} />
                </button>
                <span className="font-semibold">oxywise.ai</span>
                {user ? (
                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-xs font-semibold text-white"
                        aria-label="Open profile menu"
                    >
                        {user.name?.[0]?.toUpperCase() || "U"}
                    </button>
                ) : <div className="w-9" />}
            </div>

            {menuOpen && user && (
                <div className="fixed right-4 top-14 z-50 w-48 rounded-2xl border border-green-100 bg-white p-2 shadow-xl md:hidden">
                    <Link href="/profile" className="block rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-green-50">Profile</Link>
                    <Link href="/" className="block rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-green-50">Home</Link>
                    <button
                        type="button"
                        onClick={() => {
                            logout();
                            setMenuOpen(false);
                        }}
                        className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                        Logout
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-[760px] mx-auto px-6 pt-6">

                    {messages.length === 0 && (
                        <div className="text-center py-10">
                            <h1 className="text-2xl font-bold mb-2">What's growing today?</h1>
                            <p className="text-[#4B5D42] text-sm">
                                Ask about plants, attach a photo, or share your location for tailored suggestions.
                            </p>
                            <div className="flex flex-wrap gap-2.5 justify-center mt-5">
                                {quickPrompts.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => sendMessage(q)}
                                        className="font-mono text-xs px-3.5 py-2 rounded-full border border-[#DEE6D2] bg-white
                                        text-[#4B5D42] hover:border-green-600 hover:text-green-700 transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-4 pb-6">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-2.5 max-w-[82%] ${msg.role === "user" ? "self-end flex-row-reverse" : "self-start"
                                    }`}
                            >
                                <div
                                    className={`w-[30px] h-[30px] rounded-lg flex items-center justify-center shrink-0
                                    ${msg.role === "bot" ? "bg-green-700" : "bg-sky-700"}`}
                                >
                                    <Leaf size={14} className="text-white" />
                                </div>
                                <div
                                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
                                    ${msg.role === "bot"
                                            ? "bg-white border border-[#DEE6D2] rounded-tl-sm"
                                            : "bg-green-700 text-white rounded-tr-sm"
                                        }`}
                                >
                                    {msg.text}
                                    {msg.card && (
                                        <div className="bg-green-50 rounded-lg p-3 mt-2.5 flex items-center gap-3">
                                            <div className="w-[34px] h-[34px] rounded-lg bg-green-700 flex items-center justify-center shrink-0">
                                                <Leaf size={16} className="text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold">{msg.card.name}</h4>
                                                <p className="text-xs text-[#4B5D42]">{msg.card.note}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-2.5 max-w-[82%] self-start">
                                <div className="w-[30px] h-[30px] rounded-lg bg-green-700 flex items-center justify-center shrink-0">
                                    <Leaf size={14} className="text-white" />
                                </div>
                                <div className="bg-white border border-[#DEE6D2] rounded-2xl rounded-tl-sm px-4 py-3.5 flex gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#4B5D42] animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#4B5D42] animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#4B5D42] animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>
                </div>
            </div>
        </div>
    );
}