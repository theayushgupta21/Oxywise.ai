"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Leaf, Cloud, MapPin, Wind } from "lucide-react";
import Link from "next/link";

export default function Herosection() {
    return (
        <section className="relative overflow-hidden bg-linear-to-br from-green-50 via-white to-green-100 min-h-[90vh] flex items-center">
            <div className="absolute -top-24 -right-16 sm:-top-40 sm:-right-32 w-52 h-52 sm:w-80 sm:h-80 lg:w-120 lg:h-120 rounded-full bg-green-300/30 blur-3xl z-0" />
            <div className="absolute -bottom-24 -left-16 sm:-bottom-40 sm:-left-32 w-52 h-52 sm:w-72 sm:h-72 lg:w-95 lg:h-95 rounded-full bg-sky-200/40 blur-3xl z-0" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 lg:items-center">
                <motion.div
                    initial={{ opacity: 0, x: -80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center lg:text-left"
                >
                    <motion.div
                        animate={{ y: [0, -7, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 rounded-full bg-green-100 border border-green-300 shadow-sm"
                    >
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-700" />
                        </span>
                        <Sparkles className="text-green-700" size={18} />
                        <span className="font-medium text-green-700 text-xs sm:text-sm">
                            AI Powered Plant Assistant
                        </span>
                    </motion.div>

                    <h1 className="mt-6 sm:mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold font-gelasio leading-tight text-gray-900">
                        Stop guessing.
                        <br />
                        <span className="bg-linear-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                            Start growing.
                        </span>
                    </h1>

                    <p className="mt-5 sm:mt-6 text-gray-600 max-w-xl text-base sm:text-lg mx-auto lg:mx-0">
                        Oxywise reads your location, weather, and air quality to tell you
                        exactly which plants will survive in your home then keeps you
                        on schedule so none of them die on your watch.
                    </p>

                    <motion.div
                        className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center lg:justify-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Link
                            href="/chatbot"
                            className="bg-white border border-green-200 px-5 py-3 sm:px-7 rounded-full text-green-800 hover:text-white font-bold shadow-lg shadow-green-700/30 transition-all duration-200 hover:bg-green-800 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-700/40 text-center"
                        >
                            Ask Oxywise what to plant
                        </Link>

                        <Link
                            href="/#threesteps"
                            className="border border-green-700 px-5 py-3 sm:px-7 rounded-full text-green-800 hover:text-white font-bold transition-all duration-200 hover:bg-green-800 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-700/40 text-center"
                        >
                            See how it works
                        </Link>
                    </motion.div>

                    <div className="mt-8 sm:mt-10 flex flex-col gap-4 text-left sm:flex-row sm:gap-6 lg:gap-8 text-sm text-gray-500 font-mono">
                        <div><span className="block text-xl font-gelasio font-semibold text-gray-800">40+</span>climate zones supported</div>
                        <div><span className="block text-xl font-gelasio font-semibold text-gray-800">2.1kg</span>avg. CO2 offset / plant / yr</div>
                        <div><span className="block text-xl font-gelasio font-semibold text-gray-800">Daily</span>weather-synced reminders</div>
                    </div>
                </motion.div>

                <div className="relative flex justify-center items-center min-h-[300px] sm:min-h-[420px] lg:h-[420px] w-full">
                    <motion.div
                        animate={{ scale: [1, 0.95, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="w-56 h-56 sm:w-80 sm:h-80 lg:w-105 lg:h-105 rounded-full bg-linear-to-r from-green-600 to-green-300 blur-3xl absolute"
                    />

                    <motion.div
                        animate={{ y: [0, -16, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 rounded-4xl bg-white shadow-2xl flex flex-col items-center justify-center gap-3 border border-green-100"
                    >
                        <motion.div
                            animate={{ rotate: [0, 6, -6, 0] }}
                            transition={{ repeat: Infinity, duration: 6 }}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-green-700 flex items-center justify-center shadow-lg shadow-green-700/30"
                        >
                            <motion.div
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-green-700 flex items-center justify-center"
                                animate={{
                                    boxShadow: [
                                        "0 0 0 rgba(34,197,94,0.3)",
                                        "0 0 35px rgba(34,197,94,0.7)",
                                        "0 0 0 rgba(34,197,94,0.3)",
                                    ],
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <motion.div
                                    animate={{
                                        scale: [0.9, 1.15, 1],
                                        rotate: [0, -8, 8, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeIn",
                                    }}
                                >
                                    <Leaf size={32} className="text-white sm:size-10" />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">Snake Plant</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 font-mono">98% match for your home</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                        transition={{ y: { repeat: Infinity, duration: 3.5 }, opacity: { delay: 0.6 }, scale: { delay: 0.6 } }}
                        className="absolute top-3 left-1 sm:top-8 sm:left-4 lg:top-16 lg:left-8 z-20 flex items-center gap-2 bg-white/90 backdrop-blur border border-green-200 px-3 py-2 rounded-full shadow-lg"
                    >
                        <MapPin className="text-green-700" size={15} />
                        <span className="text-[10px] sm:text-xs font-mono text-gray-700">Bengaluru, IN</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                        transition={{ y: { repeat: Infinity, duration: 3.5 }, opacity: { delay: 0.6 }, scale: { delay: 0.6 } }}
                        className="absolute top-1 right-1 sm:top-4 sm:right-6 lg:top-8 lg:right-12 z-20 flex items-center gap-2 bg-white/90 backdrop-blur border border-green-200 px-3 py-2 rounded-full shadow-lg"
                    >
                        <MapPin className="text-green-700" size={15} />
                        <span className="text-[10px] sm:text-xs font-mono text-gray-700">Delhi, IN</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                        transition={{ y: { repeat: Infinity, duration: 3.5 }, opacity: { delay: 0.6 }, scale: { delay: 0.6 } }}
                        className="absolute top-24 right-2 sm:top-32 sm:right-10 lg:top-44 lg:right-20 z-20 flex items-center gap-2 bg-white/90 backdrop-blur border border-green-200 px-3 py-2 rounded-full shadow-lg"
                    >
                        <MapPin className="text-green-700" size={15} />
                        <span className="text-[10px] sm:text-xs font-mono text-gray-700">Mumbai, IN</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                        transition={{ y: { repeat: Infinity, duration: 3 }, opacity: { delay: 0.8 }, scale: { delay: 0.8 } }}
                        className="absolute bottom-2 right-0 sm:bottom-8 sm:right-2 lg:bottom-10 lg:right-0 z-20 flex items-center gap-2 bg-white/90 backdrop-blur border border-sky-200 px-3 py-2 rounded-full shadow-lg"
                    >
                        <Cloud className="text-sky-600" size={15} />
                        <span className="text-[10px] sm:text-xs font-mono text-gray-700">31°C · humid</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
                        transition={{ y: { repeat: Infinity, duration: 4.5 }, opacity: { delay: 1 }, scale: { delay: 1 } }}
                        className="absolute bottom-8 left-0 sm:bottom-14 sm:left-2 lg:bottom-10 lg:left-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur border border-amber-200 px-3 py-2 rounded-full shadow-lg"
                    >
                        <Wind className="text-amber-600" size={15} />
                        <span className="text-[10px] sm:text-xs font-mono text-gray-700">1.8kg CO2/yr</span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}