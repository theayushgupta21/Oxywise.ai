"use client";
import React, { useState } from "react";
import Link from "next/link";
import { LuLeaf } from "react-icons/lu";
import { useAuth } from "@/components/providers/AuthProvider";

export default function Oxywise() {
    const { user, loading, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 bg-[#F7F9F2] border-b border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#3c6319] shadow-md shrink-0">
                    <LuLeaf className="text-white text-xl sm:text-2xl" />
                </div>

                <div className="min-w-0">
                    <Link href="/">
                        <h1 className="text-lg sm:text-2xl font-bold text-[#43631b] leading-none">
                            Oxywise<span className="text-[#4A7C1F]">.ai</span>
                        </h1>
                        <p className="hidden sm:block text-[10px] text-gray-500 mt-1">
                            AI Powered Plant Intelligence
                        </p>
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-1">
                {!loading && user ? (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setMenuOpen((v) => !v)}
                            className="flex items-center gap-2 rounded-full border border-green-700 bg-white px-3 py-2 text-sm font-semibold text-green-700 shadow-sm"
                        >
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-700 text-xs text-white">
                                {user.name?.[0]?.toUpperCase() || "U"}
                            </span>
                            <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 top-12 z-50 w-48 rounded-2xl border border-green-100 bg-white p-2 shadow-xl">
                                <Link href="/profile" className="block rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-green-50">Profile</Link>
                                <Link href="/chatbot" className="block rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-green-50">AI Assistant</Link>
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
                ) : (
                    <>
                        <Link href="/login" className="px-3 py-2 sm:px-5 text-sm sm:text-base text-[#4A7C1F] font-semibold border border-[#4A7C1F] rounded-full hover:bg-[#4A7C1F] hover:text-white transition duration-300">
                            Login
                        </Link>

                        <Link href="/signup" className="px-3 py-2 sm:px-5 text-sm sm:text-base text-[#4A7C1F] font-semibold border border-[#4A7C1F] rounded-full hover:bg-[#4A7C1F] hover:text-white transition duration-300 shadow-md">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}