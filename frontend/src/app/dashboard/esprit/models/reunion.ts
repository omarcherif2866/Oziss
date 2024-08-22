import { User } from "./user";

export interface Reunion {
    _id: string;
    nom?: string;
    description?: string;
    date?: string;
    heureDebut?: string;  
    heureFin?: string;  
    logiciel?: string;  // Changer en tableau de chaînes de caractères
    createur?: User;  
    deuxiemeMembre?: User;  
    status?: 'En attente' | 'Confirmée' | 'Refusée' ;


}