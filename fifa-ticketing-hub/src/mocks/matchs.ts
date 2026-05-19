export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
}

export interface Seat {
  id: string;
  stadiumId: string;
  section: string;
  row: string;
  number: number;
  price: number; // Inclus pour l'affichage et le calcul du panier
  categoryName: string; // Ex: Catégorie 1, Catégorie 2
  isAvailable: boolean;
}

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  round: "Group" | "Round of 32" | "Round of 16" | "Quarter-Final" | "Semi-Final" | "Final"; // Type Enum du diagramme
  group: string;
  date: string; // DateTime simulé
  stadiumId: string;
  totalSeats: number;
  availableSeats: number;
  // Données jointes pour faciliter le travail du Front-end
  stadium: Stadium;
  seatsMock: Seat[];
}

// 1. Déclaration des Stades (Stadium)
const MOCK_STADIUMS: Record<string, Stadium> = {
  stadium_1: {
    id: "stadium_1",
    name: "MetLife Stadium",
    city: "New York",
    country: "États-Unis",
    capacity: 82500
  },
  stadium_2: {
    id: "stadium_2",
    name: "Estadio Azteca",
    city: "Mexico City",
    country: "Mexique",
    capacity: 87500
  }
};

// 2. Génération de sièges (Seat) respectant les attributs section/row/number du diagramme
const generateSeatsForStadium = (stadiumId: string): Seat[] => [
  { id: `s-${stadiumId}-1`, stadiumId, section: "Tribune Honneur A", row: "Rang 01", number: 42, price: 250, categoryName: "Catégorie 1", isAvailable: true },
  { id: `s-${stadiumId}-2`, stadiumId, section: "Tribune Honneur A", row: "Rang 01", number: 43, price: 250, categoryName: "Catégorie 1", isAvailable: true },
  { id: `s-${stadiumId}-3`, stadiumId, section: "Virage Nord B", row: "Rang 12", number: 110, price: 140, categoryName: "Catégorie 2", isAvailable: true },
  { id: `s-${stadiumId}-4`, stadiumId, section: "Virage Nord B", row: "Rang 12", number: 111, price: 140, categoryName: "Catégorie 2", isAvailable: false }, // Épuisé (isAvailable: false)
  { id: `s-${stadiumId}-5`, stadiumId, section: "Quart de virage C", row: "Rang 25", number: 15, price: 85, categoryName: "Catégorie 3", isAvailable: true }
];

// 3. Export du catalogue aligné sur le diagramme de classes
export const MOCK_MATCHS: Match[] = [
  {
    id: "match_01",
    teamA: "France",
    teamB: "États-Unis",
    round: "Group",
    group: "Groupe A",
    date: "12 Juin 2026 - 20:00",
    stadiumId: "stadium_1",
    totalSeats: 5,
    availableSeats: 4,
    stadium: MOCK_STADIUMS["stadium_1"],
    seatsMock: generateSeatsForStadium("stadium_1")
  },
  {
    id: "match_02",
    teamA: "Mexique",
    teamB: "Allemagne",
    round: "Group",
    group: "Groupe C",
    date: "15 Juin 2026 - 18:00",
    stadiumId: "stadium_2",
    totalSeats: 5,
    availableSeats: 4,
    stadium: MOCK_STADIUMS["stadium_2"],
    seatsMock: generateSeatsForStadium("stadium_2")
  }
];