import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Profil  from "../models/Profil.js";
import Apprenants  from "../models/Apprenant.js";
import Formateurs  from "../models/Formateur.js";
import Admins  from "../models/Administrateur.js";
import User from '../models/User.js'; // Assurez-vous que le chemin est correct


const jwtsecret = "mysecret";

const generateHashedPassword = async (motdepasse) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(motdepasse, saltRounds);
  return hashedPassword;
};




const signup = async (req, res) => {
  const {
    userType, nom, email, password, confirmPassword, phoneNumber, companyName,
    industry, position, servicesNeeded, mainObjectives, estimatedBudget,
    partnershipType, partnershipObjectives, availableResources
  } = req.body;

  try {
    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Vérification de l'image de profil
    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // Vérification de la confirmation du mot de passe
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 8);

    // Création de l'utilisateur
    const newUser = new User({
      userType,
      nom,
      email,
      password: hashedPassword,
      image: imageFile.filename,
      confirmPassword: hashedPassword, // Vous pouvez décider de ne pas stocker la confirmation du mot de passe
      phoneNumber,
      companyName,
      industry,
      position,
      // Champs spécifiques aux clients
      servicesNeeded: userType === 'client' ? servicesNeeded : undefined,
      mainObjectives: userType === 'client' ? mainObjectives : undefined,
      estimatedBudget: userType === 'client' ? estimatedBudget : undefined,
      // Champs spécifiques aux partenaires
      partnershipType: userType === 'partner' ? partnershipType : undefined,
      partnershipObjectives: userType === 'partner' ? partnershipObjectives : undefined,
      availableResources: userType === 'partner' ? availableResources : undefined
    });

    await newUser.save();

    res.json({ newUser });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: 'Error registering user' });
  }
};




const getUser = async (req, res, next) => {

    try {
    const cookie = req.cookies['jwt'];
    const claims = jwt.verify(cookie, 'secret');
    if (!claims) {
        return res.status(401).json({message: "utilisateur non connecte"})
    }
    const userr = await User.findOne({where: {id: claims.id}});
    const {password, ...data} = await userr.toJSON();
    res.send(data);
}catch(err){
    return res.status(401).json({message: "utilisateur non connecte"})
}
next
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!process.env.jwt_Secret) {
      return res.status(500).json({ message: 'JWT secret key is missing' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.jwt_Secret, {
      expiresIn: 31557600, // 24 hours
    });

    req.session.token = token;

    res.status(200).json({
      _id: user._id,
      nom: user.nom,
      email: user.email,
      token: token,
      userType: user.userType, // Include user role here
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error signing in' });
  }
};

const signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error signing out' });
  }
};

export function getUserById(req, res) {
  const userId = req.params.id;

  User.findById(userId)
    .then((doc) => {
      if (!doc) {
        // Gérer le cas où l'utilisateur n'est pas trouvé
        res.status(404).json({ message: 'Utilisateur non trouvé' });
      } else {
        res.status(200).json(doc);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export async function updateUserProfile(req, res) {
  try {
    // Extraire les champs du corps de la requête
    const { nom, email, password, confirmPassword, phoneNumber, companyName, industry, position, 
            servicesNeeded, mainObjectives, estimatedBudget, partnershipType, partnershipObjectives, availableResources } = req.body;

    // Préparer l'objet à mettre à jour
    let updateData = { nom, email, password, confirmPassword, phoneNumber, companyName, industry, position,
                        servicesNeeded, mainObjectives, estimatedBudget, partnershipType, partnershipObjectives, availableResources };

    // Gérer le fichier image si présent
    if (req.file) {
      console.log('File received:', req.file);
      updateData.image = req.file.filename; // Assurez-vous que le chemin est correct pour le stockage
    }

    // Mettre à jour l'utilisateur dans la base de données
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    // Répondre en fonction du résultat
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil utilisateur :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil utilisateur' });
  }
}

const putPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Hash the new password
    const hashPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export function getAll(req, res) {
  User
    .find({})

    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}


export async function putUser(req, res) {
  try {
    const { nom, adresse, role } = req.body; // Ajoutez role ici
    console.log("Données reçues du client :", req.body); // Log des données reçues du client

    let profile = { nom, adresse, role }; // Utilisez role dans le profil
    console.log("Profil à mettre à jour :", profile); // Log du profil à mettre à jour

    const updatedUser = await Profil.findByIdAndUpdate(req.params.id, profile, { new: true });
    console.log("Utilisateur mis à jour :", updatedUser); // Log de l'utilisateur mis à jour

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil utilisateur :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil utilisateur' });
  }
}


export async function DeleteUser(req, res) {
  const id =req.params.id
  const prd = await User.findByIdAndDelete(id);
  res.status(200).json({"message":" user deleted"});
}

//deleteUser a re-implementer


export const countUsersByType = async (req, res) => {
  try {
    console.log('Counting users by type...');
    const clientCount = await User.countDocuments({ userType: 'client' });
    const partnerCount = await User.countDocuments({ userType: 'partner' });
    console.log('Client count:', clientCount);
    console.log('Partner count:', partnerCount);
    res.json({ clientCount, partnerCount });
  } catch (error) {
    console.error('Error counting users:', error);
    res.status(500).json({ message: 'Error counting users' });
  }
};

export const getClientBudgets = async (req, res) => {
  try {
    // Trouver tous les utilisateurs avec userType 'client'
    const clients = await User.find({ userType: 'client' }, 'nom estimatedBudget');

    // Si des clients sont trouvés, renvoyer les budgets
    if (clients.length > 0) {
      const budgets = clients.map(client => ({
        name: client.nom,
        budget: client.estimatedBudget
      }));
      res.json(budgets);
    } else {
      res.json({ message: 'No clients found' });
    }
  } catch (error) {
    console.error('Error fetching client budgets:', error);
    res.status(500).json({ message: 'Error fetching client budgets' });
  }
};

export async function addCommercial(req, res) {
  try {
    console.log("Données reçues :", req.body); // Ajoutez cette ligne pour déboguer

    const { nom, email, password, phoneNumber } = req.body;

    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);


    // Créez un nouvel utilisateur de type 'commercial'
    const newCommercial = new User({
      userType: 'commercial',
      nom,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword, // Vous pouvez décider de ne pas stocker la confirmation du mot de passe
      phoneNumber,
      image: imageFile.filename,
    });

    // Enregistrez l'utilisateur dans la base de données
    await newCommercial.save();

    console.log('Commercial ajouté avec succès:', newCommercial);
    return res.status(201).json(newCommercial);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commercial:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


export { signup, signin, signout, getUser, putPassword};