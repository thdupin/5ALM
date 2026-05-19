import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MOCK_MATCHS, Match, Seat } from "../mocks/matchs"
import { MapPin, Calendar, Layers, Armchair } from "lucide-react"

interface MatchCatalogProps {
  onSelectSeat: (match: Match, seat: Seat) => void;
}

export default function MatchCatalog({ onSelectSeat }: MatchCatalogProps) {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto mb-8">
        <Badge className="bg-amber-500 text-slate-900 font-bold mb-2 hover:bg-amber-500">
          FIFA TICKETING CORE
        </Badge>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Catalogue des Matchs
        </h2>
        <p className="text-slate-500 mt-2">
          Sélectionnez un match et réservez un siège unique indexé sur le plan officiel des stades.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {MOCK_MATCHS.map((match) => (
          <Card key={match.id} className="border-slate-200 shadow-md flex flex-col justify-between">
            {/* Header du Match */}
            <CardHeader className="bg-slate-950 text-white rounded-t-xl p-5">
              <div className="flex justify-between items-center text-xs text-amber-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> {match.date}
                </span>
                <Badge variant="outline" className="text-amber-400 border-amber-400 text-[10px]">
                  {match.round} — {match.group}
                </Badge>
              </div>
              <CardTitle className="text-2xl font-black tracking-tight mt-2 flex items-center justify-between">
                <span>{match.teamA}</span>
                <span className="text-sm font-light text-slate-400 px-3">VS</span>
                <span>{match.teamB}</span>
              </CardTitle>
            </CardHeader>

            {/* Infos du Stade (Relation 1 à 1) */}
            <CardContent className="p-5 space-y-4 flex-1">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-start gap-2.5 text-sm text-slate-600">
                <MapPin className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">{match.stadium.name}</p>
                  <p className="text-xs text-slate-500">{match.stadium.city}, {match.stadium.country}</p>
                </div>
              </div>

              {/* Inventaire des sièges réels (Relation 1..*) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" /> Sélectionner un siège disponible
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    Capacité : {match.availableSeats}/{match.totalSeats} places
                  </span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {match.seatsMock.map((seat) => (
                    <div 
                      key={seat.id} 
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        seat.isAvailable 
                          ? "bg-white border-slate-200 hover:border-amber-500 shadow-sm" 
                          : "bg-slate-50 border-slate-100 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${seat.isAvailable ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-400"}`}>
                          <Armchair className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-800 text-sm">{seat.section}</p>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
                              {seat.categoryName}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-mono">
                            {seat.row} — N°{seat.number}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-mono font-black text-sm text-slate-900 mb-1">{seat.price} €</p>
                        {seat.isAvailable ? (
                          <Button 
                            size="sm" 
                            className="h-7 text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold"
                            onClick={() => onSelectSeat(match, seat)}
                          >
                            Réserver
                          </Button>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] bg-red-100 text-red-700 hover:bg-red-100">
                            Occupé
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}