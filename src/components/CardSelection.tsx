import VoteButton from "./VoteButton";
import { ImCross } from "react-icons/im";


export default function CardSelection({ s, userId }: { s: any, userId: string | undefined }) {
    const isOwn = s.userId === userId;

    async function deleteSelection(_id: string, userId: string) {
        const response = await fetch("/api/selections", {
            method: "DELETE", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id, userId })
        });
        
        if (response.ok) {
            alert("Sélection supprimée");
            window.location.reload();
        
        }
    }

    return (
        <div className="flex flex-col bg-zinc-900 border border-zinc-800 text-white rounded-xl p-4 w-full max-w-xs shadow-lg">
            <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-base flex-1">{s.content}</p>
                {isOwn && (
                    <button 
                        onClick={() => deleteSelection(s._id, s.userId)}
                        className="text-zinc-500 hover:text-red-500 text-xs ml-2"
                    >
                        <ImCross />
                    </button>
                )}
            </div>

           
            <p className="text-zinc-400 text-xs mb-3">
                {s.votes?.length || 0} personne(s) ont voté
            </p>

            
            <VoteButton selectionId={s._id} voters={s.votes || []} />
        </div>
    );
}