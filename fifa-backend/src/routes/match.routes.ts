import { Router } from "express";
import { getCatalog, getMatchById } from "../controllers/match.controller.js";

const router = Router();

// Route principale du catalogue (gère aussi les filtres passés en query strings)
// Exemple : http://localhost:5000/api/matchs?teamOrCity=France
router.get("/", getCatalog);

// Route pour inspecter un match précis
router.get("/:id", getMatchById);

export default router;