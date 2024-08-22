import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import cookieSession from 'cookie-session';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import { notFoundError, errorHandler } from './middlewares/error-handler.js';
import bodyParser from 'body-parser';

import DomainesRoutes from './routes/Domaine.js'; 
import FormationRoutes from './routes/Formation.js'; 
import AuthRoutes from './routes/auth.js';
import UserRoutes from './routes/User.js';
import FormateursRoutes from './routes/Formateur.js';
import SessionCoursRoutes from './routes/sessionCoursId.js';
import ApprenantsRoutes from './routes/Apprenant.js';
import ProfilsRoutes from './routes/Profil.js';
import AdministrateursRoutes from './routes/Administrateur.js';
import ServiceRoutes from './routes/service.js';
import ProduitRoutes from './routes/Produit.js';
import OrderRoutes from './routes/Order.js';
import EmailRoutes from './routes/emailRoute.js';
import ReunionRoutes from './routes/Reunion.js';
import ProjetRoutes from './routes/projet.js';



const app = express(); 
const hostname = '127.0.0.1'; 
const port = process.env.PORT || 9090; 
const databaseName = 'oziss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

mongoose.set('debug', true);
mongoose.Promise = global.Promise;

mongoose
  .connect(`mongodb://127.0.0.1:27017/${databaseName}`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch(err => {
    console.log(err);
  });

app.use(cors({
  origin: ['http://localhost:4200'],
  credentials: true // Autorise l'envoi de cookies avec les requêtes CORS
}));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/img', express.static('public/images'));
app.use('/pdf', express.static('public/pdfs'));

app.use(cookieSession({
  name: "projectPi-session",
  secret: process.env.SESSION_SECRET,
  httpOnly: true,
  sameSite: 'none', // Autorise les cookies dans les requêtes entre sites
  secure: true, // Requis pour sameSite: 'none'
  maxAge: 24 * 60 * 60 * 1000 // 24 heures
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: true, // Requis pour sameSite: 'none'
    sameSite: 'none', // Autorise les cookies dans les requêtes entre sites
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  }
}));

app.use('/formations', FormationRoutes);
app.use('/formateur', FormateursRoutes);
app.use('/domaine', DomainesRoutes);
app.use('/sessionCours', SessionCoursRoutes);
app.use('/api', AuthRoutes);
app.use('/apprenant', ApprenantsRoutes);
app.use('/profil', ProfilsRoutes);
app.use('/admin', AdministrateursRoutes);
app.use('/user', UserRoutes);
app.use('/service', ServiceRoutes);
app.use('/produit', ProduitRoutes);
app.use('/commande', OrderRoutes);
app.use('/mailing', EmailRoutes);
app.use('/reunion', ReunionRoutes);
app.use('/Projet', ProjetRoutes);


app.use(notFoundError);
app.use(errorHandler);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
