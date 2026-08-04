"use client";
import React from "react";
import { motion } from "framer-motion";
import { Leaf, CloudSun, TrendingUp, Gift } from "lucide-react";
import Oxywisestartbox from "@/components/Oxywisestartbox";
import Footer from "@/components/layouts/Footer"

const features = [
    {
        icon: Leaf,
        title: "Smart plant suggestions",
        description:
            "Recommendations tuned to your location, weather, and atmosphere — not generic plant lists.",
    },
    {
        icon: CloudSun,
        title: "Weather-synced care",
        description:
            "Watering and feeding schedules adjust automatically as your local weather changes.",
    },
    {
        icon: TrendingUp,
        title: "CO2 impact tracker",
        description:
            "See how much CO2 your growing collection of plants is estimated to offset over time.",
    },
    {
        icon: Gift,
        title: "Occasion gifting",
        description:
            "Curated plant and flower pot suggestions for birthdays, housewarmings, and more.",
    },
];

export default function Features() {
    return (
        <section className="relative bg-gradient-to-b from-white via-green-50 to-white py-20 md:py-28 overflow-hidden">

            {/* Same ambient blob language as hero / how-it-works */}
            <div className="absolute top-1/2 -translate-y-1/2 -right-32 w-[420px] h-[420px] rounded-full bg-green-300/20 blur-3xl -z-0" />

            <div className="relative z-10 max-w-6xl mx-auto px-6">

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-left max-w-xl mb-14 md:mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-100 border border-green-300 shadow-sm mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-700" />
                        </span>
                        <span className="font-medium text-green-700 text-sm">Features</span>
                    </div>

                    <h2
                        style={{ fontFamily: "var(--font-gelasio)" }}
                        className="text-4xl md:text-5xl font-semibold leading-tight text-gray-900"
                    >
                        Everything to keep your{" "}
                        <span className="bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                            home green.
                        </span>
                    </h2>
                    <p className="mt-5 text-gray-600 text-lg" style={{ fontFamily: "var(--font-gelasio)" }}>
                        Built around how people actually forget to take care of plants.
                    </p>
                </motion.div>

                {/* Feature cards — 2 cols desktop, 1 col mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.12 }}
                                whileHover={{ y: -6, scale: 1.015 }}
                                className="bg-white rounded-2xl border border-green-100 p-6 md:p-7
                                flex gap-4 md:gap-5 items-start cursor-pointer
                                shadow-sm transition-shadow duration-300
                                hover:shadow-xl hover:shadow-green-700/10 hover:border-green-200"
                            >
                                <motion.div
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ repeat: Infinity, duration: 4, delay: i * 0.3 }}
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-green-700
                                    flex items-center justify-center shadow-md shadow-green-700/25 shrink-0"
                                >
                                    <Icon size={22} className="text-white" />
                                </motion.div>
                                <div>
                                    <h3
                                        style={{ fontFamily: "var(--font-gelasio)" }}
                                        className="text-lg font-semibold text-gray-900 mb-1.5"
                                    >
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm md:text-[15px] text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            <Oxywisestartbox />

        </section>
    );
}