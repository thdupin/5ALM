import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ShieldCheck, Lock, Mail, User, ArrowRight, Loader2 } from "lucide-react"

interface AuthFormProps {
  onAuthSuccess: (user: { email: string; role: "supporter" | "admin" }) => void
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  // États de navigation interne
  const [isSignUp, setIsSignUp] = useState(false)
  const [step, setStep] = useState<"credentials" | "2fa">("credentials")
  const [loading, setLoading] = useState(false)

  // Formulaire identifiants
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  // Formulaire 2FA
  const [otp, setOtp] = useState("")

  // Soumission Étape 1 : Identifiants
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs requis.")
      return
    }

    setLoading(true)
    // Simulation d'une latence réseau (API AST)
    setTimeout(() => {
      setLoading(false)
      setStep("2fa")
      toast.success("Un code de vérification (2FA) vous a été simulé !")
    }, 1200)
  }

  // Soumission Étape 2 : Code OTP (2FA)
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error("Le code OTP doit contenir exactement 6 chiffres.")
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      
      // Détection automatique du rôle pour la suite du projet (Admin si l'email contient "fifa.org")
      const role = email.includes("fifa.org") ? "admin" : "supporter"
      
      toast.success(`Authentification réussie ! Bienvenue sur la plateforme FIFA 2026.`)
      onAuthSuccess({ email, role })
    }, 1500)
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md border-slate-200 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-amber-500/10 rounded-full text-amber-600">
              <ShieldCheck className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {step === "credentials" ? (isSignUp ? "Créer un compte FIFA" : "Connexion") : "Double Authentification (2FA)"}
          </CardTitle>
          <CardDescription>
            {step === "credentials"
              ? "Accédez de manière sécurisée à la billetterie officielle"
              : "Pour sécuriser vos transactions, entrez le code à 6 chiffres envoyé"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === "credentials" ? (
            /* FORMULAIRE IDENTIFIANTS */
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Adresse Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="supporter@worldcup.com (ou admin@fifa.org)"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <>Continuer <ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>
            </form>
          ) : (
            /* FORMULAIRE 2FA */
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2 text-center">
                <Label htmlFor="otp" className="text-sm font-medium text-slate-600">Code de sécurité à 6 chiffres</Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  className="text-center text-2xl tracking-[0.5em] font-mono h-12"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white" disabled={loading || otp.length !== 6}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Vérifier et se connecter"}
              </Button>
              
              <Button type="button" variant="ghost" className="w-full text-xs text-slate-500" onClick={() => setStep("credentials")}>
                Retour à l'étape précédente
              </Button>
            </form>
          )}
        </CardContent>

        {step === "credentials" && (
          <CardFooter className="flex justify-center border-t border-slate-100 pt-4">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline font-medium"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Déjà un compte ? Connectez-vous" : "Pas encore de compte ? Créez-en un"}
            </button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}