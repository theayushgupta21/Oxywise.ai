"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { googleAuthApi, loginApi } from "@/lib/api";
import { Leaf, Mail, Lock, Eye, EyeOff } from "lucide-react";
import GardenBackground from "@/components/auth/GardenBackground";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Email and password are required.");
            return;
        }

        setLoading(true);
        try {
            const data = await loginApi(email, password);
            login(data.token, data.user);
            router.push("/chatbot");
        } catch (err: any) {
            setError(err.message || "Unable to log in right now.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen flex items-center justify-center px-6 py-12">
            <GardenBackground />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-green-100 rounded-3xl shadow-2xl shadow-green-900/10 p-8 md:p-10"
            >
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

                <div className="mb-6">
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            if (!credentialResponse.credential) {
                                setError("Google sign-in failed — no credential received");
                                return;
                            }
                            setError("");
                            setLoading(true);
                            try {
                                const data = await googleAuthApi(credentialResponse.credential);
                                login(data.token, data.user);
                                router.push("/chatbot");
                            } catch (err: any) {
                                setError(err.message || "Google sign-in failed");
                            } finally {
                                setLoading(false);
                            }
                        }}
                        onError={() => setError("Google sign-in failed")}
                        width="100%"
                        text="continue_with"
                        shape="rectangular"
                    />
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400 font-mono">or</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
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

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl shadow-lg shadow-green-700/25 transition-colors mt-2 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? "Logging in..." : "Log in"}
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