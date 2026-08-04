"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Mail, Lock, Eye, EyeOff } from "lucide-react";
import GardenBackground from "@/components/auth/GardenBackground";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main className="relative min-h-screen flex items-center justify-center px-6 py-12">
            <GardenBackground />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-green-100
                rounded-3xl shadow-2xl shadow-green-900/10 p-8 md:p-10"
            >
                {/* Brand */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-9 h-9 rounded-xl bg-green-700 flex items-center justify-center">
                        <Leaf size={18} className="text-white" />
                    </div>
                    <span style={{ fontFamily: "var(--font-gelasio)" }} className="text-lg font-semibold text-gray-900">
                        oxywise.ai
                    </span>
                </div>

                <h1 style={{ fontFamily: "var(--font-gelasio)" }} className="text-3xl font-semibold text-gray-900 mb-2">
                    Welcome back
                </h1>
                <p className="text-gray-600 text-sm mb-8">
                    Log in to pick up where your garden left off.
                </p>

                {/* Google auth */}
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl
                    py-3 mb-6 font-medium text-sm text-gray-700 bg-white
                    hover:border-gray-300 hover:shadow-sm transition-all"
                >
                    <GoogleIcon />
                    Continue with Google
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400 font-mono">or</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Form */}
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200
                                text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <Link href="/forgot-password" className="text-xs text-green-700 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200
                                text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold
                        py-3 rounded-xl shadow-lg shadow-green-700/25 transition-colors mt-2"
                    >
                        Log in
                    </motion.button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-7">
                    New to Oxywise?{" "}
                    <Link href="/signup" className="text-green-700 font-semibold hover:underline">
                        Create an account
                    </Link>
                </p>
            </motion.div>
        </main>
    );
}

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.9 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.7 27 35.6 24 35.6c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.6 39.6 16.3 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C39.9 36.9 44 31.3 44 24c0-1.3-.1-2.7-.4-3.5z" />
        </svg>
    );
}