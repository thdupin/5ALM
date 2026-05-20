import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, Download, Calendar, MapPin, ShieldCheck, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface TicketViewProps {
  order: {
    id: string;
    match: any;
    seat: any;
    transactionId: string;
    date: string;
  } | null;
  onGoBack: () => void;
}

export default function TicketView({ order, onGoBack }: TicketViewProps) {
  const [securityToken, setSecurityToken] = useState("");
  const [countdown, setCountdown] = useState(30);

  // Simulation du QR Code dynamique (Anti-fraude)
  useEffect(() => {
    if (!order) return;
    
    const generateToken = () => {
      const randomHash = Math.random().toString(36).substring(2, 10).toUpperCase();
      setSecurityToken(`FIFA-${order.id}-${order.seat.id}-${randomHash}`);
    };

    generateToken();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          generateToken();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [order]);

  if (!order) {
    return (
      <div className="text-center p-8">
        <p className="text-slate-500">Aucun billet trouvé. Veuillez finaliser un achat.</p>
        <Button className="mt-4 bg-primary hover:bg-primary/90 text-white" onClick={onGoBack}>Retour au catalogue</Button>
      </div>
    );
  }

  const handleDownload = () => {
    toast.success("📥 Téléchargement du billet PDF initié (Méthode +download() exécutée).");
  };

  return (
    <div className="max-w-md mx-auto space-y-5 px-2 animate-in fade-in duration-500">
      
      {/* Statut de confirmation sécurisé standard */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
          <ShieldCheck className="h-4 w-4" /> 
          <span>Votre Billet est Prêt !</span>
        </div>
        <p className="text-[11px] text-slate-400 font-medium mt-1.5">Généré avec succès par l'infrastructure AST</p>
      </div>

      {/* Le Billet Physique Style FIFA */}
      <div className="bg-white rounded-[24px] shadow-2xl border border-slate-200/80 overflow-hidden relative">

        {/* Bandeau Supérieur Design - Bleu Royal Thème FIFA */}
        <div className="bg-gradient-to-r from-primary to-[#111827] p-4 text-white flex justify-between items-center border-b border-blue-950">
          <span className="text-xs font-black tracking-widest text-amber-400 font-mono">OFFICIAL PASS</span>
          <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-[10px] rounded uppercase">
            {order.match.round}
          </Badge>
        </div>

        {/* Détails du Match */}
        <div className="p-5 space-y-4 relative z-10">
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              {order.match.teamA} <span className="text-amber-500 text-sm font-normal">VS</span> {order.match.teamB}
            </h3>
            <p className="text-[10px] font-black text-slate-400 mt-0.5 uppercase tracking-wider">{order.match.group}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
            <div className="space-y-0.5">
              <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wide block">DATE / HEURE</span>
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-amber-500" /> {order.match.date.split(" - ")[0]}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wide block">STADE</span>
              <span className="font-bold text-slate-900 flex items-center gap-1 truncate">
                <MapPin className="h-3.5 w-3.5 text-primary" /> {order.match.stadium.name}
              </span>
            </div>
          </div>

          {/* Placement (Entité Seat du diagramme UML) */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-3.5 bg-blue-50/30 grid grid-cols-3 text-center divide-x divide-slate-200">
            <div>
              <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wide">Tribune</span>
              <span className="text-sm font-black text-primary">{order.seat.section.split(" ")[1] || "Nord"}</span>
            </div>
            <div>
              <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wide">Rangée</span>
              <span className="text-sm font-black text-slate-800">{order.seat.row.replace("Rang ", "")}</span>
            </div>
            <div>
              <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wide">Siège</span>
              <span className="text-sm font-black text-slate-800">N° {order.seat.number}</span>
            </div>
          </div>

          {/* Zone du QR Code Neutre */}
          <div className="flex flex-col items-center justify-center pt-2 pb-1 space-y-2.5">
            <div className="p-4 bg-white border-[3px] border-primary rounded-2xl shadow-md relative">
              <div className="w-36 h-36 bg-slate-50 flex flex-col items-center justify-center rounded-lg p-1">
                <QrCode className="w-32 h-32 text-slate-950" />
              </div>
            </div>
            
            {/* Timer anti-capture d'écran */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              <RefreshCw className="h-3 w-3 animate-spin text-primary" />
              <span>Actualisation de sécurité : <strong className="text-primary font-black">{countdown}s</strong></span>
            </div>
            <span className="text-[8px] text-slate-400 font-mono select-all truncate max-w-xs block text-center">
              {securityToken}
            </span>
          </div>
        </div>

        {/* Pied de page du ticket */}
        <div className="bg-slate-50 border-t border-slate-100 p-3.5 text-center text-[9px] text-slate-400 font-mono font-bold tracking-tight">
          ID COMMANDE : {order.id} | TRANSACTION : {order.transactionId}
        </div>
      </div>

      {/* Boutons d'action horizontaux */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 h-10 border-slate-200 rounded-xl font-bold text-xs" onClick={onGoBack}>
          Retour aux matchs
        </Button>
        <Button className="flex-1 h-10 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2" onClick={handleDownload}>
          <Download className="h-4 w-4" /> Télécharger PDF
        </Button>
      </div>
    </div>
  );
}