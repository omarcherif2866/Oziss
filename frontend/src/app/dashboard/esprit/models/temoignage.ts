import { User } from "./user";

export interface Temoignage {
    _id: string;
    text?: string;
    createur?: User;  

}
