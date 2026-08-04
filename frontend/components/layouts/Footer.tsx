"use client";
import React from "react";
import { Leaf } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-green-100 bg-white">
            <div className="max-w-6xl mx-auto px-6 h-16
            flex items-center justify-between gap-4">

                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-green-700 flex items-center justify-center">
                        <Link href="/">
                            <Leaf size={14} className="text-white" />
                        </Link>
                    </div>
                    <span
                        style={{ fontFamily: "var(--font-gelasio)" }}
                        className="text-sm text-gray-600"
                    >
                        © 2026 Oxywise.ai
                    </span>
                </div>

                <p
                    style={{ fontFamily: "var(--font-gelasio)" }}
                    className="text-sm text-gray-600"
                >
                    Grow smarter, breathe easier.
                </p>
            </div>
        </footer>
    );
}