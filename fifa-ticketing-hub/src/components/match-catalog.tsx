import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Match, Seat } from "../mocks/matchs"
import { MapPin, Calendar, Search, Armchair, Trophy, Sparkles } from "lucide-react"
import { MOCK_MATCHS } from "../mocks/matchs"

interface MatchCatalogProps {
  matchs?: Match[]; 
  onSelectSeat: (match: Match, seat: Seat) => void;
}

export default function MatchCatalog({ matchs = MOCK_MATCHS, onSelectSeat }: MatchCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filtrage dynamique (Remplit l'objectif de la US-08 - Should Have)
  const filteredMatchs = matchs.filter(match => 
    match.teamA.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.teamB.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.stadium.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 animate-in fade-in duration-500">
      
      {/* Hero Header FIFA World Cup 2026 */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 md:p-12 shadow-2xl border border-slate-800">
        {/* Halo lumineux couleur Or FIFA */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-5">
          
          {/* 👑 NOUVEAU BADGE PREMIUM ULTRA-MODERNE */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-md text-amber-400 text-[10px] font-black uppercase tracking-widest shadow-inner">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
            </span>
            <Trophy className="h-3.5 w-3.5 fill-amber-400/20 text-amber-400" />
            <span>Billetterie Officielle FIFA</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-amber-100 to-slate-300 bg-clip-text text-transparent">
            Visez l'Excellence Mondiale
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Réservez vos sièges certifiés pour la Coupe du Monde 2026. L'infrastructure de l'ESN AST garantit des verrous de sécurité en temps réel pour empêcher toute surréservation.
          </p>
          
          {/* Barre de recherche intégrée (US-08) */}
          <div className="relative max-w-md pt-2">
            <Search className="absolute left-3.5 top-5.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Filtrer par équipe, ville, stade..."
              className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-amber-500 focus-visible:border-amber-500 rounded-xl backdrop-blur-md transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grille des Matchs */}
      {filteredMatchs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">Aucune rencontre internationale ne correspond à vos critères.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filteredMatchs.map((match) => (
            <Card key={match.id} className="border border-slate-200/80 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden flex flex-col bg-white group pt-0">
              
              {/* En-tête du match - Couleur Thème FIFA Bleu Nuit avec accents Or */}
              <CardHeader className="bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6 relative rounded-t-3xl border-b border-slate-800 m-0">
                <div className="absolute top-0 right-0 w-32 h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />
                
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1.5 font-mono text-amber-500 font-bold bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                    <Calendar className="h-3.5 w-3.5 text-amber-500" /> {match.date}
                  </span>
                  <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold tracking-wider rounded-md uppercase">
                    {match.round}
                  </Badge>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4">
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl md:text-2xl font-black tracking-tight text-white">{match.teamA}</h3>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-slate-800 border border-amber-500/20 flex items-center justify-center text-xs font-mono font-bold text-amber-500 shrink-0 shadow-inner">
                    VS
                  </div>
                  <div className="flex-1 text-center md:text-right">
                    <h3 className="text-xl md:text-2xl font-black tracking-tight text-white">{match.teamB}</h3>
                  </div>
                </div>
              </CardHeader>

              {/* Contenu - Localisation & Grille interactive des Sièges */}
              <CardContent className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                
                {/* Infos Stade (Relation 1-1 du diagramme de classes) */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 transition-colors group-hover:bg-slate-100/50">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-amber-500 border border-slate-100">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="text-xs md:text-sm">
                    <p className="font-bold text-slate-900">{match.stadium.name}</p>
                    <p className="text-slate-500 font-medium">{match.stadium.city}, {match.stadium.country}</p>
                  </div>
                  <div className="ml-auto text-right shrink-0">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Stocks</span>
                    <span className="text-xs font-mono font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-sm">
                      {match.availableSeats}/{match.totalSeats} places
                    </span>
                  </div>
                </div>

                {/* Plan de Salle en Grille de Boutons (Relation 1..* avec Seat) */}
                <div className="space-y-3">
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 block">
                    Sélectionner un siège sur le plan de la tribune
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                    {match.seatsMock.map((seat) => (
                      <button
                        key={seat.id}
                        disabled={!seat.isAvailable}
                        onClick={() => onSelectSeat(match, seat)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all relative ${
                          seat.isAvailable
                            ? "bg-white border-slate-200 hover:border-amber-500 hover:shadow-md cursor-pointer group/seat active:scale-[0.98]"
                            : "bg-slate-50 border-slate-100 opacity-40 cursor-not-allowed"
                        }`}
                      >
                        {/* Partie gauche : Icône + Infos Siège */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={`p-2 rounded-lg transition-colors shrink-0 ${
                            seat.isAvailable 
                              ? "bg-slate-100 text-slate-800 group-hover/seat:bg-slate-900 group-hover/seat:text-white" 
                              : "bg-slate-200 text-slate-400"
                          }`}>
                            <Armchair className="h-4 w-4" />
                          </div>
                          
                          {/* Structure en colonne pour éviter les télescopages */}
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900 text-xs truncate pr-1">
                              {seat.section}
                            </p>
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                              {seat.row} • N°{seat.number}
                            </span>
                          </div>
                        </div>

                        {/* Partie droite : Catégorie + Prix alignés proprement */}
                        <div className="text-right shrink-0 flex flex-col justify-between items-end h-full gap-2 pl-2">
                          <span className="text-[9px] font-black uppercase tracking-tight text-amber-600 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                            {seat.categoryName}
                          </span>
                          <span className="font-mono font-black text-xs text-slate-900 group-hover/seat:text-amber-600 transition-colors">
                            {seat.price} €
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}