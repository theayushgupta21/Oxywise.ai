"use client";
import React from "react";
import { motion } from "framer-motion";
import { MapPin, CloudSun, Bell } from "lucide-react";
import Features from "./Features";

const steps = [
    {
        number: "01",
        icon: MapPin,
        title: "Tell us where you live",
        description:
            "Share your city and space  balcony, indoor corner, terrace  so every suggestion matches your real conditions.",
    },
    {
        number: "02",
        icon: CloudSun,
        title: "Get matched plants",
        description:
            "Oxywise cross-checks local weather and climate data to suggest seeds and plants that will actually survive.",
    },
    {
        number: "03",
        icon: Bell,
        title: "Follow your care plan",
        description:
            "Daily, occasional, or alternate-day reminders keep every plant on schedule  synced to real-time weather.",
    },
];

export default function HowItWorks() {
    return (

        <section id="threesteps" className="relative bg-linear-to-b from-green-100 via-white to-white py-14 overflow-hidden">

            {/* Same ambient blob language as the hero */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-125 h-125 rounded-full bg-green-300/20 blur-3xl z-0" />

            <div className="relative z-10 max-w-6xl mx-auto px-6">


                {/* Heading aligned to the left */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-left max-w-xl mr-auto mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-100 border border-green-300 shadow-sm mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-700" />
                        </span>
                        <span className="font-medium text-green-700 text-sm">How it works</span>
                    </div>

                    <h2 className="text-5xl font-bold leading-tight text-gray-900">
                        Three steps from bare balcony
                        <br />
                        to{" "}
                        <span className="bg-linear-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                            green home.
                        </span>
                    </h2>
                    <p className="mt-6 text-gray-600 text-lg">
                        No plant knowledge needed  Oxywise handles the decisions,
                        you handle the watering can.
                    </p>
                </motion.div>

                {/* Steps — horizontal on desktop, horizontal-scroll on mobile */}
                <div
                    className="flex md:grid md:grid-cols-3 gap-6 md:gap-8
                    overflow-x-auto md:overflow-visible
                    snap-x snap-mandatory md:snap-none
                    pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0
                    scrollbar-hide"
                >
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.2 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="snap-center shrink-0 w-[85%] sm:w-[70%] md:w-auto
                                bg-white rounded-2xl border border-green-100 p-8
                                flex flex-col items-start cursor-pointer
                                shadow-md transition-shadow duration-300
                                hover:shadow-2xl hover:shadow-green-700/10 hover:border-green-200"
                            >
                                <motion.div
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ repeat: Infinity, duration: 4, delay: i * 0.3 }}
                                    className="w-16 h-16 rounded-2xl bg-green-700 flex items-center justify-center shadow-lg shadow-green-700/30 mb-6"
                                >
                                    <Icon size={28} className="text-white" />
                                </motion.div>

                                <span className="text-xs font-mono text-green-700 bg-green-50 px-3 py-1 rounded-full mb-4">
                                    Step {step.number}
                                </span>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Scroll hint — mobile only */}
                <p className="md:hidden text-center text-xs text-gray-400 font-mono mt-4">
                    swipe to see all steps →
                </p>
            </div>
            <Features />
        </section>

    );
}