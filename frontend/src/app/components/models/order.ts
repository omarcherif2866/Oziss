import { Produit } from "./produit";
import { User } from "./user";

export interface Order {
    _id: string;
    client: User;
    produits: {
      produit: Produit;
    }[];
    besoin:string;
    budget:number;
    monnaie?: Monnaie; // Utilisation de l'énumération
    pdf: any[];
    status: 'En attente' | 'Confirmée' | 'Expédiée' | 'Livrée' | 'Annulée';
  }
  
  export enum Monnaie {
    Euro = 'Euro',
    Dollar = 'Dollar',
    FrancCFA_CEMAC = 'Franc CFA (CEMAC)',
    FrancGuineen = 'Franc guinéen',
    FrancCFA_UEMOA = 'Franc CFA (UEMOA)',
    DinarTunisien = 'Dinar tunisien'
  }
  