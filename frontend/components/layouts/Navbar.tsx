import React from "react";
import Link from "next/link";
import { LuLeaf } from "react-icons/lu";

export default function Oxywise() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-[#F7F9F2] border-b border-gray-200 shadow-sm">
            {/* Logo */}
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#3c6319] shadow-md">
                    <LuLeaf className="text-white text-2xl" />
                </div>

                <div>
                    <Link href="/">
                        <h1 className="text-2xl font-bold text-[#43631b]">
                            Oxywise<span className="text-[#4A7C1F]">.ai</span>
                        </h1>
                        <p className="text-xs text-gray-500">
                            AI Powered Plant Intelligence
                        </p>
                    </Link>
                </div>
            </div>


            <div className="flex items-center gap-1">
                <Link href="/login" className="px-5 py-2 text-[#4A7C1F] font-semibold border border-[#4A7C1F] rounded-4xl hover:bg-[#4A7C1F] hover:text-white transition duration-300">
                    Login
                </Link>

                <Link href="/signup" className="px-5 py-2 text-[#4A7C1F] font-semibold border-[#4A7C1F] border rounded-4xl  hover:bg-[#4A7C1F] hover:text-white transition duration-300 shadow-md">
                    Sign Up
                </Link>
            </div>
        </header >
    );
}