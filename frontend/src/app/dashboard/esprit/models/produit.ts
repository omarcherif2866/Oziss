import { Service } from "../models/service";

export interface Produit {
    _id: string;
    nom?: string;
    description?: string;
    image?: string;
    service: Service | null;  // Permet à `service` d'être soit `Service`, soit `null`
}