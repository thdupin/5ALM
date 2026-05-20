import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js"; // Utilisation du vrai modèle Mongoose

const SALT_ROUNDS = 10;

/**
 * 📝 INSCRIPTION (REGISTER)
 * Sauvegarde un nouvel utilisateur dans la base MongoDB 'fifa-db'
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstname, lastname, phone, email, password } = req.body;

    // 1. Validation de présence des données requises (CamelCase respecté selon le modèle)
    if (!firstname || !lastname || !phone || !email || !password) {
      res.status(400).json({ error: "Tous les champs sont obligatoires (firstname, lastname, phone, email, password)." });
      return;
    }

    // 2. Vérification de l'existence de l'email via MongoDB
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      res.status(409).json({ error: "Cette adresse email est déjà associée à un compte." });
      return;
    }

    // 3. Hachage du mot de passe (Sécurité Back-end)
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // 4. Attribution dynamique du rôle et des permissions (Gestion de la classe Admin héritée)
    const isAdminEmail = email.toLowerCase().endsWith("@fifa.org");
    const role = isAdminEmail ? "admin" : "supporter";
    const permissions = isAdminEmail ? ["manageMatch", "viewStats"] : [];

    // 5. Création et persistance du document Mongoose
    const newUser = new User({
      firstName: firstname, // Mappé sur le modèle strict 'firstName'
      lastName: lastname,   // Mappé sur le modèle strict 'lastName'
      phone,
      email: email.toLowerCase(),
      passwordHash,
      role,
      permissions
    });

    await newUser.save();
    console.log(`✨ Nouvel utilisateur enregistré dans MongoDB : ${newUser.email}`);

    // 6. Réponse (On ne retourne JAMAIS le passwordHash pour des raisons de sécurité)
    res.status(201).json({
      message: "Utilisateur créé avec succès.",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error("Erreur register:", error);
    res.status(500).json({ error: "Une erreur interne est survenue lors de l'inscription." });
  }
};

/**
 * 🔑 CONNEXION (LOGIN)
 * Vérifie les identifiants depuis la collection MongoDB
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email et mot de passe requis." });
      return;
    }

    // 1. Recherche de l'utilisateur par son email dans MongoDB
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ error: "Identifiants invalides." });
      return;
    }

    // 2. Comparaison cryptographique du mot de passe via Bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Identifiants invalides." });
      return;
    }

    console.log(`🔐 Connexion réussie pour : ${user.email} (${user.role})`);

    // 3. Réponse positive renvoyée au Front-end
    res.status(200).json({
      message: "Authentification réussie.",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        permissions: user.permissions,
      }
    });

  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ error: "Une erreur interne est survenue lors de la connexion." });
  }
};

export const oauthLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, firstname, lastname, phone } = req.body;

    if (!email) {
      res.status(400).json({ error: "L'adresse email transmise par le fournisseur social est absente." });
      return;
    }

    // 1. Vérifier si l'utilisateur existe déjà dans MongoDB
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`📡 Inscription automatique via réseau tiers pour : ${email}`);
      
      const isAdminEmail = email.toLowerCase().endsWith("@fifa.org");
      const role = isAdminEmail ? "admin" : "supporter";
      const permissions = isAdminEmail ? ["manageMatch", "viewStats"] : [];

      // 2. Si le compte n'existe pas, on le crée à la volée avec un flag vérifié
      user = new User({
        firstName: firstname || "Supporter",
        lastName: lastname || "FIFA",
        phone: phone || "0000000000",
        email: email.toLowerCase(),
        passwordHash: "OAUTH_EXTERNAL_ACCOUNT", // Pas de mot de passe à stocker localement
        role,
        permissions,
        isVerified: true, // Identité déjà validée de confiance par le tiers de confiance (Google / GitHub)
        twoFASecret: ""
      });

      await user.save();
    }

    console.log(`🔐 Connexion validée via SSO pour : ${user.email}`);

    // 3. Réponse renvoyée au Front-end
    res.status(200).json({
      message: "Authentification via SSO validée.",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        permissions: user.permissions,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error("Erreur OAuth:", error);
    res.status(500).json({ error: "Une erreur interne est survenue lors de l'échange OAuth." });
  }
};