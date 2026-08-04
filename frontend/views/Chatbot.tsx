"use client";
import Sidebar from "@/views/chat/Sidebar";
import ChatWindow from "@/views/chat/ChatWindow";
import InputBar from "@/views/chat/InputBar";

export default function Chatbot() {
    return (
        <div className="flex h-screen bg-[#F7F9F2] text-[#1F3D1A] overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <ChatWindow />
                <InputBar />
            </div>
        </div>
    );
}