import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, Download, Calendar, MapPin, Armchair, ShieldCheck, RefreshCw } from "lucide-react"
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
        <Button className="mt-4" onClick={onGoBack}>Retour au catalogue</Button>
      </div>
    );
  }

  const handleDownload = () => {
    toast.success("📥 Téléchargement du billet PDF initié (Méthode +download() exécutée).");
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900 flex items-center justify-center gap-2">
          <ShieldCheck className="h-6 w-6 text-emerald-600" /> Votre Billet est Prêt !
        </h2>
        <p className="text-sm text-slate-500 mt-1">Généré avec succès par l'infrastructure AST</p>
      </div>

      {/* Le Billet Physique Style FIFA */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Bandeau Supérieur Design */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-600 p-4 text-white flex justify-between items-center">
          <span className="text-xs font-black tracking-widest text-amber-400 font-mono">OFFICIAL PASS</span>
          <Badge className="bg-amber-500 text-slate-950 font-bold text-[10px]">
            {order.match.round}
          </Badge>
        </div>

        {/* Détails du Match */}
        <div className="p-6 space-y-4">
          <div className="text-center">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {order.match.teamA} <span className="text-amber-500 text-sm font-normal">VS</span> {order.match.teamB}
            </h3>
            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{order.match.group}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
            <div className="space-y-1">
              <span className="text-slate-400 font-medium block">DATE / HEURE</span>
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <Calendar className="h-3 w-3 text-amber-500" /> {order.match.date.split(" - ")[0]}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-medium block">STADE</span>
              <span className="font-bold text-slate-900 flex items-center gap-1 truncate">
                <MapPin className="h-3 w-3 text-red-500" /> {order.match.stadium.name}
              </span>
            </div>
          </div>

          {/* Placement (Entité Seat du diagramme UML) */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 bg-amber-50/40 grid grid-cols-3 text-center divide-x divide-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Zone</span>
              <span className="text-sm font-black text-slate-800">{order.seat.section.split(" ")[1] || "Honneur"}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Rangée</span>
              <span className="text-sm font-black text-slate-800">{order.seat.row.replace("Rang ", "")}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Siège</span>
              <span className="text-sm font-black text-slate-800">N° {order.seat.number}</span>
            </div>
          </div>

          {/* Zone du QR Code (Sécurisé et dynamique) */}
          <div className="flex flex-col items-center justify-center pt-4 pb-2 space-y-2">
            <div className="p-4 bg-white border-4 border-slate-950 rounded-2xl shadow-inner relative group">
              {/* Simulation visuelle d'un QR code via un bloc stylisé */}
              <div className="w-40 h-40 bg-slate-100 flex flex-col items-center justify-center rounded-lg border border-slate-200 p-2">
                <QrCode className="w-32 h-32 text-slate-950" />
              </div>
            </div>
            
            {/* Timer anti-revente / capture d'écran */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              <RefreshCw className="h-3 w-3 animate-spin text-amber-600" />
              <span>Le QR Code s'actualise dans : <strong className="text-slate-900">{countdown}s</strong></span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono select-all truncate max-w-xs">
              {securityToken}
            </span>
          </div>
        </div>

        {/* Pied de page du ticket */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 text-center text-[10px] text-slate-400 font-mono">
          N° COMMANDE : {order.id} | TXN : {order.transactionId}
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onGoBack}>
          Retour aux matchs
        </Button>
        <Button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" /> Télécharger (PDF)
        </Button>
      </div>
    </div>
  );
}