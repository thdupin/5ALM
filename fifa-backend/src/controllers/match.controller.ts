import { Request, Response } from "express";
import { Match } from "../models/match.model.js";

/**
 * ⚽ US-02 : CONSULTER LE CATALOGUE DES MATCHS (AVEC FILTRAGE MULTICRITÈRES)
 * GET /api/matchs
 * Query params optionnels : teamOrCity, date, stadiumName, section
 */
export const getCatalog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamOrCity, date, stadiumName, section } = req.query;
    
    // Construction dynamique de la requête MongoDB
    const mongoQuery: any = {};

    // 1. Filtre textuel cumulatif sur Équipes ou Ville (Insensible à la casse)
    if (teamOrCity) {
      const searchRegex = new RegExp(teamOrCity as string, "i");
      mongoQuery.$or = [
        { teamA: searchRegex },
        { teamB: searchRegex },
        { "stadium.city": searchRegex }
      ];
    }

    // 2. Filtre précis sur la date (Recherche par correspondance partielle ou totale)
    if (date) {
      // Si votre date en BDD est un type Date standard, on filtre par jour
      const startOfDay = new Date(date as string);
      if (!isNaN(startOfDay.getTime())) {
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);
        mongoQuery.date = { $gte: startOfDay, $lt: endOfDay };
      }
    }

    // 3. Filtre sur l'enceinte sportive / Stade
    if (stadiumName) {
      mongoQuery["stadium.name"] = new RegExp(stadiumName as string, "i");
    }

    // 4. Filtre sur la Zone / Tribune (Vérifie la présence dans la sous-structure)
    if (section) {
      mongoQuery["seats.section"] = new RegExp(section as string, "i");
    }

    // Exécution de la requête sur MongoDB Atlas avec tri par date chronologique
    const catalog = await Match.find(mongoQuery).sort({ date: 1 });

    // Formatage de la réponse pour le Front-end
    // Permet d'isoler l'état global et les métadonnées de disponibilité par catégorie
    const responsePayload = catalog.map(match => {
      // Compter dynamiquement les sièges disponibles (simulation ou état de liste)
      // Note : Dans un système de production, on utilise une agrégation, mais ici map() reste ultra-efficace pour le volume de l'examen.
      const totalSeatsCount = match.seats.length;
      const availableSeatsCount = match.seats.filter(s => s.isAvailable !== false).length;

      return {
        id: match._id,
        teamA: match.teamA,
        teamB: match.teamB,
        round: match.round,
        group: match.group,
        date: match.date,
        stadiumId: match.stadiumId,
        totalSeats: totalSeatsCount || match.totalSeats,
        availableSeats: availableSeatsCount,
        stadium: match.stadium,
        seatsMock: match.seats // Transmet la liste des sièges pour le plan de salle interactif
      };
    });

    res.status(200).json(responsePayload);

  } catch (error: any) {
    console.error("Erreur US-02 Catalogue:", error);
    res.status(500).json({ error: "Impossible de charger le catalogue des matchs en temps réel." });
  }
};

/**
 * 🔍 US-02 (Complément) : OBTENIR LES INFOS D'UN MATCH SPÉCIFIQUE
 * GET /api/matchs/:id
 */
export const getMatchById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const match = await Match.findById(id);

    if (!match) {
      res.status(404).json({ error: "La rencontre demandée est introuvable." });
      return;
    }

    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération de la rencontre." });
  }
};