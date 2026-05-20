import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Match, Seat } from "../mocks/matchs"
import { MapPin, Calendar, Search, Armchair, Trophy, Filter, SlidersHorizontal } from "lucide-react"
import { MOCK_MATCHS } from "../mocks/matchs"

interface MatchCatalogProps {
  matchs?: Match[]; 
  onSelectSeat: (match: Match, seat: Seat) => void;
}

export default function MatchCatalog({ matchs = MOCK_MATCHS, onSelectSeat }: MatchCatalogProps) {
  // 🔍 ÉTATS DES FILTRES MULTICRITÈRES ADVANCED
  const [searchTeam, setSearchTeam] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedStadium, setSelectedStadium] = useState("")
  const [selectedSection, setSelectedSection] = useState("")

  // Extraire dynamiquement les listes uniques pour remplir les menus déroulants de filtrage
  const uniqueDates = useMemo(() => Array.from(new Set(matchs.map(m => m.date.split(" - ")[0]))), [matchs]);
  const uniqueStadiums = useMemo(() => Array.from(new Set(matchs.map(m => m.stadium.name))), [matchs]);
  const uniqueSections = useMemo(() => {
    const sections = new Set<string>();
    matchs.forEach(m => m.seatsMock.forEach(s => sections.add(s.section)));
    return Array.from(sections);
  }, [matchs]);

  // 🚀 MOTEUR DE FILTRAGE MULTICRITÈRES CUMULATIF ET TEMPS RÉEL
  const filteredMatchs = useMemo(() => {
    return matchs.filter(match => {
      const matchesTeamOrCity = 
        match.teamA.toLowerCase().includes(searchTeam.toLowerCase()) ||
        match.teamB.toLowerCase().includes(searchTeam.toLowerCase()) ||
        match.stadium.city.toLowerCase().includes(searchTeam.toLowerCase());
        
      const matchesDate = selectedDate === "" || match.date.includes(selectedDate);
      const matchesStadium = selectedStadium === "" || match.stadium.name === selectedStadium;
      
      // Filtrer le match si au moins un siège correspond à la zone/tribune sélectionnée
      const matchesSection = selectedSection === "" || match.seatsMock.some(s => s.section === selectedSection);

      return matchesTeamOrCity && matchesDate && matchesStadium && matchesSection;
    });
  }, [matchs, searchTeam, selectedDate, selectedStadium, selectedSection]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 animate-in fade-in duration-500">
      
      {/* 🟦 PANNEAU DE RECHERCHE ET FILTRAGE MULTICRITÈRES AVANCÉ */}
      <Card className="border border-slate-200 shadow-xl rounded-2xl bg-white overflow-hidden pt-0">
        <div className="bg-gradient-to-r from-primary to-[#111827] text-white p-4 flex items-center gap-2 border-b border-blue-950">
          <SlidersHorizontal className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-black uppercase tracking-wider">Moteur de recherche multicritères</span>
        </div>
        
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Critère 1 : Recherche textuelle */}
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-slate-400">Équipe, Ville</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="Ex: France, Miami..."
                className="pl-8 h-9 bg-slate-50 border-slate-200 rounded-xl text-xs"
                value={searchTeam}
                onChange={(e) => setSearchTeam(e.target.value)}
              />
            </div>
          </div>

          {/* Critère 2 : Filtrage Date */}
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-slate-400">Calendrier des Matchs</Label>
            <select
              className="w-full h-9 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="">Toutes les dates</option>
              {uniqueDates.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Critère 3 : Sélection du Stade */}
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-slate-400">Enceinte / Stade</Label>
            <select
              className="w-full h-9 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              value={selectedStadium}
              onChange={(e) => setSelectedStadium(e.target.value)}
            >
              <option value="">Tous les stades</option>
              {uniqueStadiums.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Critère 4 : Sélection de la Zone/Tribune */}
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase text-slate-400">Zone / Tribune</Label>
            <select
              className="w-full h-9 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="">Toutes les tribunes</option>
              {uniqueSections.map(sec => <option key={sec} value={sec}>{sec}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Grille des Matchs avec Disponibilités par Catégorie */}
      {filteredMatchs.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Aucune rencontre internationale ne correspond à vos filtres.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredMatchs.map((match) => (
            <Card key={match.id} className="border border-slate-200/80 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden flex flex-col bg-white group pt-0">
              
              {/* En-tête du match (Bleu Royal) */}
              <CardHeader className="bg-gradient-to-b from-primary to-[#111827] text-white p-4 relative border-b border-blue-950 m-0">
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1.5 font-mono text-amber-400 font-bold bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10 text-[11px]">
                    <Calendar className="h-3.5 w-3.5 text-amber-400" /> {match.date}
                  </span>
                  <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-black tracking-wider rounded uppercase py-0.5">
                    {match.round}
                  </Badge>
                </div>

                <div className="pt-3 flex items-center justify-between gap-4">
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg md:text-xl font-black tracking-tight text-white">{match.teamA}</h3>
                  </div>
                  <div className="h-7 w-7 rounded-full bg-slate-950 border border-blue-800/60 flex items-center justify-center text-[10px] font-mono font-bold text-amber-500 shrink-0">
                    VS
                  </div>
                  <div className="flex-1 text-center md:text-right">
                    <h3 className="text-lg md:text-xl font-black tracking-tight text-white">{match.teamB}</h3>
                  </div>
                </div>
              </CardHeader>

              {/* Contenu - Localisation & Disponibilités */}
              <CardContent className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                
                {/* Infos Stade & Compteur de places total */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-blue-50/40 border border-blue-100/40 text-slate-600">
                  <div className="p-1.5 bg-white rounded-lg shadow-sm text-primary border border-slate-100">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">{match.stadium.name}</p>
                    <p className="text-slate-400 font-medium text-[11px]">{match.stadium.city}, {match.stadium.country}</p>
                  </div>
                  
                  <div className="ml-auto text-right shrink-0">
                    <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wider">Disponibilités global</span>
                    <span className="text-xs font-mono font-black text-slate-900 bg-white border border-blue-100 px-2 py-0.5 rounded-md shadow-sm">
                      {match.availableSeats}/{match.totalSeats} places
                    </span>
                  </div>
                </div>

                {/* Grille interactive des Sièges filtrés */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-0.5">
                    Sélectionner un siège disponible par catégorie
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {match.seatsMock
                      // Appliquer dynamiquement le filtre de section à l'intérieur du match pour l'affichage des catégories
                      .filter(seat => selectedSection === "" || seat.section === selectedSection)
                      .map((seat) => (
                        <button
                          key={seat.id}
                          disabled={!seat.isAvailable}
                          onClick={() => onSelectSeat(match, seat)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all relative ${
                            seat.isAvailable
                              ? "bg-white border-slate-200 hover:border-primary hover:shadow-md cursor-pointer group/seat active:scale-[0.98]"
                              : "bg-slate-50 border-slate-100 opacity-40 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                              seat.isAvailable 
                                ? "bg-slate-100 text-slate-800 group-hover/seat:bg-primary group-hover/seat:text-white" 
                                : "bg-slate-200 text-slate-400"
                            }`}>
                              <Armchair className="h-3.5 w-3.5" />
                            </div>
                            
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-slate-900 text-xs truncate">
                                {seat.section}
                              </p>
                              <span className="text-[9px] text-slate-400 font-mono block mt-0.5">
                                {seat.row} • N°{seat.number}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0 flex flex-col items-end gap-1 pl-2">
                            <span className="text-[8px] font-black uppercase tracking-tight text-primary bg-blue-50 border border-blue-100 px-1 py-0.5 rounded">
                              {seat.categoryName}
                            </span>
                            <span className="font-mono font-black text-xs text-slate-900 group-hover/seat:text-primary transition-colors">
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