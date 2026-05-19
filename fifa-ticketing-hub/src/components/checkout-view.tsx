import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, ShieldCheck, Loader2, DollarSign } from "lucide-react"
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
  
  // États formulaire de carte (Stripe mock)
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
    toast.loading("Communication avec la passerelle bancaire sécurisée...", { id: "payment-loading" });

    // Simulation de l'exécution de la méthode +process() du diagramme UML
    setTimeout(() => {
      setIsProcessing(false);
      toast.dismiss("payment-loading");
      
      // Génération de l'identifiant de transaction unique requis par l'UML
      const mockTransactionId = "TXN-" + Math.random().toString(36).substring(2, 11).toUpperCase();
      
      toast.success("Paiement approuvé par la banque !");
      onPaymentSuccess({
        transactionId: mockTransactionId,
        method: paymentMethod,
        amount: totalPrice
      });
    }, 2500); // 2.5 secondes de latence pour faire réaliste
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card className="border-slate-200 shadow-xl">
        <CardHeader className="bg-slate-900 text-white rounded-t-xl">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" /> Passerelle de Paiement Sécurisée
          </CardTitle>
          <CardDescription className="text-slate-400">
            Montant total à débiter : <strong className="text-white font-mono">{totalPrice} €</strong>
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 pt-6 space-y-6">
          {/* Choix de l'opérateur (Enum method dans le diagramme) */}
          <div className="space-y-2">
            <Label>Méthode de paiement</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={paymentMethod === "Stripe" ? "default" : "outline"}
                className={`w-full font-bold ${paymentMethod === "Stripe" ? "bg-indigo-600 hover:bg-indigo-500 text-white" : ""}`}
                onClick={() => setPaymentMethod("Stripe")}
                disabled={isProcessing}
              >
                Stripe (Carte)
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "PayPal" ? "default" : "outline"}
                className={`w-full font-bold ${paymentMethod === "PayPal" ? "bg-amber-500 hover:bg-amber-400 text-slate-900" : ""}`}
                onClick={() => setPaymentMethod("PayPal")}
                disabled={isProcessing}
              >
                PayPal
              </Button>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Formulaire dynamique selon la méthode */}
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            {paymentMethod === "Stripe" ? (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="card-num">Numéro de Carte Bleue</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="card-num"
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      className="pl-10 font-mono"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim())}
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="card-exp">Date d'expiration</Label>
                    <Input
                      id="card-exp"
                      type="text"
                      placeholder="MM/AA"
                      className="text-center font-mono"
                      maxLength={5}
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value.replace(/\D/g, "").replace(/(.{2})/, "$1/").trim())}
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="card-cvc">Code CVC</Label>
                    <Input
                      id="card-cvc"
                      type="password"
                      placeholder="123"
                      className="text-center font-mono"
                      maxLength={3}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-4 text-center space-y-2">
                <p className="text-sm text-amber-800 font-medium">
                  Vous allez être redirigé vers l'environnement sécurisé de PayPal pour valider votre transaction en un clic.
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 mt-4 shadow-md shadow-emerald-600/10" 
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Traitement de la transaction...
                </>
              ) : (
                `Confirmer le règlement de ${totalPrice} €`
              )}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="w-full text-xs text-slate-400"
              onClick={onCancel}
              disabled={isProcessing}
            >
              Annuler et revenir au panier
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}