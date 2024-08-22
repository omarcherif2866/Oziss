export interface Projet {
    _id: string;
    nom?: string;
    description?: string;
    dateDebut?: string; 
    pdf?: any[];
    status?: 'En attente' | 'Terminé' | 'En cours' ;


}