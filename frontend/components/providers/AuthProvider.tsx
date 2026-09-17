"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Link from "next/link";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMeApi } from "@/lib/api";

export type AuthUser = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    authProvider?: "local" | "google";
};

type AuthContextType = {
    user: AuthUser | null;
    loading: boolean;
    login: (token: string, user: AuthUser) => void;
    logout: () => void;
    setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [showReminder, setShowReminder] = useState(false);

    useEffect(() => {
        const restoreSession = async () => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const data = await getMeApi(token);
                setUser(data.user || null);
            } catch {
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (user || loading) {
            setShowReminder(false);
            return;
        }

        const path = window.location.pathname;
        if (path.startsWith("/chatbot")) return;

        const reminderKey = "oxywiseAuthReminderDismissed";
        const shownKey = "oxywiseAuthReminderShown";
        const dismissed = localStorage.getItem(reminderKey) === "1";
        const alreadyShown = sessionStorage.getItem(shownKey) === "1";

        if (dismissed || alreadyShown) return;

        const timer = setTimeout(() => {
            setShowReminder(true);
            sessionStorage.setItem(shownKey, "1");
        }, 60000);

        return () => clearTimeout(timer);
    }, [user, loading]);

    const login = (token: string, nextUser: AuthUser) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
            localStorage.removeItem("oxywiseAuthReminderDismissed");
            sessionStorage.setItem("oxywiseAuthReminderShown", "1");
        }
        setUser(nextUser);
        setShowReminder(false);
    };

    const logout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.setItem("oxywiseAuthReminderDismissed", "1");
        }
        setUser(null);
        setShowReminder(false);
    };

    const value = useMemo<AuthContextType>(
        () => ({ user, loading, login, logout, setUser }),
        [user, loading]
    );

    return (
        <AuthContext.Provider value={value}>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                {children}
                {!loading && !user && showReminder && typeof window !== "undefined" && !window.location.pathname.startsWith("/chatbot") && (
                    <div className="fixed bottom-4 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl border border-green-200 bg-white/95 p-4 shadow-xl shadow-green-900/10 backdrop-blur">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Want personalized plant recommendations?</p>
                                <p className="mt-1 text-sm text-gray-600">
                                    Create your free account and let Oxywise remember your preferences.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    localStorage.setItem("oxywiseAuthReminderDismissed", "1");
                                    setShowReminder(false);
                                }}
                                className="text-sm text-gray-400 hover:text-gray-700"
                                aria-label="Dismiss reminder"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                            <Link href="/login" className="flex-1 rounded-full bg-green-700 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-green-800">
                                Login
                            </Link>
                            <Link href="/signup" className="flex-1 rounded-full border border-green-700 px-4 py-2 text-center text-sm font-semibold text-green-700 hover:bg-green-50">
                                Create account
                            </Link>
                            <button
                                type="button"
                                onClick={() => {
                                    localStorage.setItem("oxywiseAuthReminderDismissed", "1");
                                    setShowReminder(false);
                                }}
                                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                            >
                                Continue exploring
                            </button>
                        </div>
                    </div>
                )}
            </GoogleOAuthProvider>
        </AuthContext.Provider>
    );
}