"use client";

import { useState } from "react";
import { authClient } from "@/app/lib/auth-client"; 
import { useRouter } from "next/navigation";


interface VoteButtonProps {
    selectionId: string;
    voters: string[];
}

export default function VoteButton({ selectionId, voters = [] }: VoteButtonProps) {
    const { data: session } = authClient.useSession();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    
    const hasVotedForThis = session?.user && voters.includes(session.user.id);

    const handleAction = async () => {
       
        if (!session) return alert("Connectez-vous pour voter !");
        
        setLoading(true);
        const action = hasVotedForThis ? "cancel" : "vote";

        try {
            const res = await fetch("/api/selections", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selectionId, action }),
            });

            if (res.ok) {
                window.location.reload();
                router.refresh(); 
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleAction}
            disabled={loading}
            className={`flex w-full mt-2 px-4 py-2 rounded-lg transition-all ${
                hasVotedForThis 
                ? "bg-red-500/10 text-red-500 border border-red-500/20" 
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
        >
                <span>{hasVotedForThis ? "❤️" : "🤍"}</span>
            Voter
            
        </button>
    );
}