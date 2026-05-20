import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/auth.routes';
import matchRoutes from './routes/match.routes';
import { connectDB } from './config/db';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Déclaration de la brique d'authentification
app.use('/api/auth', authRoutes);
app.use('/api/matchs', matchRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: "OK", message: "Le back-end de la Billetterie FIFA est opérationnel." });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur sécurisé lancé sur : http://localhost:${PORT}`);
});