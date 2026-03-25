"use client";

import LogoutButton from "@/components/LogoutButton";
import VoteSelections from "@/components/VoteSelections";
import { useState } from "react";
import { PacmanLoader } from "react-spinners";
import { authClient } from "./lib/auth-client";
import { useRouter } from "next/navigation";

export default function Chat() {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const { data: session } = authClient.useSession();
    const router = useRouter();

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        if (!content.trim() || loading) return;

        setLoading(true);
        try {
            const response = await fetch("/api/selections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                setContent(""); 
                // Plus besoin de reload(), router.refresh() suffit 
                // si ta page est bien en force-dynamic
                router.refresh(); 
            }
        } catch (error) {
            console.error("Erreur lors de la création :", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen  px-4">
            <div className="max-w-2xl bg-black/70 p-12 mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">
                        Votre Zelda préféré ? (ou autre jeu?)
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Proposez votre réponse ! 
                    </p>
                </div>

                {/* Form Section */}
                <div className="bg-white dark:bg-zinc-900 p-1 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                    {session ? (
                        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-1">
                            <input 
                                type="text" 
                                value={content}
                                placeholder="Ex: Ocarina of Time..." 
                                onChange={(e) => setContent(e.target.value)}
                                className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                            />
                            <button 
                                type="submit" 
                                disabled={loading || !content.trim()}
                                className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-2.5 rounded-xl font-medium transition-all hover:opacity-90 disabled:opacity-30 flex items-center gap-2 min-w-[140px] justify-center"
                            >
                                {loading ? (
                                    <PacmanLoader size={8} color="currentColor"/>
                                ) : (
                                    <>
                                        <span>Proposer</span>
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="py-4 text-center">
                            <p className="text-sm text-zinc-500 italic">
                                Connectez-vous pour participer au vote communautaire.
                            </p>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                            Classement actuel
                        </h2>
                        {session && <LogoutButton />}
                    </div>
                    
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden p-4">
                        <VoteSelections />      
                    </div>
                </div>
            </div>
        </main>
    );
}