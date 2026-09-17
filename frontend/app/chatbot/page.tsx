"use client";
import Link from "next/link";
import Chatbot from "@/views/Chatbot";
import { useAuth } from "@/components/providers/AuthProvider";

export default function ChatbotPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F7F9F2] text-[#1F3D1A]">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-700" />
                    <p className="mt-4 text-sm text-gray-600">Loading your plant assistant...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#F7F9F2] px-6 py-12">
                <div className="w-full max-w-lg rounded-3xl border border-green-200 bg-white p-8 text-center shadow-xl shadow-green-900/5">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-700 text-white">
                        <span className="text-2xl">🌿</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Sign in to unlock your personalized AI plant assistant.</h1>
                    <p className="mt-3 text-gray-600">
                        Save plant preferences, get tailored recommendations, and chat with Oxywise using your profile context.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link href="/login" className="flex-1 rounded-full bg-green-700 px-5 py-3 text-center font-semibold text-white hover:bg-green-800">
                            Login
                        </Link>
                        <Link href="/signup" className="flex-1 rounded-full border border-green-700 px-5 py-3 text-center font-semibold text-green-700 hover:bg-green-50">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return <Chatbot />;
}