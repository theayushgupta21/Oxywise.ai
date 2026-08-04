"use client";
import React, { useRef } from "react";
import { useChatStore } from "@/store/useChatStore";
import { Image as ImageIcon, Paperclip, MapPin, Cloud, Send, X } from "lucide-react";

export default function InputBar() {
    const {
        input,
        setInput,
        sendMessage,
        imageFile,
        setImageFile,
        docFile,
        setDocFile,
        locationOn,
        toggleLocation,
        weatherOn,
        toggleWeather,
    } = useChatStore();

    const imageInputRef = useRef<HTMLInputElement>(null);
    const docInputRef = useRef<HTMLInputElement>(null);

    const hasContext = imageFile || docFile || locationOn || weatherOn;

    return (
        <div className="border-t border-[#DEE6D2] bg-[#F7F9F2] py-3">
            <div className="max-w-[760px] mx-auto px-6">

                {hasContext && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {imageFile && <Chip label={`🖼️ ${imageFile.name}`} onRemove={() => setImageFile(null)} />}
                        {docFile && <Chip label={`📎 ${docFile.name}`} onRemove={() => setDocFile(null)} />}
                        {locationOn && <Chip label="📍 Using current location" onRemove={toggleLocation} />}
                        {weatherOn && <Chip label="☁️ Weather context on" onRemove={toggleWeather} />}
                    </div>
                )}

                <div className="bg-white border border-[#DEE6D2] rounded-[20px] p-3">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        rows={1}
                        placeholder="Ask Oxywise about a plant, city, or care routine..."
                        className="w-full resize-none outline-none text-sm bg-transparent placeholder:text-[#9AA893]"
                    />

                    <div className="flex items-center justify-between mt-1.5">
                        <div className="flex items-center gap-1">
                            <ToolButton
                                icon={<ImageIcon size={15} />}
                                label="Image"
                                active={!!imageFile}
                                onClick={() => imageInputRef.current?.click()}
                            />
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                            />

                            <ToolButton
                                icon={<Paperclip size={15} />}
                                label="Document"
                                active={!!docFile}
                                onClick={() => docInputRef.current?.click()}
                            />
                            <input
                                ref={docInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                className="hidden"
                                onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
                            />

                            <ToolButton icon={<MapPin size={15} />} label="Location" active={locationOn} onClick={toggleLocation} />
                            <ToolButton icon={<Cloud size={15} />} label="Weather" active={weatherOn} onClick={toggleWeather} />
                        </div>

                        <button
                            onClick={() => sendMessage()}
                            className="w-9 h-9 rounded-full bg-green-700 hover:bg-green-800
                            flex items-center justify-center transition-colors shrink-0"
                        >
                            <Send size={15} className="text-white" />
                        </button>
                    </div>
                </div>

                <p className="text-center font-mono text-[10.5px] text-[#9AA893] mt-2">
                    Reference UI only — wire uploads, location, and send to your real backend/API.
                </p>
            </div>
        </div>
    );
}

function ToolButton({
    icon,
    label,
    active,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors border
            ${active ? "bg-green-100 text-green-700 border-green-300" : "text-[#4B5D42] hover:bg-green-50 hover:text-green-700 border-transparent"}`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-1.5 font-mono text-[11.5px] px-2.5 py-1.5 rounded-full border border-[#DEE6D2] bg-white text-[#4B5D42]">
            {label}
            <button onClick={onRemove} className="hover:text-red-600">
                <X size={11} />
            </button>
        </span>
    );
}