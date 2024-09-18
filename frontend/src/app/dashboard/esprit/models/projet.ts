import { User } from "./user";

export interface Projet {
    _id: string;
    nom?: string;
    description?: string;
    dateDebut?: string; 
    ownedBy?: User; 
    with?: User; 
    pdf?: any[];
    status?: 'En attente' | 'Terminé' | 'En cours' ;


}