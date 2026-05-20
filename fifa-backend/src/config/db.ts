import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const connString = process.env.MONGO_URI;

    if (!connString) {
      throw new Error("❌ Erreur : La variable MONGO_URI n'est pas définie dans le fichier .env");
    }

    // Connexion à MongoDB via Mongoose
    const conn = await mongoose.connect(connString);
    
    console.log(`📡 MongoDB Connecté avec succès : ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`❌ Échec de la connexion MongoDB : ${error.message}`);
    process.exit(1); // Arrête le serveur si la base de données est inaccessible
  }
};