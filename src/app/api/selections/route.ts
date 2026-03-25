import { auth } from "@/app/lib/auth";
import { getDb } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { headers } from "next/dist/server/request/headers";
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

export async function GET(){
    const db =  await getDb();
    const selections = await db.collection("selections").find().toArray();
    return NextResponse.json(selections);
}


export async function POST(request: NextRequest){
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session)
        return NextResponse.json({error:"Non autorisé"}, {status:401});
    

    const {content} = await request.json();
    if(!content) 
        return NextResponse.json({error:"selection vide"}, {status:400});

    const db = await getDb();
    const selection = {
        content : content,
        createdAt: new Date(),
        userId: session.user.id,
        username: session.user.name,
        votes:[],
    
    };

    await db.collection("selections").insertOne(selection);
    return NextResponse.json(selection, {status:201});
}


export async function PATCH(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    
    // Si la session est nulle ici, le fetch s'arrête
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { selectionId, action } = await req.json();
    const db = await getDb();
    const userId = session.user.id;

    try {
        if (action === "vote") {
            // Optionnel : Retirer les votes précédents sur d'autres sélections
            await db.collection("selections").updateMany(
                { votes: userId },
                { $pull: { votes: userId } as any }
            );
            // Ajouter le vote sur la sélection actuelle
            await db.collection("selections").updateOne(
                { _id: new ObjectId(selectionId) },
                { $addToSet: { votes: userId } as any }
            );
        } else {
            // Action "cancel"
            await db.collection("selections").updateOne(
                { _id: new ObjectId(selectionId) },
                { $pull: { votes: userId } as any }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erreur DB:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest){
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session)
        return NextResponse.json({error:"Non autorisé"}, {status:401});

    const {_id, userId} = await request.json();

    if (!_id || !userId )
        return NextResponse.json({error:"Json non valide"},{status:400});

    if (userId !== session.user.id)
        return NextResponse.json({error:"Non autorisé"}, {status:401});

    const db = await getDb();
    await db.collection("selections").deleteOne({"_id": new ObjectId(_id)});

    return NextResponse.json({selection: "Choix supprimé"}, {status:200});

}