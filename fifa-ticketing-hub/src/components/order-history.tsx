import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { History, Eye, FileText, Calendar } from "lucide-react"

interface OrderHistoryProps {
  orders: any[];
  onViewTicket: (order: any) => void;
}

export default function OrderHistory({ orders, onViewTicket }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <Card className="border-dashed border-slate-300 max-w-md mx-auto text-center p-8">
        <CardContent className="space-y-3 pt-4">
          <History className="h-12 w-12 text-slate-300 mx-auto" />
          <CardTitle className="text-lg text-slate-600">Aucun billet acheté</CardTitle>
          <CardDescription>
            Vous n'avez pas encore effectué de réservation pour la Coupe du Monde 2026.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-xl max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <History className="h-5 w-5 text-slate-500" /> Historique de vos Commandes (UML +getHistory)
        </CardTitle>
        <CardDescription>
          Consultez vos transactions sécurisées, téléchargez vos factures ou affichez vos pass d'accès.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-bold">N° Commande</TableHead>
              <TableHead className="font-bold">Match</TableHead>
              <TableHead className="font-bold">Siège / Catégorie</TableHead>
              <TableHead className="font-bold text-center">Date</TableHead>
              <TableHead className="font-bold text-center">Montant</TableHead>
              <TableHead className="font-bold text-center">Statut</TableHead>
              <TableHead className="font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-slate-50/80 transition-colors">
                <TableCell className="font-mono font-bold text-slate-700 text-xs">
                  {order.id}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-slate-900 text-sm">
                    {order.match.teamA} vs {order.match.teamB}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                    {order.match.stadium.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-medium text-slate-800">
                    {order.seat.section}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {order.seat.row} — N°{order.seat.number}
                  </div>
                </TableCell>
                <TableCell className="text-center text-xs text-slate-600">
                  {order.date}
                </TableCell>
                <TableCell className="text-center font-mono font-bold text-sm text-slate-900">
                  {order.amount} €
                </TableCell>
                <TableCell className="text-center">
                  <Badge className="bg-emerald-100 text-emerald-800 border-none text-[10px] font-bold shadow-none hover:bg-emerald-100">
                    CONFIRMÉ
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 text-xs font-medium px-2.5"
                      onClick={() => onViewTicket(order)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> Billet
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