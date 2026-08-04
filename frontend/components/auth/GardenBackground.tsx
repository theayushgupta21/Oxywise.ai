"use client";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Three.js needs the browser — load it client-side only, with no SSR
const GardenScene = dynamic(() => import("./GardenScene"), { ssr: false });

export default function GardenBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden -z-10">
            <Suspense fallback={<div className="absolute inset-0 bg-[#EAF3DE]" />}>
                <GardenScene />
            </Suspense>

            {/* soft ambient blobs — keep some depth on top of the 3D layer */}
            <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-green-300/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-24 w-[380px] h-[380px] rounded-full bg-sky-200/25 blur-3xl pointer-events-none" />

            {/* readability fade — center stays soft so the auth card is easy to read */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white/70 pointer-events-none" />

            {/* ground glow — gives the rising particles somewhere to "grow" from */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-700/15 to-transparent pointer-events-none" />
        </div>
    );
}