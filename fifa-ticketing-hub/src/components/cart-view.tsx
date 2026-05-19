import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Match, Seat } from "../mocks/matchs" // Correction: Import de Seat requis
import { Timer, ShoppingBag, Trash2, ShieldAlert } from "lucide-react"

interface CartItem {
  match: Match;
  seat: Seat;
  quantity: number;
}

interface CartViewProps {
  cartItem: CartItem | null;
  onRemoveItem: () => void;
  onCheckout: () => void;
  timeLeft: number; // Reçu du parent pour maintenir l'état global
}

export default function CartView({ cartItem, onRemoveItem, onCheckout, timeLeft }: CartViewProps) {
  // Formatage des secondes en MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calcul du pourcentage pour la barre de progression (sur une base de 10 minutes / 600 secondes)
  const progressPercentage = (timeLeft / 600) * 100;

  if (!cartItem) {
    return (
      <Card className="border-dashed border-slate-300 max-w-md mx-auto text-center p-8">
        <CardContent className="space-y-3 pt-4">
          <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto" />
          <CardTitle className="text-lg text-slate-600">Votre panier est vide</CardTitle>
          <CardDescription>
            Retournez sur le catalogue pour sélectionner un match et réserver vos places.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  const totalPrice = cartItem.seat.price * cartItem.quantity;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Alerte de Verrouillage Temporaire (Anti-Double Booking) */}
      <Card className={`border ${timeLeft < 60 ? "bg-red-50 border-red-200 text-red-900" : "bg-amber-50 border-amber-200 text-amber-900"}`}>
        <CardContent className="p-4 flex items-center gap-3">
          <Timer className={`h-5 w-5 ${timeLeft < 60 ? "animate-pulse text-red-600" : "text-amber-600"}`} />
          <div className="flex-1 text-sm font-medium">
            Places réservées exclusivement pour vous pendant :{" "}
            <span className="font-mono text-base font-bold">{formatTime(timeLeft)}</span>
          </div>
        </CardContent>
        {/* Barre de progression visuelle du TTL */}
        <div className="w-full bg-slate-200 h-1.5 rounded-b-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${timeLeft < 60 ? "bg-red-600" : "bg-amber-500"}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </Card>

      {/* Détail du Panier */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-slate-500" /> Récapitulatif de votre réservation
          </CardTitle>
          <CardDescription>Vérifiez vos places avant de procéder au paiement sécurisé.</CardDescription>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              {/* Correction: Alignement sur les attributs UML teamA et teamB */}
              <h4 className="font-bold text-slate-900 text-base">
                {cartItem.match.teamA} vs {cartItem.match.teamB}
              </h4>
              {/* Correction: Alignement sur la relation avec l'entité Stadium (stadium.name / city) */}
              <p className="text-xs text-slate-500 mt-0.5">
                {cartItem.match.stadium.name} — {cartItem.match.stadium.city}
              </p>
              <p className="text-sm font-medium text-blue-600 mt-2 bg-blue-50 px-2.5 py-0.5 rounded-full inline-block">
                {cartItem.seat.section} ({cartItem.seat.categoryName})
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono font-bold text-slate-900">{cartItem.seat.price} €</p>
              <p className="text-xs text-slate-400">Qté: {cartItem.quantity}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <ShieldAlert className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Conformément aux règles FIFA, les billets de cette catégorie sont nominatifs et limités.</span>
          </div>

          <hr className="border-slate-100" />

          <div className="flex justify-between items-center text-base pt-1">
            <span className="font-semibold text-slate-600">Total à régler :</span>
            <span className="font-mono font-black text-xl text-slate-900">{totalPrice} €</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-xl flex gap-3">
          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={onRemoveItem}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold" onClick={onCheckout}>
            Passer au paiement sécurisé
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}