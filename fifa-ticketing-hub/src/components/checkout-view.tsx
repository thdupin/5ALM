import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CreditCard, ShieldCheck, Loader2, Lock, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Match, Seat } from "../mocks/matchs"

interface CheckoutViewProps {
  cartItem: { match: Match; seat: Seat; quantity: number };
  onPaymentSuccess: (paymentDetails: {
    transactionId: string;
    method: "Stripe" | "PayPal";
    amount: number;
  }) => void;
  onCancel: () => void;
}

export default function CheckoutView({ cartItem, onPaymentSuccess, onCancel }: CheckoutViewProps) {
  const [paymentMethod, setPaymentMethod] = useState<"Stripe" | "PayPal">("Stripe");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // États formulaire Stripe
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const totalPrice = cartItem.seat.price * cartItem.quantity;

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === "Stripe" && (!cardNumber || !expiry || !cvc)) {
      toast.error("Veuillez remplir toutes les informations bancaires.");
      return;
    }

    setIsProcessing(true);
    toast.loading("Communication avec la passerelle chiffrée FIFA...", { id: "payment-loading" });

    // Simulation de la méthode +process() de l'entité Payment
    setTimeout(() => {
      setIsProcessing(false);
      toast.dismiss("payment-loading");
      
      const mockTransactionId = "TXN-" + Math.random().toString(36).substring(2, 11).toUpperCase();
      
      toast.success("Transaction validée avec succès !");
      onPaymentSuccess({
        transactionId: mockTransactionId,
        method: paymentMethod,
        amount: totalPrice
      });
    }, 2500);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 px-2 animate-in fade-in duration-500">
      
      {/* Bouton de retour discret et élégant */}
      <button 
        onClick={onCancel} 
        disabled={isProcessing}
        className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary transition-colors disabled:opacity-50"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Retour au récapitulatif du panier
      </button>

      <Card className="border-slate-200 shadow-2xl rounded-3xl overflow-hidden bg-white pt-0">
        
        {/* Header Style Bannière Sécurisée FIFA (Bleu Royal + Or) */}
        <CardHeader className="bg-gradient-to-b from-primary to-[#111827] text-white p-6 relative border-b border-blue-950">
          <div className="absolute top-0 right-0 w-24 h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-black tracking-tight flex items-center gap-2 text-white">
              <ShieldCheck className="h-5 w-5 text-amber-400" /> SECURE CHECKOUT
            </CardTitle>
            <Badge className="bg-slate-950/60 text-amber-400 border border-amber-500/20 font-mono text-[10px] px-2.5 py-0.5 rounded-md">
              PCI-DSS v4.0
            </Badge>
          </div>
          <CardDescription className="text-blue-200/60 text-xs mt-1.5">
            Transaction chiffrée de bout en bout pour le siège <strong className="text-white font-mono">{cartItem.seat.section}</strong>.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-5">
          
          {/* Section d'affichage du prix aux couleurs du thème */}
          <div className="bg-blue-50/40 border border-blue-100/30 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total de la commande</span>
              <span className="text-xs font-bold text-slate-700">{cartItem.match.teamA} vs {cartItem.match.teamB}</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black font-mono text-primary">{totalPrice} €</span>
            </div>
          </div>

          {/* Choix de la Méthode de Paiement */}
          <div className="space-y-2.5">
            <Label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block ml-0.5">Sélectionner une méthode</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setPaymentMethod("Stripe")}
                className={`p-3 rounded-xl border text-center font-bold text-sm transition-all flex flex-col items-center justify-center gap-1.5 active:scale-[0.98] ${
                  paymentMethod === "Stripe"
                    ? "border-primary bg-primary text-white shadow-md shadow-blue-900/20"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                <CreditCard className={`h-4 w-4 ${paymentMethod === "Stripe" ? "text-amber-400" : "text-slate-400"}`} />
                <span className="text-xs font-bold">Carte Bancaire</span>
              </button>
              
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setPaymentMethod("PayPal")}
                className={`p-3 rounded-xl border text-center font-bold text-sm transition-all flex flex-col items-center justify-center gap-1.5 active:scale-[0.98] ${
                  paymentMethod === "PayPal"
                    ? "border-amber-500 bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                <span className="font-black italic tracking-tight text-xs text-inherit">Pay<span className={paymentMethod === "PayPal" ? "text-slate-800" : "text-blue-600"}>Pal</span></span>
                <span className="text-xs font-bold">Compte Externe</span>
              </button>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Formulaire de saisie dynamique */}
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            {paymentMethod === "Stripe" ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1.5">
                  <Label htmlFor="card-num" className="text-xs font-bold text-slate-600">Numéro de Carte Bleue</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="card-num"
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      className="pl-10 font-mono text-sm bg-slate-50/50 focus-visible:ring-primary focus-visible:border-primary border-slate-200 rounded-xl"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim())}
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="card-exp" className="text-xs font-bold text-slate-600">Expiration</Label>
                    <Input
                      id="card-exp"
                      type="text"
                      placeholder="MM/AA"
                      className="text-center font-mono text-sm bg-slate-50/50 focus-visible:ring-primary focus-visible:border-primary border-slate-200 rounded-xl"
                      maxLength={5}
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value.replace(/\D/g, "").replace(/(.{2})/, "$1/").trim())}
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="card-cvc" className="text-xs font-bold text-slate-600">Code CVC</Label>
                    <Input
                      id="card-cvc"
                      type="password"
                      placeholder="123"
                      className="text-center font-mono text-sm bg-slate-50/50 focus-visible:ring-primary focus-visible:border-primary border-slate-200 rounded-xl"
                      maxLength={3}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/40 border border-amber-200/60 rounded-2xl p-4 text-center space-y-2 animate-in fade-in duration-200">
                <p className="text-xs text-amber-900 font-medium leading-relaxed">
                  Une fenêtre contextuelle sécurisée PayPal s'ouvrira pour vous identifier et valider l'achat de vos billets Coupe du Monde.
                </p>
              </div>
            )}

            {/* Bouton de confirmation adapté dynamiquement */}
            <Button 
              type="submit" 
              className={`w-full font-bold text-xs uppercase tracking-wider h-11 mt-4 rounded-xl shadow-md transition-all ${
                paymentMethod === "PayPal"
                  ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/10"
                  : "bg-primary hover:bg-primary/90 text-white shadow-blue-900/10"
              }`}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Traitement cryptographique...
                </>
              ) : (
                <span className="flex items-center gap-1.5 justify-center">
                  <Lock className="h-3.5 w-3.5" /> Payer {totalPrice} €
                </span>
              )}
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
}