"use client";

import { useState } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";
import { authClient } from "../lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage(){

        const [email,setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [loading, setLoading] = useState(false);
        const router= useRouter();



        async function handleSubmit(e: React.SubmitEvent){
            e.preventDefault();
            setLoading(true);
            const {error} = await authClient.signIn.email({email,password});
            if(error){
                console.error(error);
                alert(error.message);
                setLoading(false);
            }else{
                router.push("/");
            }
            
        }

        return(
        
        <div className="container mx-auto justify-center my-12">
            <h1 className="text-center mx-4 text-3xl font-bold mb-4"> Connectez vous :) </h1>
            <div className="w-full max-w-md mx-auto space-y-8 p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
                
                <form onSubmit={handleSubmit} className="space-y-4">
                
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-400 uppercase ml-1">Email</label>
                        <input 
                            type="email" 
                            placeholder="email@example.com" 
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-400 uppercase ml-1">Mot de passe</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3 rounded-xl font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center"
                    >
                        {loading ? <PacmanLoader size={10} color="currentColor"/> : "Se connecter"}
                    </button>
                </form>

            
                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        Pas encore de compte ?{" "}
                        <Link 
                            href="/register" 
                            className="text-blue-500 font-semibold hover:underline decoration-2 underline-offset-4"
                        >
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
 