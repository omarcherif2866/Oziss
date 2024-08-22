import { Produit } from "./produit";
import { User } from "./user";

export interface Order {
    _id: string;
    client: User;
    produits: {
      produit: Produit;
    }[];
    besoin:string;
    pdf: any[];
    status: 'En attente' | 'Confirmée' | 'Expédiée' | 'Livrée' | 'Annulée';
  }
  