"use client";
import { useEffect } from "react";
import { useChatStore } from "@/store/useChatStore";
import { Plus, Leaf, Menu, X, House } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
    const {
        history,
        activeChatId,
        sidebarOpen,
        isLoadingHistory,
        startNewChat,
        loadChat,
        toggleSidebar,
        fetchHistory,
    } = useChatStore();

    const groups = ["Today", "Yesterday", "Previous 7 days"] as const;

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => toggleSidebar(false)} />
            )}

            {/* Persistent top strip — always shows the logo, even when sidebar is collapsed */}
            <div className="fixed top-0 left-0 z-50 h-14 flex items-center gap-2 px-3">
                <button
                    onClick={() => toggleSidebar()}
                    className="w-9 h-9 rounded-lg bg-white border border-[#DEE6D2] flex items-center justify-center
                    shadow-sm hover:border-green-600 hover:text-green-700 transition-colors shrink-0"
                    aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                >
                    {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
                </button>

                {!sidebarOpen && (
                    <>
                        <div className="flex items-center gap-2 bg-white/90 backdrop-blur border border-[#DEE6D2] rounded-lg px-2.5 py-1.5 shadow-sm">
                            <div className="w-6 h-6 rounded-md bg-green-700 flex items-center justify-center">
                                <Leaf size={12} className="text-white" />
                            </div>
                            <Link href="/">
                                <span className="font-semibold text-sm">oxywise.ai</span>
                            </Link>
                        </div>


                    </>



                )}
            </div>

            <aside
                className={`fixed md:static z-50 h-full bg-[#F1F5EA] border-r border-[#DEE6D2]
                flex flex-col transition-all duration-300 overflow-hidden
                ${sidebarOpen ? "w-[268px] translate-x-0" : "w-0 -translate-x-full md:translate-x-0"}`}
            >
                <div className="w-[268px] flex flex-col h-full">
                    <div className="p-4 pt-16">
                        <button
                            onClick={startNewChat}
                            className="w-full flex items-center gap-2 bg-white border border-[#DEE6D2] rounded-lg
                            px-3 py-2.5 text-sm font-semibold hover:border-green-600 hover:bg-green-50 transition-colors"
                        >
                            <Plus size={15} />
                            New chat
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-2.5 pb-4">
                        {isLoadingHistory && (
                            <p className="text-xs text-[#8CA07E] font-mono px-2 py-4">Loading chats…</p>
                        )}

                        {!isLoadingHistory && history.length === 0 && (
                            <p className="text-xs text-[#8CA07E] font-mono px-2 py-4">No chats yet — start one!</p>
                        )}

                        {groups.map((group) => {
                            const items = history.filter((h) => h.group === group);
                            if (!items.length) return null;
                            return (
                                <div key={group}>
                                    <p className="font-mono text-[10.5px] uppercase tracking-wider text-[#8CA07E] px-2 pt-3.5 pb-1.5">
                                        {group}
                                    </p>
                                    {items.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => loadChat(item.id)}
                                            className={`w-full text-left truncate px-2.5 py-2 rounded-lg text-sm mb-0.5 transition-colors
                                            ${activeChatId === item.id
                                                    ? "bg-green-100 text-[#1F3D1A] font-semibold"
                                                    : "text-[#4B5D42] hover:bg-[#E4ECD8]"
                                                }`}
                                        >
                                            {item.title}
                                        </button>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </aside>
        </>
    );
}