import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Match, Seat } from "../mocks/matchs"
import { Timer, ShoppingBag, Trash2, ShieldAlert, Lock } from "lucide-react"

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

  if (!cartItem) {
    return (
      <Card className="border-dashed border-slate-300 max-w-md mx-auto text-center p-8 rounded-3xl bg-white shadow-md relative overflow-hidden">
        <CardContent className="space-y-4 pt-6">
          <div className="p-4 bg-blue-50 text-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto border border-blue-100/50 shadow-sm">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl font-black text-slate-900">Votre panier est vide</CardTitle>
          <CardDescription className="text-slate-500 text-sm">
            Retournez sur le catalogue pour sélectionner une rencontre et réserver votre siège certifié FIFA.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  const totalPrice = cartItem.seat.price * cartItem.quantity;

  return (
    <div className="max-w-xl mx-auto px-2 animate-in fade-in duration-500">
      
      {/* Conteneur unique à bords arrondis parfaits */}
      <Card className="border-slate-200/80 shadow-2xl rounded-3xl overflow-hidden bg-white relative pt-0">
        
        {/* Barre de progression temporelle synchronisée */}
        <div className="absolute top-0 left-0 w-full bg-slate-800/20 h-1 z-20">
          <div
            className={`h-full transition-all duration-1000 ${timeLeft < 60 ? "bg-red-500 animate-pulse" : "bg-amber-500"}`}
            style={{ width: `${(timeLeft / 600) * 100}%` }}
          />
        </div>

        {/* En-tête Premium Bleu Royal FIFA */}
        <CardHeader className="bg-gradient-to-b from-primary to-[#111827] text-white p-6 relative border-b border-blue-950 pt-7">
          <div className="absolute top-0 right-0 w-24 h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-black tracking-tight flex items-center gap-2 text-white">
              <ShoppingBag className="h-4 w-4 text-amber-400" /> RÉCAPITULATIF DE RÉSERVATION
            </CardTitle>
            
            {/* Le Décompte de verrouillage du siège */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <Badge variant="outline" className="bg-white/5 text-blue-200 border-white/10 text-[10px] font-bold h-6">
                1 SIÈGE
              </Badge>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-black border tracking-wider transition-colors shadow-sm ${
                timeLeft < 60 
                  ? "bg-red-500/10 text-red-400 border-red-500/30 animate-pulse" 
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}>
                <Timer className="h-3.5 w-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          
          <CardDescription className="text-blue-200/60 text-xs mt-1.5">
            Vérifiez vos coordonnées de placement avant de passer à l'étape d'encaissement sécurisé.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="space-y-1.5">
              <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-mono">
                MATCH OFFICIEL
              </span>
              <h4 className="font-black text-slate-900 text-base tracking-tight pt-1">
                {cartItem.match.teamA} <span className="text-slate-400 font-light text-sm">vs</span> {cartItem.match.teamB}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {cartItem.match.stadium.name} — <strong className="text-slate-700">{cartItem.match.stadium.city}</strong>
              </p>
              
              <div className="pt-3 flex flex-wrap items-center gap-2 border-t border-slate-200/60 mt-2">
                <span className="text-xs font-bold text-primary bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-lg">
                  {cartItem.seat.section}
                </span>
                <span className="text-xs font-medium text-slate-600 font-mono bg-white border border-slate-200 px-2.5 py-0.5 rounded-lg shadow-sm">
                  {cartItem.seat.row}
                </span>
                <span className="text-xs font-medium text-slate-600 font-mono bg-white border border-slate-200 px-2.5 py-0.5 rounded-lg shadow-sm">
                  Siège N°{cartItem.seat.number}
                </span>
              </div>
            </div>

            <div className="sm:text-right self-end sm:self-start shrink-0">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Tarif Catégorie</span>
              <Badge variant="outline" className="text-[10px] font-bold text-primary border-blue-100 bg-blue-50/50 shadow-sm mt-0.5 mb-1">
                {cartItem.seat.categoryName}
              </Badge>
              <p className="font-mono font-black text-xl text-slate-900">{cartItem.seat.price} €</p>
              <p className="text-[11px] text-slate-400">Quantité : {cartItem.quantity}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-slate-500 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Sécurisation AST : Ce titre d'accès est nominatif et rattaché à votre compte. Toute tentative de duplication ou revente en dehors de la plateforme officielle FIFA entraînera l'annulation immédiate du QR Code.
            </span>
          </div>

          <hr className="border-slate-100" />

          <div className="flex justify-between items-center text-base pt-1">
            <span className="font-bold text-slate-600">Net à payer :</span>
            <span className="font-mono font-black text-2xl text-primary">
              {totalPrice} €
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex gap-3">
          <Button 
            variant="outline" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-slate-200 h-11 rounded-xl px-3 transition-colors" 
            onClick={onRemoveItem}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button 
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-wider h-11 rounded-xl shadow-md flex items-center justify-center gap-2" 
            onClick={onCheckout}
          >
            <Lock className="h-3.5 w-3.5 text-amber-400" /> Procéder au paiement sécurisé
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}