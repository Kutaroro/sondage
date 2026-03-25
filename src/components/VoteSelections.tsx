"use client";

import { authClient } from "@/app/lib/auth-client";
import { useEffect, useState } from "react";
import CardSelection from "./CardSelection";



export default function VoteSelections(){
    const [selections,setSelections]= useState<Selection[]>([]);
    const {data:session}=authClient.useSession();


    useEffect(()=>{
        async function fetchSelections(){
            const request = await fetch("/api/selections");
            if (!request.ok){
                console.log(request.status);
                return;
            }
            const data = await request.json();
            setSelections(data);
        }
        fetchSelections();
        // setInterval(fetchSelections,2000);
    },[]);

    if (selections.length === 0) {
        return <p>Aucun selection pour le moment.</p>;
    }

    return (
        <div className="grid grid-cols-4 gap-4">
            {selections
                .sort((a, b) => (b.votes?.length || 0) - (a.votes?.length || 0))
                .map((s) => {
                    return <CardSelection key={s._id} s={s} userId={session?.user.id} />;
                })
            }
        </div>
        );
}