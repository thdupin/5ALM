import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { History, Eye } from "lucide-react"

interface OrderHistoryProps {
  orders: any[];
  onViewTicket: (order: any) => void;
}

export default function OrderHistory({ orders, onViewTicket }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <Card className="border-dashed border-slate-300 max-w-md mx-auto text-center p-8 rounded-3xl bg-white shadow-md relative overflow-hidden">
        <CardContent className="space-y-4 pt-6">
          <div className="p-4 bg-blue-50 text-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto border border-blue-100/50 shadow-sm">
            <History className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl font-black text-slate-900">Aucun billet acheté</CardTitle>
          <CardDescription className="text-slate-500 text-sm">
            Vous n'avez pas encore effectué de réservation pour la Coupe du Monde 2026.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200/80 shadow-2xl max-w-4xl mx-auto rounded-3xl overflow-hidden bg-white animate-in fade-in duration-500 pt-0">
      
      {/* En-tête de l'historique - Style Bannière FIFA Bleu Royal */}
      <CardHeader className="bg-gradient-to-b from-primary to-[#111827] text-white p-6 relative border-b border-blue-950">
        <div className="absolute top-0 right-0 w-32 h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />
        
        <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2 text-white">
          <History className="h-5 w-5 text-amber-400" /> HISTORIQUE DE VOS COMMANDES
        </CardTitle>
        <CardDescription className="text-blue-200/60 text-xs mt-1.5">
          Consultez vos transactions sécurisées et affichez vos pass d'accès pour les tribunes.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/70 hover:bg-slate-50/70 border-b border-slate-100">
              <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-wider pl-6">N° Commande</TableHead>
              <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Match</TableHead>
              <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Siège / Catégorie</TableHead>
              <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-wider text-center">Date</TableHead>
              <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-wider text-center">Montant</TableHead>
              <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-wider text-center">Statut</TableHead>
              <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-wider text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-blue-500/[0.02] border-b border-slate-100/80 transition-colors">
                <TableCell className="font-mono font-bold text-slate-600 text-xs pl-6">
                  {order.id}
                </TableCell>
                <TableCell className="py-4">
                  <div className="font-black text-slate-900 text-sm tracking-tight">
                    {order.match.teamA} <span className="text-slate-400 font-normal text-xs">vs</span> {order.match.teamB}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[200px] font-medium mt-0.5">
                    {order.match.stadium.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-bold text-primary bg-blue-50/60 border border-blue-100/40 px-2 py-0.5 rounded-md inline-block">
                    {order.seat.section}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    {order.seat.row} — N°{order.seat.number}
                  </div>
                </TableCell>
                <TableCell className="text-center text-xs text-slate-500 font-medium">
                  {order.date}
                </TableCell>
                <TableCell className="text-center font-mono font-black text-sm text-slate-900">
                  {order.amount} €
                </TableCell>
                <TableCell className="text-center">
                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[9px] font-black tracking-wide shadow-none rounded-lg py-0.5 px-2">
                    CONFIRMÉ
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-1.5">
                    <Button 
                      size="sm" 
                      className="h-8 text-xs font-bold px-3 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-sm transition-all active:scale-95"
                      onClick={() => onViewTicket(order)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> Voir le Billet
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}