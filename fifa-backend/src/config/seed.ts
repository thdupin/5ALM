import mongoose from "mongoose";
import { Match } from "../models/match.model.js";
import 'dotenv/config';

const sampleMatch = {
  teamA: "France",
  teamB: "Argentine",
  round: "Finale",
  group: "A",
  date: new Date("2026-07-19T21:00:00Z"),
  stadiumId: "STAD-METLIFE-01",
  totalSeats: 80000,
  availableSeats: 2, // Cohérent avec les 2 sièges fournis ci-dessous
  stadium: {
    name: "MetLife Stadium",
    city: "East Rutherford",
    country: "USA",
    capacity: 82500
  },
  seats: [
    {
      id: "SEAT-01-A",
      stadiumId: "STAD-METLIFE-01",
      section: "Tribune Nord - Catégorie 1",
      row: "Rangée A",
      number: 12,
      categoryName: "Catégorie 1",
      price: 180,
      isAvailable: true
    },
    {
      id: "SEAT-02-B",
      stadiumId: "STAD-METLIFE-01",
      section: "Tribune Sud - Catégorie 2",
      row: "Rangée G",
      number: 45,
      categoryName: "Catégorie 2",
      price: 120,
      isAvailable: true
    }
  ]
};

async function runSeed() {
  try {
    const connString = process.env.MONGO_URI;
    if (!connString) {
      throw new Error("Variable MONGO_URI manquante dans le .env");
    }

    console.log("🔄 Connexion à MongoDB pour le seeding...");
    await mongoose.connect(connString);

    // 1. Nettoyage de la collection existante pour repartir à zéro
    console.log("🧹 Nettoyage de la table Matchs...");
    await Match.deleteMany({});

    // 2. Mongoose va créer la collection "matches" et insérer le document complet
    console.log("📥 Insertion des données de démonstration conformes à l'UML...");
    const createdMatch = new Match(sampleMatch);
    await createdMatch.save();

    console.log("✅ Base de données initialisée avec succès !");
    console.log(`⚽ Match créé : ${createdMatch.teamA} vs ${createdMatch.teamB}`);
    
    // Fermer proprement la connexion à la fin du script
    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error("❌ Erreur pendant le seeding :", error);
    process.exit(1);
  }
}

// Lancement du script
runSeed();