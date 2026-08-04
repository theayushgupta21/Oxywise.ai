"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CtaBand() {
    return (
        <section className="relative py-16 md:py-20 px-6">
            <div className="max-w-2xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-3xl bg-green-900
                    px-6 py-10 md:px-12 md:py-14 text-center"
                >
                    {/* Ambient glow inside the dark band */}
                    <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-green-500/20 blur-3xl -z-0" />
                    <div className="absolute -bottom-20 -right-14 w-64 h-64 rounded-full bg-green-400/10 blur-3xl -z-0" />

                    <div className="relative z-10">
                        <h2
                            style={{ fontFamily: "var(--font-gelasio)" }}
                            className="text-2xl md:text-3xl font-semibold text-white leading-tight"
                        >
                            Your home is one plant away
                            <br className="hidden md:block" /> from greener air.
                        </h2>

                        <p
                            style={{ fontFamily: "var(--font-gelasio)" }}
                            className="mt-4 text-green-100/80 text-sm md:text-base"
                        >
                            Get started free — no plant experience required.
                        </p>
                        <motion.button

                            whileHover={{ y: -3, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-7 inline-flex items-center gap-2 bg-white text-green-800
                            px-6 py-3 rounded-xl font-semibold shadow-lg shadow-black/20 text-sm md:text-base
                            transition-shadow duration-300 hover:shadow-xl"
                        >
                            <Link href="/chatbot">
                                Get started with Oxywise
                            </Link>
                            <ArrowRight size={16} />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}