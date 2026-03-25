"use client"

import { authClient } from "@/app/lib/auth-client";
import { useRouter} from "next/navigation";

export default function LogoutButton(){
    const router = useRouter();

    async function handleSignOut(){
        await authClient.signOut();
        router.push("/login");
    }
    return <button onClick={handleSignOut}> Se déconnecter</button>;

}