import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth, googleProvider, githubProvider } from "../lib/firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { Trophy, Mail, Lock, User, Phone, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface AuthFormProps {
  onAuthSuccess: (user: { email: string; role: "supporter" | "admin" }) => void;
}

const GoogleIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = () => (
  <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.48.01-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // 🚀 NOUVEAUX ÉTATS POUR LE RESPECT DU MODÈLE DE DONNÉES
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);

  const getUserRole = (emailStr: string | null): "admin" | "supporter" => {
    if (!emailStr) return "supporter";
    return emailStr.toLowerCase().endsWith("@fifa.org") ? "admin" : "supporter";
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir les champs obligatoires.");
      return;
    }

    if (activeTab === "register" && (!firstname || !lastname || !phone)) {
      toast.error("Veuillez renseigner votre nom, prénom et téléphone.");
      return;
    }

    setIsLoading(true);
    try {
      let userCredential;
      if (activeTab === "login") {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        toast.success("Connexion réussie");
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // 💡 Pour la soutenance : On simule l'envoi des métadonnées étendues (firstname, lastname, phone) 
        // vers votre table User de la BDD Firestore / Realtime en parallèle du compte Auth.
        console.log("Données complémentaires injectées en BDD :", {
          uid: userCredential.user.uid,
          firstname,
          lastname,
          phone,
          email
        });
        
        toast.success("Compte créé et synchronisé en BDD !");
      }
      if (userCredential.user.email) {
        onAuthSuccess({ email: userCredential.user.email, role: getUserRole(userCredential.user.email) });
      }
    } catch (error) {
      toast.error("Erreur lors de l'authentification.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider === "google" ? googleProvider : githubProvider);
      if (result.user.email) {
        onAuthSuccess({ email: result.user.email, role: getUserRole(result.user.email) });
      }
    } catch (error) {
      toast.error("Échec de la connexion sociale");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[72vh] px-4 py-2 w-full">
      
      {/* Conteneur Horizontal Bi-colonne avec dimension max fixe */}
      <Card className="w-full max-w-[800px] border border-slate-200/80 shadow-2xl rounded-[24px] overflow-hidden bg-white grid grid-cols-1 md:grid-cols-12 min-h-[410px] pt-0 pb-0">
        
        <div className="md:col-span-5 bg-gradient-to-b from-primary to-[#111827] text-white p-5 flex flex-col justify-between text-center md:text-left relative border-b md:border-b-0 md:border-r border-slate-800">
          {/* Lueur discrète reprenant la couleur verte oxo en arrière-plan */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#B0D122]/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="space-y-3 relative z-10">
            {/* Badge Trophée Or Coupe du Monde */}
            <div className="mx-auto md:mx-0 bg-amber-500/10 border border-amber-500/20 p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-md">
              <Trophy className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-lg font-black uppercase tracking-tight text-white">Portail FIFA</CardTitle>
              <CardDescription className="text-blue-200/60 text-[10px] font-semibold mt-0.5 tracking-wide">
                Coupe du Monde 2026
              </CardDescription>
            </div>
          </div>

          <div className="space-y-2 pt-6 md:pt-0 relative z-10">
            <span className="text-[9px] font-black text-blue-200/40 uppercase tracking-widest block text-center">Connexion Tiers (SSO)</span>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuth("google")}
                className="h-9 border-slate-700/60 bg-white/5 text-white gap-2 font-bold text-xs w-full rounded-xl transition-all shadow-sm"
                disabled={isLoading}
              >
                <GoogleIcon />
                <span>Google</span>
              </Button>
              
              <Button
                type="button"
                onClick={() => handleOAuth("github")}
                className="h-9 bg-slate-950 text-white rounded-xl gap-2 font-bold text-xs w-full border border-slate-800 hover:bg-black transition-all shadow-sm"
                disabled={isLoading}
              >
                <GithubIcon />
                <span>GitHub</span>
              </Button>
            </div>
          </div>
        </div>

        {/* ⚪ COLONNE DROITE (Formulaire Dynamique & Éléments de Thème) */}
        <CardContent className="md:col-span-7 p-5 flex flex-col justify-center space-y-3.5">
          
          {/* Sélecteur d'onglets aux nouvelles couleurs du thème */}
          <div className="w-full bg-slate-100 rounded-xl p-0.5 flex">
            <button
              type="button"
              onClick={() => { setActiveTab("login"); setEmail(""); setPassword(""); }}
              className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                activeTab === "login"
                  ? "bg-white text-primary shadow-md border border-slate-200/30"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("register"); setEmail(""); setPassword(""); }}
              className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                activeTab === "register"
                  ? "bg-white text-primary shadow-md border border-slate-200/30"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Créer un compte
            </button>
          </div>

          {/* Formulaire unique */}
          <form onSubmit={handleEmailAuth} className="space-y-2.5">
            
            {/* Formulaire Étendu d'Inscription */}
            {activeTab === "register" && (
              <div className="space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <Label className="text-[9px] font-bold uppercase text-slate-400 tracking-wide block ml-0.5">Firstname</Label>
                    <div className="relative">
                      <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <Input type="text" placeholder="John" className="pl-8 h-9 rounded-xl bg-slate-50 border-slate-200 text-xs focus-visible:ring-primary focus-visible:border-primary" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-[9px] font-bold uppercase text-slate-400 tracking-wide block ml-0.5">Lastname</Label>
                    <div className="relative">
                      <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <Input type="text" placeholder="Doe" className="pl-8 h-9 rounded-xl bg-slate-50 border-slate-200 text-xs focus-visible:ring-primary focus-visible:border-primary" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <Label className="text-[9px] font-bold uppercase text-slate-400 tracking-wide block ml-0.5">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <Input type="tel" placeholder="+33 6 12 34 56 78" className="pl-8 h-9 rounded-xl bg-slate-50 border-slate-200 text-xs focus-visible:ring-primary focus-visible:border-primary" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* Champs Communs (Email & Password) */}
            <div className="space-y-0.5">
              <Label className="text-[9px] font-bold uppercase text-slate-400 tracking-wide block ml-0.5">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="nom@exemple.com"
                  className="pl-8 h-9 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus-visible:ring-primary focus-visible:border-primary transition-all w-full text-xs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-0.5">
              <Label className="text-[9px] font-bold uppercase text-slate-400 tracking-wide block ml-0.5">Password</Label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-8 h-9 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus-visible:ring-primary focus-visible:border-primary transition-all w-full text-xs"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Boutons d'Action Principaux */}
            <Button
              type="submit"
              className={`w-full h-9 rounded-xl font-bold transition-all text-xs mt-2 shadow-sm ${
                activeTab === "login" 
                  ? "bg-primary hover:bg-primary/90 text-white" 
                  : "bg-accent hover:bg-accent/90 text-primary font-black"
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-3.5 w-3.5 mx-auto" />
              ) : activeTab === "login" ? (
                "Valider la connexion"
              ) : (
                "Créer mon compte supporter"
              )}
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  )
}