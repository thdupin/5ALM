import React, { useState } from "react"
import AuthForm from "./components/auth-form"
import { Toaster } from "@/components/ui/sonner"
import { LogOut, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function App() {
  const [user, setUser] = useState<{ email: string; role: "supporter" | "admin" } | null>(null)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header global */}
      <header className="bg-slate-950 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-black tracking-wider text-amber-500">FIFA WORLD CUP 2026</h1>
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm bg-slate-800 px-3 py-1.5 rounded-full">
              <UserIcon className="h-4 w-4 text-amber-400" />
              <span>{user.email} <strong className="text-xs text-slate-400">({user.role})</strong></span>
            </div>
            <Button variant="destructive" size="sm" onClick={() => setUser(null)}>
              <LogOut className="h-4 w-4 mr-2" /> Déconnexion
            </Button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8">
        {!user ? (
          <AuthForm onAuthSuccess={(authenticatedUser) => setUser(authenticatedUser)} />
        ) : (
          <div className="p-8 bg-white rounded-xl shadow-sm max-w-2xl mx-auto text-center border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">🎉 US-01 Validée avec succès !</h2>
            <p className="text-slate-600 mb-4">
              Vous êtes maintenant connecté de manière hautement sécurisée grâce à l'infrastructure d'AST.
            </p>
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 inline-block text-sm font-medium">
              Prêt à passer à la <strong>US-02 : Consultation du catalogue des matchs</strong> !
            </div>
          </div>
        )}
      </main>

      {/* Gestionnaire de Toasts de Shadcn */}
      <Toaster position="top-right" richColors />
    </div>
  )
}