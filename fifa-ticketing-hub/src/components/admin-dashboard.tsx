import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MOCK_MATCHS, Match, Stadium, Seat } from "../mocks/matchs"
import { LayoutDashboard, PlusCircle, DollarSign, Armchair, Calendar, ShieldCheck, FilePlus2 } from "lucide-react"
import { toast } from "sonner"

interface AdminDashboardProps {
  orders: any[];
  onMatchAdded: (newMatch: Match) => void;
}

export default function AdminDashboard({ orders, onMatchAdded }: AdminDashboardProps) {
  // États du formulaire de création de match (+manageMatch)
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [date, setDate] = useState("20 Juin 2026 - 21:00");
  const [group, setGroup] = useState("Groupe E");

  // Analyse des ventes en temps réel (+viewStats)
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalTicketsSold = orders.length;

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamA || !teamB) {
      toast.error("Veuillez renseigner les deux équipes.");
      return;
    }

    // Simulation d'une jointure d'entité Stadium par défaut (UML relation 1)
    const defaultStadium: Stadium = {
      id: "stadium_1",
      name: "MetLife Stadium",
      city: "New York",
      country: "États-Unis",
      capacity: 82500
    };

    // Génération automatique des sièges associés (UML relation 1..*)
    const generatedSeats: Seat[] = [
      { id: `s-new-1`, stadiumId: "stadium_1", section: "Tribune Présidentielle", row: "Rang A", number: 1, price: 350, categoryName: "VIP", isAvailable: true },
      { id: `s-new-2`, stadiumId: "stadium_1", section: "Virage Sud", row: "Rang 05", number: 12, price: 90, categoryName: "Catégorie 3", isAvailable: true }
    ];

    const newMatch: Match = {
      id: "match_" + Math.random().toString(36).substring(2, 7),
      teamA,
      teamB,
      round: "Quarter-Final", // Enum UML
      group,
      date,
      stadiumId: "stadium_1",
      totalSeats: 2,
      availableSeats: 2,
      stadium: defaultStadium,
      seatsMock: generatedSeats
    };

    onMatchAdded(newMatch);
    toast.success(`⚽ Match ${teamA} vs ${teamB} ajouté au catalogue FIFA avec succès !`);
    
    // Reset du formulaire
    setTeamA("");
    setTeamB("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <LayoutDashboard className="h-6 w-6 text-slate-800" />
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Console de Gouvernance FIFA</h2>
        <Badge className="bg-red-600 text-white font-bold text-[10px] uppercase ml-auto">ADMIN ACCESS</Badge>
      </div>

      {/* Rendu des statistiques globales (+viewStats du diagramme de classes) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Chiffre d'Affaires</p>
              <p className="text-2xl font-black font-mono mt-1">{totalRevenue} €</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl text-amber-400">
              <DollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Billets Émis</p>
              <p className="text-2xl font-black font-mono mt-1">{totalTicketsSold} pass</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Taux de Remplissage</p>
              <p className="text-2xl font-black font-mono mt-1">
                {totalTicketsSold > 0 ? "100 %" : "0 %"}
              </p>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
              <Armchair className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire de création (+manageMatch) */}
        <Card className="border-slate-200 shadow-md lg:col-span-1 h-fit">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-base font-bold flex items-center gap-1.5">
              <PlusCircle className="h-4 w-4 text-slate-500" /> Planifier une Rencontre
            </CardTitle>
            <CardDescription className="text-xs">Ajouter une ligne au catalogue</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-5">
            <form onSubmit={handleCreateMatch} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="teamA">Équipe A (Home)</Label>
                <Input id="teamA" placeholder="Ex: Brésil" value={teamA} onChange={(e) => setTeamA(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="teamB">Équipe B (Away)</Label>
                <Input id="teamB" placeholder="Ex: Portugal" value={teamB} onChange={(e) => setTeamB(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date">Date et Heure</Label>
                <Input id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="group">Groupe / Phase</Label>
                <Input id="group" value={group} onChange={(e) => setGroup(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-9">
                <FilePlus2 className="h-4 w-4 mr-1.5" /> Injecter le Match
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tableau de suivi de l'inventaire en temps réel */}
        <Card className="border-slate-200 shadow-md lg:col-span-2">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-base font-bold flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-500" /> Supervision de l'Inventaire des Sièges
            </CardTitle>
            <CardDescription className="text-xs">État réel des stocks de la base de données</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="font-bold text-xs pl-4">Affiche</TableHead>
                  <TableHead className="font-bold text-xs text-center">Phase</TableHead>
                  <TableHead className="font-bold text-xs text-center">Stade</TableHead>
                  <TableHead className="font-bold text-xs text-right pr-4">Sièges Dispo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_MATCHS.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell className="font-semibold text-slate-900 text-xs pl-4">
                      {match.teamA} vs {match.teamB}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-[10px] text-slate-600 border-slate-200">{match.round}</Badge>
                    </TableCell>
                    <TableCell className="text-center text-xs text-slate-500 font-medium">
                      {match.stadium.name}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-xs pr-4">
                      <span className={match.availableSeats === 0 ? "text-red-600" : "text-emerald-600"}>
                        {match.availableSeats} / {match.totalSeats}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}